import { Prisma } from '@prisma/client'

export const categoryFields: Prisma.CategorySelect = {
	id: true,
	name: true,
	slug: true
}
