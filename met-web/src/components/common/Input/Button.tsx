import React, { useState } from 'react';
import {
    Button as MuiButton,
    ButtonProps as MuiButtonProps,
    Stack,
    IconButton as MuiIconButton,
    useTheme,
} from '@mui/material';
import { globalFocusShadow, colors, elevations } from '../../common';
import { isDarkColor } from 'utils';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@mui/system';
import { RouterLinkRenderer } from '../Navigation/Link';

const buttonStyles = {
    borderRadius: '16px',
    padding: '0 1.5rem',
    fontWeight: 500,
    fontSize: '16px',
};

type ButtonProps = {
    children: React.ReactNode;
    color?: 'default' | 'danger' | 'warning' | 'success' | string;
    onClick?: () => void;
    size?: 'small' | 'medium' | 'large';
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    disabled?: boolean;
    loading?: boolean;
    target?: React.HTMLAttributeAnchorTarget;
} & Omit<MuiButtonProps, 'size' | 'color' | 'variant'>; // Exclude conflicting props

const sizeMap = {
    small: '40px',
    medium: '48px',
    large: '56px',
};

export const PrimaryButton: React.FC<ButtonProps> = ({
    children,
    color = 'default',
    onClick,
    size = 'medium',
    icon,
    iconPosition = 'left',
    disabled,
    loading,
    ...buttonProps
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const height: string = sizeMap[size];
    if (color === 'default' && isDarkMode) {
        color = '#ffffff';
    }
    const customColor = colors.button[color as keyof typeof colors.button]?.shade ?? color;
    const bgColor = customColor;
    const darkBgColor = `color-mix(in srgb, ${bgColor}, black 20%)`;
    // Use inverted text color for dark backgrounds
    const textColor = () => {
        if (isDarkMode && color === '#ffffff') {
            return colors.surface.blue[90];
        }
        if (isDarkColor(bgColor, 0.4)) {
            return colors.type.inverted.primary;
        }
        return colors.type.regular.primary;
    };

    return (
        <MuiButton
            variant="contained"
            onClick={onClick}
            {...buttonProps}
            disabled={disabled}
            startIcon={icon && iconPosition === 'left' ? icon : undefined}
            endIcon={icon && iconPosition === 'right' ? icon : undefined}
            sx={{
                ...buttonStyles,
                boxShadow: elevations.default,
                height: height,
                background: bgColor,
                color: textColor(),
                '&:focus': {
                    backgroundColor: darkBgColor,
                    boxShadow: elevations.hover,
                },
                '&:focus-visible': {
                    backgroundColor: darkBgColor,
                    outline: `2px solid ${colors.focus.regular.outer}`,
                    boxShadow: [globalFocusShadow, elevations.hover].join(','),
                },
                '&:hover': {
                    backgroundColor: darkBgColor,
                    boxShadow: elevations.hover,
                    '&:focus-visible': {
                        boxShadow: [globalFocusShadow, elevations.hover].join(','),
                    },
                },
                '&:active': {
                    backgroundColor: darkBgColor,
                    boxShadow: elevations.pressed,
                    '&:focus-visible': {
                        boxShadow: [globalFocusShadow, elevations.pressed].join(','),
                    },
                },
                '&:disabled': {
                    backgroundColor: '#EDEBE9',
                    boxShadow: 'none',
                    color: colors.type.regular.disabled,
                },
                ...buttonProps.sx,
            }}
        >
            {children}
        </MuiButton>
    );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
    children,
    color = 'default',
    onClick,
    size = 'medium',
    icon,
    iconPosition = 'left',
    disabled,
    loading,
    ...buttonProps
}) => {
    const height: string = sizeMap[size];
    const customColor = colors.notification[color as keyof typeof colors.notification]?.shade ?? color;
    const isCustom = color !== 'default';
    const textColor = isCustom ? customColor : colors.type.regular.primary;
    const darkTextColor = isCustom ? `color-mix(in srgb, ${textColor}, black 5%)` : textColor;
    const borderColor = isCustom ? customColor : colors.surface.gray[80];
    const darkBorderColor = isCustom ? `color-mix(in srgb, ${borderColor}, black 5%)` : colors.surface.gray[110];
    const darkBackgroundColor = isCustom ? '#F8F8F8' : `color-mix(in srgb, white, black 5%)`;

    return (
        <MuiButton
            variant="outlined"
            onClick={onClick}
            {...buttonProps}
            disabled={disabled}
            startIcon={icon && iconPosition === 'left' ? icon : undefined}
            endIcon={icon && iconPosition === 'right' ? icon : undefined}
            sx={{
                ...buttonStyles,
                height: height,
                background: 'white',
                color: textColor,
                boxShadow: elevations.default,
                border: `1px solid ${borderColor}`,
                '&:focus': {
                    backgroundColor: darkBackgroundColor,
                    boxShadow: elevations.hover,
                    color: darkTextColor,
                    border: `1px solid ${darkBorderColor}`,
                },
                '&:hover': {
                    backgroundColor: darkBackgroundColor,
                    boxShadow: elevations.hover,
                    color: darkTextColor,
                    border: `1px solid ${darkBorderColor}`,
                    '&:focus-visible': {
                        boxShadow: elevations.hover,
                    },
                },
                '&:active': {
                    backgroundColor: darkBackgroundColor,
                    boxShadow: elevations.pressed,
                    color: darkTextColor,
                    border: isCustom ? `1px solid ${customColor}` : `1px solid transparent`,
                    '&:focus-visible': {
                        boxShadow: elevations.pressed,
                    },
                },
                '&:focus-visible': {
                    backgroundColor: darkBackgroundColor,
                    outline: `2px solid ${colors.focus.regular.outer}`,
                    outlineOffset: '0px',
                    boxShadow: elevations.hover,
                    color: darkTextColor,
                    border: `1px solid transparent`,
                },
                '&:disabled': {
                    backgroundColor: 'white',
                    boxShadow: 'none',
                    color: colors.type.regular.disabled,
                    border: `1px solid ${colors.type.regular.disabled}`,
                },
                ...buttonProps.sx,
            }}
        >
            {children}
        </MuiButton>
    );
};

const TertiaryButton = ({
    children,
    color = 'default',
    onClick,
    size = 'medium',
    icon,
    iconPosition = 'left',
    disabled,
    loading,
    ...buttonProps
}: ButtonProps) => {
    const height: string = sizeMap[size];
    const customColor = colors.notification[color as keyof typeof colors.notification]?.shade ?? color;
    const activeColor = color !== 'default' ? `color-mix(in srgb, ${customColor}, white 90%)` : colors.surface.blue[10];

    return (
        <MuiButton
            variant="text"
            onClick={onClick}
            {...buttonProps}
            disabled={disabled}
            startIcon={icon && iconPosition === 'left' ? icon : undefined}
            endIcon={icon && iconPosition === 'right' ? icon : undefined}
            sx={{
                ...buttonStyles,
                height: height,
                background: 'transparent',
                color: colors.type.regular.primary,
                boxShadow: elevations.none,
                '&:focus, &:focus-visible, &:hover, &:active': {
                    backgroundColor: activeColor,
                },
                '&:focus-visible': {
                    outline: `2px solid ${colors.focus.regular.outer}`,
                    boxShadow: globalFocusShadow,
                },
                '&:disabled': {
                    color: colors.type.regular.disabled,
                },
                ...buttonProps.sx,
            }}
        >
            {children}
        </MuiButton>
    );
};

export const Button = ({
    variant = 'secondary',
    ...props
}: ButtonProps & {
    variant?: 'primary' | 'secondary' | 'tertiary';
}) => {
    props.LinkComponent = props.LinkComponent || RouterLinkRenderer;
    switch (variant) {
        case 'primary':
            return <PrimaryButton {...props} />;
        case 'secondary':
            return <SecondaryButton {...props} />;
        case 'tertiary':
            return <TertiaryButton {...props} />;
        default:
            return <PrimaryButton {...props} />;
    }
};

type IconButtonProps = {
    icon: IconProp;
    onClick?: () => void;
    title?: string;
    sx?: React.CSSProperties; // Add sx prop
    backgroundColor?: string;
};

const StyledIconButton = styled(MuiIconButton)(() => ({
    color: '#494949',
    borderRadius: '50%', // Make it round
    width: '40px', // Set width to maintain circle shape
    height: '40px', // Set height to maintain circle shape
}));

export const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, title, sx, backgroundColor }) => {
    const [focused, setFocused] = useState(false);

    return (
        <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{
                backgroundColor: backgroundColor ? backgroundColor : `${colors.focus.regular.inner}`,
                cursor: 'pointer',
                borderRadius: '50%',
                boxShadow: focused ? `0 0 0 2px white, 0 0 0 4px ${colors.focus.regular.outer}` : 'none',
                '&:hover': {
                    backgroundColor: '#F2F2F2',
                },
                '&:focus-visible': {
                    backgroundColor: '#F2F2F2',
                    outline: 'white 2px dashed', // Remove default outline
                    outlineOffset: '2px',
                },
                ...sx,
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            tabIndex={focused ? 0 : -1} // Set tabIndex to -1 when not focused
        >
            <StyledIconButton onClick={onClick} title={title} aria-label={title}>
                <FontAwesomeIcon icon={icon} style={{ fontSize: '20px', color: '#494949' }} />
            </StyledIconButton>
        </Stack>
    );
};
