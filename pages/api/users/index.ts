import prisma from '@/utils/prisma';
import { RouteHandler } from 'next-route-handler';

export default new RouteHandler()
	.get(async (req, res) => res.status(200).json(await prisma.user.findMany()))
	.post(async (req, res) =>
		res.status(200).json(await prisma.user.create({ data: JSON.parse(req.body) })),
	);
