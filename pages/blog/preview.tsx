import ErrorBoundary from '@/components/ErrorBoundary';
import Layout from '@/components/Layout';
import postComponents from '@/components/MDX/postComponents';
import { useLocalStorageValue } from '@mantine/hooks';
import { MDXRemote } from 'next-mdx-remote';

const Preview = () => {
	const [data] = useLocalStorageValue({ key: 'previewPost', defaultValue: '' });

	return (
		<Layout blog>
			{data && (
				<ErrorBoundary>
					<MDXRemote {...JSON.parse(data).source} components={postComponents} />
				</ErrorBoundary>
			)}
		</Layout>
	);
};

export default Preview;
