import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'
import {
	productFields,
	productsFieldsFullest
} from './dto/select-product.fields'
import { AllProductDto, ProductDto } from './dto/product.dto'
import { generateSlug } from '../utils/generate-slug'
import { PaginationService } from '../pagination/pagination.service'
import { checkQueryFields } from '../utils/checkQueryFields'
import { checkSortParam } from '../utils/sorted'

@Injectable()
export class ProductService {
	constructor(
		private paginationService: PaginationService,
		private prisma: PrismaService
	) {}
	async getAll(dto: AllProductDto = {}) {
		const sorted = checkSortParam(dto)

		const prismaSearchTermFilter: Prisma.ProductWhereInput = dto.searchTerm
			? {
					OR: [
						{
							category: {
								name: { contains: dto.searchTerm, mode: 'insensitive' }
							}
						},
						{ name: { contains: dto.searchTerm, mode: 'insensitive' } },
						{ description: { contains: dto.searchTerm, mode: 'insensitive' } }
					]
			  }
			: {}
		const { perPage, skip } = this.paginationService.getPagination(dto)
		const products = await this.prisma.product.findMany({
			where: prismaSearchTermFilter,
			orderBy: sorted,
			skip,
			take: perPage,
			include: { users: true, category: true, reviews: true }
		})
		return {
			products,
			length: await this.prisma.product.count({ where: prismaSearchTermFilter })
		}
	}
	async getProductById(tag, otherSelects: Prisma.ProductSelect = {}) {
		const where = typeof tag !== 'object' ? { id: tag } : checkQueryFields(tag)
		const product = await this.prisma.product.findUnique({
			where: where,
			select: { ...productsFieldsFullest, ...otherSelects }
		})
		if (!product) throw new NotFoundException('Product not found')
		return product
	}
	async getBySlugCategory(category: string) {
		const product = await this.prisma.product.findMany({
			where: {
				category: {
					slug: category
				}
			},
			select: productsFieldsFullest
		})
		if (!product) throw new NotFoundException('Product not found')
		return product
	}
	async getSimilar(id: number) {
		if (isNaN(id)) {
			return { message: 'id must be a number' }
		}
		const currentProduct = await this.getProductById(id)
		if (!currentProduct)
			throw new NotFoundException('Current product not found')
		return this.prisma.product.findMany({
			where: {
				category: { name: currentProduct.category.name },
				NOT: { id: currentProduct.id }
			},
			orderBy: {
				createdAt: 'desc'
			},
			select: productFields
		})
	}
	async create() {
		const product = await this.prisma.product.create({
			data: {
				description: '',
				name: '',
				price: 0,
				slug: ''
			}
		})
		return product.id
	}
	async update(id: number, dto: ProductDto) {
		const { categoryId, ...othersData } = dto
		await this.checkProductId(id)
		return this.prisma.product.update({
			where: { id },
			data: {
				...othersData,
				slug: generateSlug(dto.name),
				category: { connect: { id: categoryId } }
			}
		})
	}
	async delete(id: number) {
		return this.prisma.product.delete({ where: { id } })
	}
	async toggleProductFavorite(userId: number, productId: number) {
		const product = await this.prisma.product.findUnique({
			where: { id: productId },
			include: { users: true }
		})
		const isExists = product.users.some(user => user.id === userId)
		await this.prisma.product.update({
			where: { id: product.id },
			data: {
				users: {
					[isExists ? 'disconnect' : 'connect']: { id: userId }
				}
			}
		})
		return { message: !isExists ? 'add user' : 'remove user' }
	}

	private async checkProductId(id: number) {
		const product = await this.prisma.product.findUnique({
			where: { id }
		})
		if (!product) throw new NotFoundException('Product not found')
		return product
	}
	private async checkProductByCategoryId(id: number) {
		const product = await this.prisma.product.findMany({
			where: { id }
		})
		if (!product) throw new NotFoundException('Product not found')
		return product
	}
}
