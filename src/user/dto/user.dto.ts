import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'
import { Prisma } from '@prisma/client'

export class UserDto implements Prisma.UserUpdateInput {
	@IsEmail()
	email: string
	@IsOptional()
	@MinLength(6, { message: 'password must be at least 6 characters long' })
	@IsString()
	password: string
	@IsOptional()
	@IsString()
	name?: string
	@IsOptional()
	@IsString()
	avatarPath?: string
	@IsOptional()
	@IsString()
	phone?: string
}
