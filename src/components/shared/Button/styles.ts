import { CSSProperties } from 'react';

export type ButtonSize = 'small' | 'medium' | 'big';
export type ButtonVariant = 'contained' | 'text';

export const SIZE_MAP: Record<ButtonSize, CSSProperties> = {
	small: {
		height: 28,
		fontSize: 13,
		padding: '0 12px',
		borderRadius: 6,
	},
	medium: {
		height: 36,
		fontSize: 15,
		padding: '0 18px',
		borderRadius: 7,
	},
	big: {
		height: 44,
		fontSize: 17,
		padding: '0 26px',
		borderRadius: 8,
	},
};

export const buttonBase: CSSProperties = {
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: 1,
	fontWeight: 600,
	cursor: 'pointer',
	outline: 'none',
	border: 'none',
	transition: 'background 0.54s, color 0.24s, box-shadow 0.14s',
	boxSizing: 'border-box',
	position: 'relative',
	userSelect: 'none',
};

export const flexCenter: CSSProperties = { display: 'inline-flex', alignItems: 'center' }