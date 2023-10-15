import {
	ArrayMinSize,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString
} from 'class-validator'
import { Prisma } from '@prisma/client'

export class ProductDto implements Prisma.ProductUpdateInput {
	@IsString()
	name: string
	@IsNumber()
	price: number
	@IsOptional()
	@IsString()
	description?: string
	@IsOptional()
	@IsString({ each: true })
	@ArrayMinSize(1)
	images?: string[]
	@IsNumber()
	categoryId: number
}
export enum EnumProductSort {
	HIGH_PRICE = 'high-price',
	LOW_PRICE = 'low-price',
	NOWEST = 'nowest',
	OLDEST = 'oldest'
}
class PaginationDto {
	@IsString()
	@IsOptional()
	page?: string
	@IsOptional()
	@IsString()
	perPage?: string
}
export class AllProductDto extends PaginationDto {
	@IsOptional()
	@IsEnum(EnumProductSort)
	sort?: EnumProductSort
	@IsOptional()
	@IsString()
	searchTerm?: string
}
