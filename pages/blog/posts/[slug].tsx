import { postFilePaths, POSTS_PATH } from '@/utils/postUtils';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import Layout from '@/components/Layout';

interface Props {
	source?: MDXRemoteSerializeResult<Record<string, unknown>>;
	data?: Record<string, string>;
}

const Post: NextPage<Props> = ({ source, data }) => {
	if (!source)
		return (
			<Layout blog={true}>
				<h1>Blog Post not found</h1>
			</Layout>
		);

	return (
		<Layout blog={true}>
			<article>
				<MDXRemote {...source} />
			</article>
		</Layout>
	);
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	if (!params)
		return {
			props: {},
		};
	const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`);
	const source = fs.readFileSync(postFilePath);

	if (!source)
		return {
			props: {},
		};

	const { content, data } = matter(source);

	const mdxSource = await serialize(content, {
		mdxOptions: {
			remarkPlugins: [],
			rehypePlugins: [],
		},
		scope: data,
	});

	return {
		props: {
			source: mdxSource,
			frontMatter: data,
		},
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = postFilePaths
		.map((path) => path.replace(/\.mdx?$/, ''))
		.map((slug) => ({ params: { slug } }));

	return {
		paths,
		fallback: false,
	};
};

export default Post;
