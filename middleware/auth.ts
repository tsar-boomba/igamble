import { cookieParser } from '@/utils/api/cookieParser';
import prisma from '@/utils/api/prisma';
import { Prisma } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { RouteHandlerMiddleware } from 'next-route-handler';

export type WAuth = {
	user: Prisma.UserGetPayload<{
		include: { permissions: true; profile: true; preferences: true };
	}>;
};

export const AUTH_MIDDLEWARE_KEY = 'auth';

export const auth: RouteHandlerMiddleware<'both', WAuth> = {
	key: AUTH_MIDDLEWARE_KEY,
	ssr: true,
	middleware: async (req, res, end) => {
		const cookies = cookieParser(req.headers.cookie);
		const accessToken = cookies['at'];
		if (!accessToken) return;

		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) return;

		let userToken;
		try {
			userToken = verify(accessToken, jwtSecret);
		} catch (err: unknown) {
			return;
		}

		if (typeof userToken === 'string' || !userToken) return;

		const user = await prisma.user.findUnique({
			where: { id: userToken.id },
			include: { permissions: true, profile: true, preferences: true },
		});
		if (!user) return;

		req.user = user;
		return;
	},
};
