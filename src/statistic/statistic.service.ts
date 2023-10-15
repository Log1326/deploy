import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UserService } from '../user/user.service'

@Injectable()
export class StatisticService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService
	) {}
	async getMain(id: number) {
		const user = await this.userService.byId(id, {
			orders: { select: { items: true } },
			reviews: true
		})
		return [
			{ name: 'Orders', value: user.orders.length },
			{ name: 'Reviews', value: user.reviews.length },
			{ name: 'Favorites', value: user.products.length },
			{ name: 'Total amount', value: user.orders }
		]
	}
}
