import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { globalFocusShadow, colors, elevations } from '..';

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    variant: 'primary' | 'secondary' | 'tertiary';
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

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'secondary',
    size = 'medium',
    icon,
    iconPosition = 'left',
    disabled,
    ...buttonProps
}) => {
    const colorMap = colors.button[variant];
    const height: string = sizeMap[size];
    const typeColors = variant == 'primary' ? colors.type.inverted : colors.type.regular;
    // Don't display elevation changes for tertiary buttons
    const elevation =
        variant == 'tertiary' ? { z1: elevations.none, z4: elevations.none, z9: elevations.none } : elevations;

    return (
        <MuiButton
            onClick={onClick}
            disabled={disabled}
            startIcon={icon && iconPosition === 'left' ? icon : undefined}
            endIcon={icon && iconPosition === 'right' ? icon : undefined}
            sx={{
                borderRadius: '8px',
                // If the colormap has the "stroke" property, use it as the border
                border: 'stroke' in colorMap && colorMap.stroke ? `1px solid ${colorMap.stroke}` : 'none',
                padding: '0 1.5rem',
                fontWeight: 500,
                fontSize: '16px',
                height: height,
                background: colorMap.enabled,
                color: typeColors.primary,
                boxShadow: elevation.z4,
                '&:focus': {
                    backgroundColor: colorMap.focused,
                    boxShadow: elevation.z9,
                },
                '&:focus-visible': {
                    backgroundColor: colorMap.focused,
                    outline: `2px solid ${colors.focus.regular.outer}`,
                    boxShadow: [globalFocusShadow, elevation.z9].join(','),
                },
                '&:hover': {
                    backgroundColor: colorMap.hover,
                    boxShadow: elevation.z9,
                    '&:focus-visible': {
                        boxShadow: [globalFocusShadow, elevation.z9].join(','),
                    },
                },
                '&:active': {
                    backgroundColor: colorMap.pressed,
                    boxShadow: elevation.z1,
                    '&:focus-visible': {
                        boxShadow: [globalFocusShadow, elevation.z1].join(','),
                    },
                },
                '&:disabled': {
                    backgroundColor: colorMap.disabled,
                    boxShadow: 'none',
                    color: typeColors.disabled,
                },
            }}
            {...buttonProps}
        >
            {children}
        </MuiButton>
    );
};
