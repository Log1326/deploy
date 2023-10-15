import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UserDto } from './dto/user.dto'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}
	@HttpCode(200)
	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.byId(id)
	}
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('update')
	@Auth()
	async update(@CurrentUser('id') id: number, @Body() dto: UserDto) {
		return this.userService.updateProfile(id, dto)
	}
	@HttpCode(200)
	@Patch('favorites/:productId')
	@Auth()
	async toggleFavorite(
		@CurrentUser('id') id: number,
		@Param('productId') productId: string
	) {
		return this.userService.toggleUserFavorite(id, +productId)
	}
}
