import { Prisma } from '@prisma/client'

export const userField: Prisma.UserSelect = {
	id: true,
	email: true,
	name: true,
	avatarPath: true,
	phone: true,
	password: false
}

export const favoritesFields: Prisma.ProductSelect = {
	id: true,
	name: true,
	price: true,
	images: true,
	slug: true,
	users: true
}
