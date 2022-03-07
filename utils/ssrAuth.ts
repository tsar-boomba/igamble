import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import prisma from '@/utils/api/prisma';
import { verify } from 'jsonwebtoken';

export const ssrAuth = async (cookies: NextApiRequestCookies) => {
	const accessToken = cookies.at;
	if (!accessToken) return null;

	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) return null;

	let userToken;
	try {
		userToken = verify(accessToken, jwtSecret);
	} catch (err: unknown) {
		return null;
	}

	if (typeof userToken === 'string' || !userToken) return null;

	const user = await prisma.user.findUnique({
		where: { id: userToken.id },
		include: { permissions: true, profile: true, preferences: true },
	});
	if (!user) return null;

	return user;
};
