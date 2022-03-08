import { Box } from '@mantine/core';

interface Props {
	name: string;
	font: string;
	background: string;
}

const Tag: React.VFC<Props> = ({ name, font, background }) => {
	return (
		<Box
			sx={(theme) => ({
				display: 'flex',
				cursor: 'default',
				alignItems: 'center',
				color: font,
				background,
				border: `1px solid ${theme.colors.gray[4]}`,
				padding: '4px 10px',
				fontWeight: 500,
				borderRadius: 16,
			})}
		>
			<div style={{ lineHeight: 1, fontSize: 14 }}>{name}</div>
		</Box>
	);
};

export default Tag;
