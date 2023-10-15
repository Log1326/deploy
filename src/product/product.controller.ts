import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ProductService } from './product.service'
import { AllProductDto, ProductDto } from './dto/product.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}
	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: AllProductDto) {
		return this.productService.getAll(queryDto)
	}
	@Get('tag')
	async getProductId(@Query() tag: string | number) {
		return this.productService.getProductById(tag)
	}
	@Get('similar/:id')
	async getSimilar(@Param('id') id: string) {
		return this.productService.getSimilar(+id)
	}
	@Get('by-category/:category')
	async getBySlugCategory(@Param('category') category: string) {
		return this.productService.getBySlugCategory(category)
	}
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async createProduct() {
		return this.productService.create()
	}
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
		return this.productService.update(+id, dto)
	}
	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async deleteProduct(@Param('id') id: string) {
		return this.productService.delete(+id)
	}
	@HttpCode(200)
	@Patch('favorites/:productId')
	@Auth()
	async toggleFavorite(
		@CurrentUser('id') id: number,
		@Param('productId') productId: string
	) {
		return this.productService.toggleProductFavorite(id, +productId)
	}
}
