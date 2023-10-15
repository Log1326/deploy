import { AllProductDto, EnumProductSort } from '../product/dto/product.dto'
import { Prisma } from '@prisma/client'

export const checkSortParam = memoize((sort: AllProductDto) => {
	const prismaSort: Prisma.ProductOrderByWithRelationInput[] = []
	if (sort.sort === EnumProductSort.LOW_PRICE) {
		prismaSort.push({ price: 'asc' })
	} else if (sort.sort === EnumProductSort.HIGH_PRICE) {
		prismaSort.push({ price: 'desc' })
	} else if (sort.sort === EnumProductSort.OLDEST) {
		prismaSort.push({ createdAt: 'asc' })
	} else {
		prismaSort.push({ createdAt: 'desc' })
	}
	return prismaSort
})
function memoize(func) {
	let cache = {}
	return (...args) => {
		const key = JSON.stringify(args)
		return cache[key] || (cache[key] = func(...args))
	}
}
