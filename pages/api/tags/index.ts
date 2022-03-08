import { auth, WAuth } from '@/middleware/auth';
import prisma from '@/utils/api/prisma';
import { requirePermissions } from '@/utils/requirePermissions';
import { Perms } from '@/utils/types';
import { RouteHandler } from 'next-route-handler';

export default new RouteHandler<'api', WAuth>()
	.use(auth)
	.get(async (req, res) => {
		if (!requirePermissions(req.user, Perms.POST))
			return res.status(403).json({ message: 'You are not authorized to get tags.' });
		const tags = await prisma.tag.findMany();
		return res.status(200).json(tags);
	})
	.post(async (req, res) => {
		if (!requirePermissions(req.user, Perms.MOD))
			return res.status(403).json({ message: 'You cannot create tags.' });
		const tag: { name: string; background: string; font: string } = await JSON.parse(req.body);
		if (await prisma.tag.findUnique({ where: { name: tag.name } }))
			return res.status(400).json({ message: 'A tag with this name already exists.' });
		await prisma.tag.create({ data: tag });
		return res.status(200).json({ message: 'Tag created.' });
	});
