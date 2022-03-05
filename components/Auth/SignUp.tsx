import {
	Anchor,
	Button,
	createStyles,
	PasswordInput,
	SegmentedControl,
	Text,
	TextInput,
	useMantineColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { mutate } from 'swr';

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

const SignUp: React.VFC<{ id?: () => string }> = ({ id }) => {
	const modals = useModals();
	const router = useRouter();
	const { toggleColorScheme } = useMantineColorScheme();
	const form = useForm({
		initialValues: {
			email: '',
			firstName: '',
			lastName: '',
			password: '',
			confirmPassword: '',
			theme: 'dark',
		},
		validationRules: {
			email: (v) => /^\S+@\S+\.\S+$/.test(v),
			firstName: (v) => v.length >= 2 && /^\w+$/.test(v),
			lastName: (v) => v.length >= 2 && /^\w+$/.test(v),
			password: (v) =>
				v.length >= 8 &&
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&-])[A-Za-z\d@$!%*#?&-]{8,}$/.test(v),
			confirmPassword: (v, values) => v === values?.password,
			theme: (v) => v === 'dark' || v === 'light',
		},
		errorMessages: {
			email: 'Must be a valid email address.',
			firstName: 'Must be longer than 1 letter and contain no spaces.',
			lastName: 'Must be longer than 1 letter and contain no spaces.',
			password:
				'Must be at least 8 characters long, have at least 1 letter, 1 number, and 1 special character (@$!%*#?&-)',
			confirmPassword: 'Must match password.',
			theme: 'How?!?!!?',
		},
	});
	const { classes } = useStyles();
	const [fetchMessage, setFetchMessage] = useState('');
	console.log(form.values);

	const onSubmit = async ({ confirmPassword, ...data }: typeof form['values']) => {
		const res = await fetch('/api/auth/register', {
			method: 'POST',
			body: JSON.stringify(data),
		});

		mutate('/api/auth/decode');
		if (res.ok) return id ? modals.closeModal(id()) : router.push('/blog');
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
			<Text align='center' size='sm'>
				Your email will not be public.
			</Text>
			<div className={classes.nameWrapper}>
				<TextInput
					required
					label='First Name'
					sx={{ margin: '0.25rem' }}
					{...form.getInputProps('firstName')}
				/>
				<TextInput
					required
					label='Last Name'
					sx={{ margin: '0.25rem' }}
					{...form.getInputProps('lastName')}
				/>
			</div>
			<div className={classes.nameWrapper}>
				<PasswordInput
					required
					type='password'
					label='Password'
					placeholder='password'
					sx={{ width: 185, margin: '0.25rem' }}
					{...form.getInputProps('password')}
				/>
				<TextInput
					required
					type='password'
					label='Confirm Password'
					sx={{ margin: '0.25rem' }}
					{...form.getInputProps('confirmPassword')}
				/>
			</div>
			<Text align='center'>Pick your preferred theme (This can be changed later).</Text>
			<SegmentedControl
				data={[
					{ label: 'Dark', value: 'dark' },
					{ label: 'Light', value: 'light' },
				]}
				onChange={(value: 'dark' | 'light') => {
					toggleColorScheme(value);
					form.setValues((prev) => ({ ...prev, theme: value }));
				}}
			/>

			<Text color='red' align='center'>
				{fetchMessage}
			</Text>
			<Button type='submit' sx={{ marginTop: '0.5rem' }}>
				Register
			</Button>
			<Link href='/blog/login' passHref>
				<Anchor onClick={() => id && modals.closeModal(id())}>
					Already have an account? Login.
				</Anchor>
			</Link>
		</form>
	);
};

export default SignUp;
