import { UseUser } from '@/utils/types';
import { withTheme } from '@/utils/withTheme';
import { Avatar, Container, createStyles } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useState } from 'react';
import ThemeSwitch from './ThemeSwitch';

const useStyles = createStyles((theme) => ({
	wrapper: {
		border: 0,
		padding: 0,
		borderRadius: '50%',
		cursor: 'pointer',
		position: 'relative',
		color: withTheme(theme, '', theme.colors.dark[9]),
		fontWeight: 500,
	},
	menu: {
		position: 'absolute',
		top: '100%',
		right: 0,
		padding: 0,
		display: 'flex',
		flexDirection: 'column',
	},
	menuButton: {
		width: '100%',
		padding: '0.25rem 1.25rem',
		backgroundColor: withTheme(theme, theme.colors.dark[6], theme.colors.light[2]),
		border: '1.75px solid',
		borderTop: 0,
		'&:first-child': {
			borderTopRightRadius: 4,
			borderTopLeftRadius: 4,
			borderTop: '1.75px solid',
		},
		'&:last-child': {
			borderBottomLeftRadius: 4,
			borderBottomRightRadius: 4,
		},
	},
}));

const UserMenu: React.VFC<{ user: UseUser }> = ({ user }) => {
	const { classes } = useStyles();
	const [menuOpen, setMenuOpen] = useState(false);
	const ref = useClickOutside(() => setMenuOpen(false));

	return (
		<div className={classes.wrapper} onClick={() => setMenuOpen((prev) => true)}>
			<Avatar radius='xl'>
				{!user.profile?.bio /* will be img in future */ &&
					user.firstName[0] + user.lastName[0]}
			</Avatar>
			{menuOpen && (
				<Container className={classes.menu} ref={ref}>
					<Container
						className={classes.menuButton}
						onClick={() => fetch('/api/auth/logout').then(() => location.reload())}
					>
						Logout
					</Container>
					<Container className={classes.menuButton}>
						Theme: <ThemeSwitch user={user} />
					</Container>
				</Container>
			)}
		</div>
	);
};

export default UserMenu;
