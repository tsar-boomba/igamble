import { Button, createStyles, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useFirstRender } from '@/utils/useFirstRender';
import { useState, useEffect, useRef, KeyboardEventHandler } from 'react';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Prism } from '@mantine/prism';
import { withTheme } from '@/utils/withTheme';
import Link from 'next/link';

interface Props {
	create: boolean;
	defaultPost?: {
		title: string;
		description: string;
		content: string;
	};
}

const useStyles = createStyles((theme) => ({
	wrapper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		width: '100%',
	},
	contentWrapper: {
		width: 'clamp(300px, 1000px, 100%)',
		position: 'relative',
		margin: '1rem',
		tabSize: 4,
	},
	contentInput: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		color: 'transparent',
		top: 0,
		left: 0,
		margin: 0,
		lineHeight: '1.7',
		padding: '12px 16px',
		fontSize: 13,
		fontFamily:
			'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace',
		backgroundColor: 'transparent',
		resize: 'none',
		overflowY: 'auto',
		border: 0,
		caretColor: withTheme(theme, 'white', 'black'),
		whiteSpace: 'pre',
		overflowWrap: 'normal',
		overflowX: 'hidden',
	},
}));

const tabInTextArea: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
	const textArea = e.currentTarget;
	const begin = textArea.selectionStart;
	if (e.key == 'Tab') {
		e.preventDefault();
		textArea.setRangeText('\t', begin, begin, 'end');
	}
};

const PostForm: React.VFC<Props> = ({ create, defaultPost }) => {
	const { classes } = useStyles();
	const [contentValid, setContentValid] = useState({ value: true, message: '' || undefined });
	const [previewContent, setPreviewContent] =
		useState<MDXRemoteSerializeResult<Record<string, unknown>>>();
	const isFirstRender = useFirstRender();
	const timeout = useRef<NodeJS.Timeout>();

	const form = useForm({
		initialValues: {
			title: defaultPost?.title || '',
			description: defaultPost?.description || '',
			content: defaultPost?.content || '',
		},
		validationRules: {
			title: (v) => v.length >= 5 && v.length <= 255,
			description: (v) => v.length >= 10 && v.length <= 512,
			content: (v) => contentValid.value && v.length > 0,
		},
		errorMessages: {
			title: 'Title must be at least 5 characters and less than 50 characters.',
			description: 'Description must be at least 5 characters and less than 50 characters.',
			content: contentValid.message,
		},
	});

	useEffect(() => {
		if (timeout.current) clearTimeout(timeout.current);
		timeout.current = setTimeout(() => {
			try {
				serialize(form.values.content)
					.then((result) => {
						setContentValid({ value: true, message: undefined });
						setPreviewContent(result);
					})
					.catch((err) => setContentValid({ value: false, message: err.message }));
			} catch (err: any) {
				setContentValid({ value: false, message: err.message });
			}
		}, 500);
	}, [form.values.content]);

	const onSubmit = async (data: typeof form['values']) => {
		const res = await fetch('/api/posts/create', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	};

	return (
		<>
			<form className={classes.wrapper} onSubmit={form.onSubmit(onSubmit)}>
				<TextInput {...form.getInputProps('title')} label='Title' required />
				<Textarea {...form.getInputProps('description')} label='Description' required />
				<h4 style={{ marginBottom: 0 }}>
					Content<span style={{ color: 'red' }}>*</span>
				</h4>
				<div className={classes.contentWrapper}>
					<Prism noCopy language='jsx'>
						{form.values.content}
					</Prism>
					<textarea
						style={{ padding: form.values.content.length === 0 ? '0' : undefined }}
						spellCheck={false}
						className={classes.contentInput}
						{...form.getInputProps('content')}
						onKeyDown={tabInTextArea}
					/>
				</div>
				<Link href='/blog/preview' passHref>
					<Button
						component='a'
						target='_blank'
						rel='noreferrer noopener'
						onMouseDown={() => {
							localStorage.setItem(
								'previewPost',
								JSON.stringify({
									source: previewContent,
									title: form.values.title,
									description: form.values.description,
								}),
							);
						}}
					>
						Preview
					</Button>
				</Link>
				<p style={{ color: 'red' }}>{contentValid.message}</p>
				<Button type='submit' sx={{ marginTop: '1rem' }}>
					Create
				</Button>
			</form>
		</>
	);
};

export default PostForm;
