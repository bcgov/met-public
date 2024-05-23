import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { globalFocusShadow, colors, elevations } from '../../common';
import { isDarkColor } from 'utils';

const buttonStyles = {
    borderRadius: '16px',
    padding: '0 1.5rem',
    marginBottom: '1.5rem',
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
    ...buttonProps
}) => {
    const height: string = sizeMap[size];
    const customColor = colors.button[color as keyof typeof colors.button]?.shade ?? color;
    const bgColor = customColor;
    const darkBgColor = `color-mix(in srgb, ${bgColor}, black 20%)`;
    // Use inverted text color for dark backgrounds
    const textColors = isDarkColor(bgColor, 0.4) ? colors.type.inverted : colors.type.regular;

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
                color: textColors.primary,
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
                border: `2px solid ${borderColor}`,
                height: height,
                background: 'white',
                color: textColor,
                boxShadow: elevations.default,
                '&:focus': {
                    backgroundColor: darkBackgroundColor,
                    boxShadow: elevations.hover,
                    color: darkTextColor,
                    border: `2px solid ${darkBorderColor}`,
                },
                '&:focus-visible': {
                    backgroundColor: darkBackgroundColor,
                    outline: `2px solid ${colors.focus.regular.outer}`,
                    boxShadow: [globalFocusShadow, elevations.hover].join(','),
                    color: darkTextColor,
                    border: `2px solid ${darkBorderColor}`,
                },
                '&:hover': {
                    backgroundColor: darkBackgroundColor,
                    boxShadow: elevations.hover,
                    color: darkTextColor,
                    border: `2px solid ${darkBorderColor}`,
                    '&:focus-visible': {
                        boxShadow: [globalFocusShadow, elevations.hover].join(','),
                    },
                },
                '&:active': {
                    backgroundColor: darkBackgroundColor,
                    boxShadow: elevations.pressed,
                    color: darkTextColor,
                    border: `2px solid ${darkBorderColor}`,
                    '&:focus-visible': {
                        boxShadow: [globalFocusShadow, elevations.pressed].join(','),
                    },
                },
                '&:disabled': {
                    backgroundColor: 'white',
                    boxShadow: 'none',
                    color: colors.type.regular.disabled,
                    border: `2px solid ${colors.type.regular.disabled}`,
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