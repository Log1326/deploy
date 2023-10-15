import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthDto } from './dto/auth.dto'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private userService: UserService
	) {}
	async register(dto: AuthDto) {
		await this.userService.checkUserByEmail(dto.email)
		const user = await this.userService.create(dto)
		const tokens = await this.issueTokens(user.id)
		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}
	async login(dto: AuthDto) {
		const user = await this.userService.validateUser(dto)
		const tokens = await this.issueTokens(user.id)
		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async getNewTokens(refreshToken: string) {
		try {
			const result = await this.jwt.verifyAsync(refreshToken)
			const user = await this.userService.byId(result.id)
			const tokens = await this.issueTokens(user.id)
			return {
				user: this.returnUserFields(user as User),
				...tokens
			}
		} catch (e) {
			throw new UnauthorizedException('invalid refresh token')
		}
	}
	private async issueTokens(userId: number) {
		const data = { id: userId }
		const accessToken = this.jwt.sign(data, { expiresIn: '1h' })
		const refreshToken = this.jwt.sign(data, { expiresIn: '3d' })
		return { accessToken, refreshToken }
	}
	private returnUserFields(user: User): Pick<User, 'id' | 'email'> {
		return {
			id: user.id,
			email: user.email
		}
	}
}
