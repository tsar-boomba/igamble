import { Prisma } from '@prisma/client';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import fetcher from './fetch';
import { UseUser } from './types';

type UseUserParams = Partial<{
	redirectIfNotFound: boolean;
	redirectIfFound: boolean;
	redirectIfNotAdmin: boolean;
	redirectOnError: boolean;
	redirectTo: string;
	canRedirect: boolean; // this instance can redirect
}>;

export const useUser = ({
	redirectIfNotFound = true,
	redirectIfFound = false,
	redirectIfNotAdmin = false,
	redirectOnError = true,
	redirectTo = '/blog/login',
	canRedirect = true,
}: UseUserParams = {}) => {
	const router = useRouter();
	const {
		data: user,
		error,
		isValidating,
		mutate,
	} = useSWR<UseUser>('/api/auth/decode', fetcher);
	const redirectUrl = `${redirectTo}?from=${router.pathname || '/'}`;

	if (!user && isValidating) {
		return { user, error, loading: true, mutate };
	}

	if (!user) {
		if (canRedirect && redirectIfNotFound && router.pathname !== redirectTo)
			router.push(redirectUrl);
		return { user, error, loading: false, mutate };
	}

	if (error) {
		if (canRedirect && redirectOnError && router.pathname !== redirectTo)
			router.push(redirectUrl);
		return { user: undefined, error, loading: false, mutate };
	}

	if (
		canRedirect &&
		!user.permissions?.admin &&
		redirectIfNotAdmin &&
		router.pathname !== redirectTo
	)
		router.push(redirectUrl);
	if (canRedirect && redirectIfFound && router.pathname !== redirectTo) router.push(redirectUrl);

	return { user, error, loading: false, mutate };
};
