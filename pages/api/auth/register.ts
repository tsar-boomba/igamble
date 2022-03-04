import { signJwt } from '@/utils/api/signJwt';
import prisma from '@/utils/api/prisma';
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { RouteHandler } from 'next-route-handler';

export default new RouteHandler().post(async (req, res) => {
	const user: Prisma.UserCreateInput = JSON.parse(req.body);

	if (await prisma.user.findUnique({ where: { email: user.email } }))
		return res.status(400).json({ message: 'Email is already in use.' });

	const hashedPass = hashSync(user.password, 11);
	user.password = hashedPass;

	const savedUser = await prisma.user.create({ data: user });

	const token = signJwt(res, savedUser.id);
	if (typeof token !== 'string') {
		console.log('no JWT_SECRET in environment variables.');
		return;
	}

	return res
		.setHeader(
			'set-cookie',
			`access_token=${token}; HttpOnly; Secure; Path=/; Expires=${new Date(
				Date.now() + 43200000,
			).toUTCString()}`, // expires in 12 hours from browser
		)
		.status(200)
		.json({ message: 'Account created!' });
});
