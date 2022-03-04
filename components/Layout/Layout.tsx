import { Box, createStyles } from '@mantine/core';
import Header from './Header';

const useStyles = createStyles((theme) => ({
	container: {
		padding: '0',
		margin: 0,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '100vh',
	},

	main: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: '0 1rem',
		flexGrow: 1,
	},
}));

const Layout: React.FC<{ blog?: boolean }> = ({ children, blog }) => {
	const { classes } = useStyles();

	return (
		<Box className={classes.container}>
			<Header blog={blog} />
			<main className={classes.main}>{children}</main>
		</Box>
	);
};

export default Layout;
