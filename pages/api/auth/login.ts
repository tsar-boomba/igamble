import { compareSync } from 'bcrypt';
import { RouteHandler } from 'next-route-handler';
import prisma from '@/utils/api/prisma';
import { signJwt } from '@/utils/api/signJwt';

// should receive username and password
export default new RouteHandler().post(async (req, res) => {
	const data: { email: string; password: string } = JSON.parse(req.body);
	const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

	if (existingUser && compareSync(data.password, existingUser.password)) {
		const token = signJwt(res, existingUser.id);

		res.setHeader(
			'set-cookie',
			`at=${token}; HttpOnly; Secure; Path=/; Expires=${new Date(
				Date.now() + 43200000 * 2,
			).toUTCString()}`, // expires in 12 hours from browser
		);

		return res.status(200).json({ message: 'Logged in!' });
	} else {
		return res.status(401).json({ message: 'Incorrect username or password.' });
	}
});
