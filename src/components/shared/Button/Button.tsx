import React, {
    ReactNode,
    CSSProperties,
    ButtonHTMLAttributes,
    useMemo,
    useRef,
} from "react";
import {SIZE_MAP, buttonBase, ButtonSize, ButtonVariant, flexCenter} from "./styles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
    size?: ButtonSize;
    color?: string;
    variant?: ButtonVariant;
    style?: CSSProperties;
    className?: string;
    disabled?: boolean;
}

function shadeColor(color: string, percent: number) {
    if (!/^#([\da-f]{3}){1,2}$/i.test(color)) return color;
    let hex = color.startsWith("#") ? color : `#${color}`;
    if (hex.length === 4) {
        hex = expandHex(hex);
    }
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);

    const luminance = (0.299 * R + 0.587 * G + 0.114 * B) / 255;

    if (luminance < 0.15 && percent < 0) {
        R = Math.min(255, R - (percent / 100) * 255);
        G = Math.min(255, G - (percent / 100) * 255);
        B = Math.min(255, B - (percent / 100) * 255);
    } else {
        R = Math.min(255, Math.max(0, R + (percent / 100) * 255));
        G = Math.min(255, Math.max(0, G + (percent / 100) * 255));
        B = Math.min(255, Math.max(0, B + (percent / 100) * 255));
    }
    return (
        "#" +
        ((1 << 24) + (Math.round(R) << 16) + (Math.round(G) << 8) + Math.round(B))
            .toString(16)
            .slice(1)
    );
}

function expandHex(hex: string): string {
    // #FFF → #FFFFFF
    if (hex.length === 4) {
        return (
            "#" +
            hex[1] + hex[1] +
            hex[2] + hex[2] +
            hex[3] + hex[3]
        );
    }
    return hex;
}

function getButtonStyle(
    size: ButtonSize,
    color: string,
    variant: ButtonVariant,
    userStyle?: CSSProperties,
    disabled?: boolean
) {
    const isContained = variant === "contained";
    const mainColor = color;
    const textColor = isContained ? "#fff" : mainColor;
    const bgColor = isContained ? mainColor : "transparent";
    return {
        ...buttonBase,
        ...SIZE_MAP[size],
        background: bgColor,
        color: textColor,
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
        cursor: disabled ? "not-allowed" : "pointer",
        ...userStyle,
    } as CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           startAdornment,
                                           endAdornment,
                                           size = "medium",
                                           color = "#007BFF",
                                           variant = "contained",
                                           style,
                                           className,
                                           disabled = false,
                                           ...rest
                                       }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const isContained = variant === "contained";
    const mainColor = color;
    const bgColor = isContained ? mainColor : "transparent";
    const hoverBg = isContained
        ? shadeColor(mainColor, -12)
        : "rgba(0,0,0,0.06)";
    const activeBg = isContained
        ? shadeColor(mainColor, -24)
        : "rgba(0,0,0,0.11)";

    const finalStyle = useMemo(
        () => getButtonStyle(size, color, variant, style, disabled),
        [size, color, variant, style, disabled]
    );

    const handleMouseEnter = () => {
        if (!disabled && buttonRef.current) buttonRef.current.style.background = hoverBg;
    };
    const handleMouseLeave = () => {
        if (!disabled && buttonRef.current) buttonRef.current.style.background = bgColor;
    };
    const handleMouseDown = () => {
        if (!disabled && buttonRef.current) buttonRef.current.style.background = activeBg;
    };
    const handleMouseUp = () => {
        if (!disabled && buttonRef.current) buttonRef.current.style.background = hoverBg;
    };

    return (
        <button
            ref={buttonRef}
            className={className}
            style={finalStyle}
            {...rest}
            disabled={disabled}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            {startAdornment && (
                <span style={flexCenter}>
                    {startAdornment}
                </span>
            )}
            {children}
            {endAdornment && (
                <span style={flexCenter}>
                    {endAdornment}
                </span>
            )}
        </button>
    );
};

export default Button;
