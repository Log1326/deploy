import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ReviewDto } from './dto/review.dto'
import { ProductService } from '../product/product.service'
import { reviewFields } from './dto/select-review.fields'

@Injectable()
export class ReviewService {
	constructor(private prisma: PrismaService, private product: ProductService) {}
	private async byIdReviewBool(id: number) {
		const res = await this.prisma.review.findUnique({ where: { id } })
		if (!res) throw new NotFoundException('Review not found')
		return !!res
	}
	async getAll() {
		return this.prisma.review.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			select: reviewFields
		})
	}
	async create(userId: number, dto: ReviewDto, productId: number) {
		await this.product.getProductById(productId)
		return this.prisma.review.create({
			data: {
				...dto,
				product: { connect: { id: productId } },
				user: { connect: { id: userId } }
			}
		})
	}
	async getAverageValueByProductId(productId: number) {
		await this.product.getProductById(productId)
		return this.prisma.review
			.aggregate({
				where: { productId },
				_avg: { rating: true }
			})
			.then(data => data._avg)
	}
	async delete(id: number) {
		const validate = await this.byIdReviewBool(id)
		await this.prisma.review.delete({ where: { id } })
		return { message: validate ? 'remove success' : 'remove fallen' }
	}
	async update(id: number, dto: ReviewDto) {
		await this.byIdReviewBool(id)
		return this.prisma.review.update({
			where: { id },
			data: { rating: dto.rating, text: dto.text }
		})
	}
}
