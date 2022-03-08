import fetcher from '@/utils/fetch';
import {
	AutocompleteStylesNames,
	Box,
	CloseButton,
	DefaultProps,
	Group,
	MultiSelect,
	MultiSelectValueProps,
	SelectItem,
	Text,
} from '@mantine/core';
import { Prisma } from '@prisma/client';
import React, { forwardRef } from 'react';
import useSWR from 'swr';

interface Props {
	state: [string[], React.Dispatch<React.SetStateAction<string[]>>];
	label?: string;
	required?: boolean;
	className?: string;
	sx?: DefaultProps<AutocompleteStylesNames>['sx'];
}

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<
	HTMLDivElement,
	{ value: string; background: string; font: string; [key: string]: any }
>(({ value, font, background, ...props }, ref) => {
	return (
		<div ref={ref} style={{ color: font, background }} {...props}>
			<Group sx={{ color: font, background }} noWrap>
				<div>
					<Text>{value}</Text>
				</div>
			</Group>
		</div>
	);
});

const SelectValue = ({
	value,
	font,
	background,
	onRemove,
	classNames,
	...props
}: MultiSelectValueProps & { value: string; font: string; background: string }) => {
	return (
		<div {...props}>
			<Box
				sx={(theme) => ({
					display: 'flex',
					cursor: 'default',
					alignItems: 'center',
					color: font,
					background,
					border: `1px solid ${theme.colors.gray[4]}`,
					paddingLeft: 10,
					borderRadius: 16,
				})}
			>
				<div style={{ lineHeight: 1, fontSize: 12 }}>{value}</div>
				<CloseButton
					onMouseDown={onRemove}
					variant='transparent'
					size={22}
					iconSize={14}
					tabIndex={-1}
				/>
			</Box>
		</div>
	);
};

const TagSelector: React.VFC<Props> = ({ state, className, sx, label, required }) => {
	const { data, mutate } = useSWR<Prisma.TagGetPayload<null>[]>('/api/tags', fetcher);
	const [selection, setSelection] = state;

	if (!data)
		return (
			<MultiSelect
				label={label}
				required={required}
				data={['loading...']}
				placeholder='Loading...'
				disabled
				className={className}
				sx={sx}
				searchable
				clearable
			/>
		);

	const mappedTags = data.map<SelectItem>((tag) => ({
		value: tag.name,
		label: tag.name,
		background: tag.background,
		font: tag.font,
	}));

	return (
		<MultiSelect
			label={label}
			required={required}
			data={mappedTags}
			className={className}
			sx={sx}
			value={selection}
			onChange={setSelection}
			onFocus={() => mutate()}
			itemComponent={SelectItem}
			valueComponent={SelectValue}
			placeholder='Select Tags'
			nothingFound='Nothing found'
			searchable
			clearable
		/>
	);
};

export default TagSelector;
