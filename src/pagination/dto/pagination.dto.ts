import { IsOptional, IsString } from 'class-validator'

export class PaginationDto {
	@IsString()
	@IsOptional()
	page?: string
	@IsOptional()
	@IsString()
	perPage?: string
}
