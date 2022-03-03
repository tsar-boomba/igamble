import { Box, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
	container: {
		padding: '0 1rem',
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
	},
}));

const Layout: React.FC = ({ children }) => {
	const { classes } = useStyles();

	return (
		<Box className={classes.container}>
			<main className={classes.main}>{children}</main>
		</Box>
	);
};

export default Layout;
