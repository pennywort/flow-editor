import React, { CSSProperties, DOMAttributes, memo } from 'react';

type SvgIconProps = {
    size?: number | string;
    cursor?: string,
    color?: string;
    style?: CSSProperties;
    className?: string;
} & DOMAttributes<HTMLOrSVGElement>;

const SvgIcon: React.FC<SvgIconProps> = ({ children, size = 'unset', color, style, className, cursor, ...rest }) => (
	<span
		{...rest}
		className={className}
		style={{
			display: 'inline-flex',
			verticalAlign: 'middle',
			color,
			width: size,
			height: size,
			cursor,
			...style,
		}}
	>
		{children}
	</span>
)

export default memo(SvgIcon);
