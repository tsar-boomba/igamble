import { auth, WAuth } from '@/middleware/auth';
import prisma from '@/utils/api/prisma';
import { RouteHandler } from 'next-route-handler';

export default new RouteHandler<'api', WAuth>().use(auth).get(async (req, res) => {
	if (!req.user) return res.status(403).json({ message: 'You are not authorized.' });
	const theme = String(req.query.theme) as 'light' | 'dark';
	await prisma.preferences.update({ data: { theme }, where: { userId: req.user.id } });
	return res.status(200).json({ message: 'Theme successfully updated.' });
});
