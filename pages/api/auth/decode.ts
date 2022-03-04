import { auth, WAuth } from '@/middleware/auth';
import { RouteHandler } from 'next-route-handler';

export default new RouteHandler<'api', WAuth>().use(auth).get(async (req, res) => {
	if (!req.user) return res.status(403).json({ message: 'You are unauthorized.' });
	return res.status(200).json(req.user);
});
