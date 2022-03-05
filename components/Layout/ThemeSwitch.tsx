import { UseUser } from '@/utils/types';
import { useFirstRender } from '@/utils/useFirstRender';
import { SegmentedControl, useMantineColorScheme } from '@mantine/core';
import { useEffect, useRef } from 'react';

const ThemeSwitch: React.VFC<{ user?: UseUser }> = ({ user }) => {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const isFirstRender = useFirstRender();
	const timeout = useRef<NodeJS.Timeout>();

	useEffect(() => {
		// when theme is switched, after 2 secs their theme will be saved in db
		if (timeout.current) clearTimeout(timeout.current);
		timeout.current = setTimeout(() => {
			if (user && !isFirstRender) {
				fetch(`/api/users/${user.id}/update-theme?theme=${colorScheme}`);
			}
		}, 2000);
	}, [colorScheme]);

	return (
		<SegmentedControl
			data={[
				{ label: 'Dark', value: 'dark' },
				{ label: 'Light', value: 'light' },
			]}
			size='xs'
			value={colorScheme}
			onChange={(v: 'dark' | 'light') => toggleColorScheme(v)}
		/>
	);
};

export default ThemeSwitch;
