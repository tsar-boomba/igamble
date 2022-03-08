import { auth, WAuth } from '@/middleware/auth';
import prisma from '@/utils/api/prisma';
import { RouteHandler } from 'next-route-handler';

export default new RouteHandler<'api', WAuth>().use(auth).post(async (req, res) => {
	if (!req.user || !req.user.permissions?.post)
		return res.status(403).json({ message: 'You are not authorized to post.' });
	const {
		tags,
		...post
	}: { title: string; content: string; description: string; tags: string[] } = JSON.parse(
		req.body,
	);

	const savedPost = await prisma.post.create({
		data: {
			...post,
			authorId: req.user.id,
			published: false,
			tags: {
				create: tags.map((tag) => ({ tagName: tag })),
			},
		},
	});

	return res.status(200).json(savedPost);
});
