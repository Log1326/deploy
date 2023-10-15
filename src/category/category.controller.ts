import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CategoryDto } from './dto/category.dto'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}
	@Get()
	async getAll() {
		return this.categoryService.getAll()
	}
	@Get('by/:tag')
	async getByIdAndSlug(@Query() tag: string | number) {
		return this.categoryService.byIdAndSlug(tag)
	}
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: CategoryDto) {
		return this.categoryService.update(+id, dto)
	}
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async create() {
		return this.categoryService.create()
	}
	@HttpCode(200)
	@Auth()
	@Delete(':id')
	async delete(@Param('id') categoryId: string) {
		return this.categoryService.delete(+categoryId)
	}
}
