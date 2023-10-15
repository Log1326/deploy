import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { hash, verify } from 'argon2'
import { faker } from '@faker-js/faker'
import { favoritesFields, userField } from './dto/select-user.fields'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}
	async byId(id: number, selectObject: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				...userField,
				products: { select: { ...favoritesFields } },
				...selectObject
			}
		})
		if (!user) throw new NotFoundException('User not found')
		return user
	}
	async updateProfile(id: number, dto: UserDto) {
		const isSameEmail = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})
		if (isSameEmail && id !== isSameEmail.id)
			throw new BadRequestException('Email already in use')
		const user = await this.byId(id)
		const { password, ...othersData } = dto
		const data = await this.prisma.user.update({
			where: { id },
			data: {
				...othersData,
				password: password ? await hash(password) : user.password
			}
		})
		const { password: passwordHash, ...result } = data
		return result
	}
	async toggleUserFavorite(userId: number, productId: number) {
		const user = await this.byId(userId)
		const isExists = user.products.some(product => product.id === productId)
		await this.prisma.user.update({
			where: { id: user.id },
			data: {
				products: {
					[isExists ? 'disconnect' : 'connect']: { id: productId }
				}
			}
		})
		return { message: !isExists ? 'add product' : 'remove product' }
	}
	async checkUserByEmail(email: string) {
		const oldUser = await this.prisma.user.findUnique({
			where: { email }
		})
		if (oldUser) throw new BadRequestException('User already exists')
		return !!oldUser
	}
	async validateUser(dto: UserDto) {
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})
		if (!user) throw new NotFoundException('User not found')
		const isValid = await verify(user.password, dto.password)
		if (!isValid) throw new UnauthorizedException('Invalid credentials')
		return user
	}
	async create(dto: UserDto) {
		return this.prisma.user.create({
			data: {
				email: dto.email,
				name: faker.name.firstName(),
				avatarPath: faker.image.avatar(),
				phone: faker.phone.number('+7 (###) ###-##-##'),
				password: await hash(dto.password)
			}
		})
	}
}
