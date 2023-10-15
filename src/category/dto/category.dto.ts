import { IsString } from 'class-validator'
import { Prisma } from '@prisma/client'

export class CategoryDto implements Prisma.CategoryUpdateInput {
	@IsString()
	name: string
}
