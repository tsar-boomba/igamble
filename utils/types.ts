import { Prisma } from '@prisma/client';

export type UseUser = Prisma.UserGetPayload<{
	include: { permissions: true; profile: true; preferences: true };
}>;

export const enum Perms {
	POST = 'post',
	COMMENT = 'comment',
	MOD = 'moderator',
	ADMIN = 'administrator',
}

export type PermKeys = keyof Prisma.PermissionsGetPayload<null>;
