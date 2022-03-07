import { signJwt } from '@/utils/api/signJwt';
import prisma from '@/utils/api/prisma';
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { RouteHandler } from 'next-route-handler';

export default new RouteHandler().post(async (req, res) => {
	const { theme, ...user }: Prisma.UserCreateInput & { theme: 'dark' | 'light' } = JSON.parse(
		req.body,
	);

	if (!/^\S+@\S+\.\S+$/.test(user.email)) {
		return res.status(400).json({ message: 'Email must be a valid email address.' });
	}
	if (
		!(user.firstName.length >= 2 && user.firstName.length <= 50 && /^\w+$/.test(user.firstName))
	) {
		return res
			.status(400)
			.json({ message: 'First name must be longer than 1 letter and contain no spaces.' });
	}
	if (!(user.lastName.length >= 2 && user.lastName.length <= 50 && /^\w+$/.test(user.lastName))) {
		return res
			.status(400)
			.json({ message: 'Last name must be longer than 1 letter and contain no spaces.' });
	}
	if (
		!(
			user.password.length >= 8 &&
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&-])[A-Za-z\d@$!%*#?&-]{8,}$/.test(user.password)
		)
	) {
		return res.status(400).json({
			message:
				'Password must be at least 8 characters long, have at least 1 letter, 1 number, and 1 special character (@$!%*#?&-)',
		});
	}
	if (theme !== 'dark' && theme !== 'light') {
		return res.status(400).json({
			message: 'Theme must be either light or dark.',
		});
	}

	if (await prisma.user.findUnique({ where: { email: user.email } }))
		return res.status(400).json({ message: 'Email is already in use.' });

	const hashedPass = hashSync(user.password, 11);
	user.password = hashedPass;

	const savedUser = await prisma.user.create({
		data: {
			...user,
			preferences: { create: { theme } },
			permissions: { create: { admin: false, comment: true, moderator: false, post: false } },
			profile: {
				create: {
					bio: `Hi, my name is ${user.firstName} ${user.lastName} and I'm new here.`,
				},
			},
		},
	});

	const token = signJwt(res, savedUser.id);
	if (typeof token !== 'string') {
		console.log('no JWT_SECRET in environment variables.');
		return res.status(500).json({ message: 'Internal server error.' });
	}

	return res
		.setHeader(
			'set-cookie',
			`at=${token}; HttpOnly; Secure; Path=/; Expires=${new Date(
				Date.now() + 43200000,
			).toUTCString()}`, // expires in 12 hours from browser
		)
		.status(200)
		.json({ message: 'Account created!' });
});
