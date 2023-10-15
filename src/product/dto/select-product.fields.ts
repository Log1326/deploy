import { Prisma } from '@prisma/client'

const userField: Prisma.UserSelect = {
	id: true,
	email: true,
	name: true,
	avatarPath: true,
	phone: true,
	password: false
}
const reviewFields: Prisma.ReviewSelect = {
	id: true,
	rating: true,
	text: true,
	createdAt: true,
	user: {
		select: userField
	},
	productId: true
}
const categoryFields: Prisma.CategorySelect = {
	id: true,
	name: true,
	slug: true
}
export const productFields: Prisma.ProductSelect = {
	images: true,
	description: true,
	id: true,
	name: true,
	price: true,
	createdAt: true,
	slug: true,
	category: { select: categoryFields }
}
export const productsFieldsFullest: Prisma.ProductSelect = {
	...productFields,
	reviews: { select: reviewFields },
	category: { select: categoryFields }
}
