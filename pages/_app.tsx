import { AppProps } from 'next/app';
import Head from 'next/head';
import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { useRouter } from 'next/router';
import { useColorScheme } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useUser } from '@/utils/useUser';

export default function App(props: AppProps) {
	const router = useRouter();
	const isBlog = router.pathname.match(/^\/blog/);
	const { user } = useUser({ canRedirect: false });

	const preferredColorScheme = useColorScheme();
	const [colorScheme, setColorScheme] = useState(preferredColorScheme);
	/**
	 * Omit value param to use system preference.
	 */
	const toggleColorScheme = (value?: 'dark' | 'light') =>
		setColorScheme(value || preferredColorScheme);

	const { Component, pageProps } = props;

	useEffect(() => {
		user &&
			setColorScheme((user.preferences?.theme as 'light' | 'dark') || preferredColorScheme);
	}, [user]);

	return (
		<>
			<Head>
				<title>{isBlog ? 'IBlog' : 'Isaiah Gamble'}</title>
				<meta
					name='viewport'
					content='minimum-scale=1, initial-scale=1, width=device-width'
				/>
			</Head>

			<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
				<MantineProvider
					withGlobalStyles
					withNormalizeCSS
					theme={{
						/** Put your mantine theme override here */
						colorScheme,
						primaryColor: 'orange',
						colors: {
							light: [
								'#ffffff',
								'#f2f2f2',
								'#ededed',
								'#e8e8e8',
								'#e3e3e3',
								'#dedede',
								'#d9d9d9',
								'#d4d4d4',
								'#cfcfcf',
								'#c4c4c4',
							],
						},
					}}
				>
					<ModalsProvider>
						<Component {...pageProps} />
					</ModalsProvider>
				</MantineProvider>
			</ColorSchemeProvider>
		</>
	);
}
