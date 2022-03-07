import { Prism } from '@mantine/prism';
import { MDXRemoteProps } from 'next-mdx-remote';

const postComponents: MDXRemoteProps['components'] = {
	h1: (props) => (
		<h1 {...props} style={{ margin: 0 }}>
			{props.children}
		</h1>
	),
	CodeBlock: (props) => (
		<Prism {...props} style={{ tabSize: 4 }}>
			{props.children}
		</Prism>
	),
};

export default postComponents;
