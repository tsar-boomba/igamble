import { Button, ColorInput, createStyles, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { useState } from 'react';
import Tag from './Tag';

const useStyles = createStyles(() => ({
	form: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	nameWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexWrap: 'wrap',
	},
}));

interface Props {
	id?: () => string;
}

const TagForm: React.VFC<Props> = ({ id }) => {
	const { classes } = useStyles();
	const modals = useModals();
	const [res, setRes] = useState('');
	const form = useForm({
		initialValues: {
			name: '',
			background: '',
			font: '',
		},
		validationRules: {
			name: (v) => v.length > 0,
			background: (v) => v.length >= 7,
			font: (v) => v.length >= 7,
		},
		errorMessages: {
			name: 'Name must be at least 1 character',
			background: 'Must ba a hexidecimal color (#xxxxxx)',
			font: 'Must ba a hexidecimal color (#xxxxxx)',
		},
	});

	const onSubmit = async (data: typeof form['values']) => {
		const res = await fetch('/api/tags', { method: 'POST', body: JSON.stringify(data) });
		if (res.ok) id ? modals.closeModal(id()) : null;
		setRes((await res.json()).message);
	};

	return (
		<form className={classes.form} onSubmit={form.onSubmit(onSubmit)}>
			<TextInput {...form.getInputProps('name')} label='Tag Name' required />
			<ColorInput {...form.getInputProps('background')} label='Background Color' required />
			<ColorInput {...form.getInputProps('font')} label='Font Color' required />
			<h2 style={{ marginBottom: 0 }}>Preview</h2>
			{form.values.background && form.values.font && form.values.name && (
				<Tag
					name={form.values.name}
					font={form.values.font}
					background={form.values.background}
				/>
			)}
			<Text align='center' color='red'>
				{res}
			</Text>
			<Button type='submit' mt='1rem'>
				Create
			</Button>
		</form>
	);
};

export default TagForm;
