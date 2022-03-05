import Login from '@/components/Auth/Login';
import SignUp from '@/components/Auth/SignUp';
import { useUser } from '@/utils/useUser';
import { withTheme } from '@/utils/withTheme';
import { Button, Container, createStyles } from '@mantine/core';
import { useModals } from '@mantine/modals';
import Link from 'next/link';
import UserMenu from '../UserMenu';

const useStyles = createStyles((theme) => ({
	header: {
		display: 'flex',
		alignItems: 'center',
		backgroundColor: theme.primaryColor,
		color: 'white',
		width: '100%',
		padding: '0 0.5rem',
	},
	logo: {
		color: withTheme(theme, 'black', 'white'),
		fontSize: '1.75rem',
		height: '100%',
		fontWeight: 'bold',
		textDecoration: 'none',
		marginRight: '0.5rem',
	},
	nav: {
		display: 'flex',
		height: '100%',
		flexGrow: 1,
	},
	navButton: {
		color: theme.white,
		textDecoration: 'none',
		height: '100%',
		padding: '0.7rem 1rem',
		'&:hover': {
			backgroundColor: theme.colors.orange[6],
		},
	},
}));

const NavButton: React.VFC<{ text: string; href: string }> = ({ text, href }) => {
	const { classes } = useStyles();

	return (
		<Link href={href} passHref>
			<a className={classes.navButton}>{text}</a>
		</Link>
	);
};

const Header: React.VFC<{ blog?: boolean }> = ({ blog }) => {
	const { user } = useUser({ canRedirect: false });
	const modals = useModals();
	const { classes } = useStyles();

	const openSignUpModal = () => {
		const id = modals.openModal({
			title: 'Create your account.',
			children: <SignUp id={() => id} />,
		});
	};

	const openLoginModal = () => {
		const id = modals.openModal({
			title: 'Login to your account.',
			children: <Login id={() => id} />,
		});
	};

	return (
		<header className={classes.header}>
			<Link href={blog ? '/blog' : '/'} passHref>
				<a className={classes.logo}>{blog ? 'IBlog' : 'IGamble'}</a>
			</Link>
			<nav className={classes.nav}>{!blog && <NavButton text='Blog' href='/blog' />}</nav>
			{blog && (
				<Container sx={{ display: 'flex', alignItems: 'center' }}>
					{!user && (
						<Button sx={{ margin: '0 0.25rem' }} onClick={openSignUpModal}>
							Sign Up
						</Button>
					)}
					{!user ? (
						<Button sx={{ margin: '0 0 0 0.25rem' }} onClick={openLoginModal}>
							Login
						</Button>
					) : (
						<UserMenu user={user} />
					)}
				</Container>
			)}
		</header>
	);
};

export default Header;
