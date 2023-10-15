import { Module } from '@nestjs/common'
import { ReviewService } from './review.service'
import { ReviewController } from './review.controller'
import { PrismaService } from '../prisma/prisma.service'
import { ProductService } from '../product/product.service'
import { PaginationService } from '../pagination/pagination.service'

@Module({
	controllers: [ReviewController],
	providers: [ReviewService, ProductService, PaginationService, PrismaService]
})
export class ReviewModule {}
