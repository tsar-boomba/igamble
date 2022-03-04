import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { useRouter } from 'next/router';

export default function App(props: AppProps) {
	const router = useRouter();
	const isBlog = router.pathname.match(/^\/blog/);
	const { Component, pageProps } = props;

	return (
		<>
			<Head>
				<title>{isBlog ? 'IBlog' : 'Isaiah Gamble'}</title>
				<meta
					name='viewport'
					content='minimum-scale=1, initial-scale=1, width=device-width'
				/>
			</Head>

			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					/** Put your mantine theme override here */
					colorScheme: 'dark',
				}}
			>
				<ModalsProvider>
					<Component {...pageProps} />
				</ModalsProvider>
			</MantineProvider>
		</>
	);
}
