import { MantineTheme } from '@mantine/core';

export const withTheme = (theme: MantineTheme, dark: string, light: string) =>
	theme.colorScheme === 'dark' ? dark : light;
