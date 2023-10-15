import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { categoryFields } from './dto/select-category.fields'
import { CategoryDto } from './dto/category.dto'
import { generateSlug } from '../utils/generate-slug'
import { checkQueryFields } from '../utils/checkQueryFields'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}
	async byIdBool(id: number): Promise<boolean> {
		const res = await this.prisma.category.findUnique({ where: { id } })
		if (!res) {
			throw new NotFoundException('Category not found')
		}
		return !!res
	}
	async byIdAndSlug(tag) {
		const where = checkQueryFields(tag)
		const category = await this.prisma.category.findUnique({
			where: where,
			select: categoryFields
		})
		if (!category) {
			throw new NotFoundException('Category not found')
		}
		return category
	}
	async getAll() {
		return this.prisma.category.findMany({
			select: categoryFields
		})
	}
	async update(id: number, dto: CategoryDto) {
		await this.byIdBool(id)
		return this.prisma.category.update({
			where: { id },
			data: { name: dto.name, slug: generateSlug(dto.name) }
		})
	}
	async delete(id: number) {
		await this.byIdBool(id)
		return this.prisma.category.delete({ where: { id } })
	}
	async create() {
		return this.prisma.category.create({ data: { name: '', slug: '' } })
	}
}
