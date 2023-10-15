import { Prisma } from '@prisma/client'

const userField: Prisma.UserSelect = {
	id: true,
	email: true,
	name: true,
	avatarPath: true,
	phone: true,
	password: false
}
export const reviewFields: Prisma.ReviewSelect = {
	id: true,
	rating: true,
	text: true,
	createdAt: true,
	user: {
		select: userField
	},
	productId: true
}
