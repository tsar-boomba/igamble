import Layout from '@/components/Layout';
import prisma from '@/utils/api/prisma';
import { ssrAuth } from '@/utils/ssrAuth';
import { UseUser } from '@/utils/types';
import { GetServerSideProps, NextPage } from 'next';

const Users: NextPage<{ users: UseUser[] }> = ({ users }) => {
	return (
		<Layout blog>
			{users.map((user) => (
				<p key={user.id}>{user.firstName}</p>
			))}
		</Layout>
	);
};

export const getServerSideProps: GetServerSideProps<{ users: UseUser[] }> = async ({ req }) => {
	const reqUser = await ssrAuth(req.cookies);
	if (!reqUser)
		return {
			redirect: {
				destination: '/blog',
				statusCode: 302,
			},
		};

	if (!reqUser.permissions?.admin || !reqUser.permissions?.moderator)
		return {
			redirect: {
				destination: `/blog/users/${reqUser.id}`,
				statusCode: 302,
			},
		};

	const users = await prisma.user.findMany({
		include: { permissions: true, preferences: true, profile: true },
	});
	return {
		props: { users },
	};
};

export default Users;
