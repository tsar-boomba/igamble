import { Anchor, Button, createStyles, PasswordInput, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import Link from 'next/link';
import { useState } from 'react';

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

const Login: React.VFC<{ id?: () => string }> = ({ id }) => {
	const modals = useModals();
	const form = useForm({
		initialValues: {
			email: '',
			password: '',
		},
		validationRules: {
			email: (v) => v.length >= 1,
			password: (v) => v.length >= 1,
		},
	});
	const { classes } = useStyles();
	const [fetchMessage, setFetchMessage] = useState('');

	const onSubmit = async (data: typeof form['values']) => {
		console.log(data);

		const res = await fetch('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify(data),
		});

		if (res.ok) return id && modals.closeModal(id());
		setFetchMessage((await res.json()).message);
	};

	return (
		<form className={classes.form} onSubmit={form.onSubmit(onSubmit)}>
			<TextInput
				required
				label='Email'
				type='email'
				placeholder='youremail@email.com'
				{...form.getInputProps('email')}
			/>
			<PasswordInput
				required
				type='password'
				label='Password'
				placeholder='password'
				sx={{ width: 185, margin: '0.25rem' }}
				{...form.getInputProps('password')}
			/>

			<Text color='red' align='center'>
				{fetchMessage}
			</Text>
			<Button type='submit' sx={{ marginTop: '0.5rem' }}>
				Login
			</Button>
			<Link href='/blog/register' passHref>
				<Anchor onClick={() => id && modals.closeModal(id())}>
					Create an account here.
				</Anchor>
			</Link>
		</form>
	);
};

export default Login;