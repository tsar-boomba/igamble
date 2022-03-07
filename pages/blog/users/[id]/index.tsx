import Layout from '@/components/Layout';
import prisma from '@/utils/api/prisma';
import { ssrAuth } from '@/utils/ssrAuth';
import { UseUser } from '@/utils/types';
import { GetServerSideProps, NextPage } from 'next';

const User: NextPage<{ user: UseUser }> = ({ user }) => {
	return <Layout blog>{user.firstName}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
	const reqUser = await ssrAuth(req.cookies);
	const user = await prisma.user.findUnique({
		where: { id: String(params?.id) },
		include: {
			posts: true,
			comments: true,
			permissions: true,
			preferences: true,
			profile: true,
		},
	});
	if (!user)
		return {
			notFound: true,
		};

	user.posts = user?.posts.filter((post) => post.published || post.authorId === reqUser?.id);

	return {
		props: { user },
	};
};

export default User;
