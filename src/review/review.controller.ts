import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ReviewService } from './review.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { ReviewDto } from './dto/review.dto'

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}
	@UsePipes(new ValidationPipe())
	@Get()
	async getAll() {
		return this.reviewService.getAll()
	}
	@Get(':productId')
	async getAverageByProductId(@Param('productId') productId: string) {
		return this.reviewService.getAverageValueByProductId(+productId)
	}
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('leave/:productId')
	@Auth()
	async leaveReview(
		@CurrentUser('id') id: number,
		@Body() dto: ReviewDto,
		@Param('productId') productId: string
	) {
		return this.reviewService.create(id, dto, +productId)
	}
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('update/:productId')
	@Auth()
	async update(@Body() dto: ReviewDto, @Param('productId') productId: string) {
		return this.reviewService.update(+productId, dto)
	}
	@Delete(':id')
	@Auth()
	async remove(@Param('id') id: string) {
		return this.reviewService.delete(+id)
	}
}
