import { Prisma } from '@prisma/client';

export type UseUser = Prisma.UserGetPayload<{
	include: { permissions: true; profile: true; preferences: true };
}>;
