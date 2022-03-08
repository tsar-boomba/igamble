import { Button, Center, createStyles, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useFirstRender } from '@/utils/useFirstRender';
import { useState, useEffect, useRef, KeyboardEventHandler } from 'react';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Prism } from '@mantine/prism';
import { withTheme } from '@/utils/withTheme';
import Link from 'next/link';
import TagSelector from './TagSelector';
import { useModals } from '@mantine/modals';
import TagForm from '../Tag/TagForm';

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
	const modals = useModals();
	const [contentValid, setContentValid] = useState({ value: true, message: '' || undefined });
	const [previewContent, setPreviewContent] =
		useState<MDXRemoteSerializeResult<Record<string, unknown>>>();
	const [tags, setTags] = useState<string[]>([]);
	const timeout = useRef<NodeJS.Timeout>();

	const openTagCreateModal = () => {
		const id = modals.openModal({
			title: 'Create a tag.',
			children: <TagForm id={() => id} />,
		});
	};

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
				<Textarea
					{...form.getInputProps('title')}
					sx={{ width: 'clamp(300px, 500px, 100%)' }}
					label='Title'
					minRows={1}
					maxLength={255}
					maxRows={10}
					autosize
					required
				/>
				<Textarea
					{...form.getInputProps('description')}
					sx={{ width: 'clamp(300px, 800px, 100%)' }}
					label='Description'
					minRows={3}
					maxLength={512}
					maxRows={30}
					autosize
					required
				/>
				<TagSelector
					state={[tags, setTags]}
					label='Select Tags'
					sx={{ width: 'clamp(300px, 500px, 100%)' }}
					required
				/>
				<Button type='button' onClick={openTagCreateModal} mt='1rem'>
					Create Tag
				</Button>
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

				<Button
					type='button'
					sx={{ margin: '0.25rem', marginTop: '1rem' }}
					onClick={() =>
						localStorage.setItem('savedPost', JSON.stringify({ ...form.values, tags }))
					}
				>
					Save For Later
				</Button>
				<Button
					type='button'
					sx={{ margin: '0.25rem' }}
					onClick={() => {
						const stringPost = localStorage.getItem('savedPost');
						if (!stringPost) return;
						const post = JSON.parse(stringPost);
						form.setValues(() => post);
						setTags(post.tags);
					}}
				>
					Load Saved Post
				</Button>
			</form>
		</>
	);
};

export default PostForm;
