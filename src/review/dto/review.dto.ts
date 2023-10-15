import { IsNumber, IsString, Max, Min } from 'class-validator'
import { Prisma } from '@prisma/client'

export class ReviewDto implements Prisma.ReviewUpdateInput {
	@IsNumber()
	@Min(1)
	@Max(5)
	rating: number
	@IsString()
	text: string
}
