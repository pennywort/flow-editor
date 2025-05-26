import React from 'react';

const CollapseIcon: React.FC<{
    expanded: boolean;
    onClick?: () => void;
    style?: React.CSSProperties;
}> = ({ expanded, onClick, style }) => (
	<svg
		width="28"
		height="28"
		viewBox="0 0 28 28"
		style={{
			transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
			transition: 'transform 0.2s',
			cursor: 'pointer',
			...style,
		}}
		onClick={onClick}
		xmlns="http://www.w3.org/2000/svg"
	>
		<polyline
			points="10,12 14,16 18,12"
			fill="none"
			stroke="#888"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default CollapseIcon;