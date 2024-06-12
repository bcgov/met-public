import React from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { globalFocusVisible, colors } from '../../common';
import { LinkProps, Link as RouterLink } from 'react-router-dom';

export const BodyText = ({
    bold,
    size = 'regular',
    children,
    ...props
}: {
    bold?: boolean;
    size?: 'small' | 'regular' | 'large';
    children: React.ReactNode;
} & TypographyProps) => {
    const fontSize = {
        small: '14px',
        regular: '16px',
        large: '18px',
    }[size];
    const lineHeight = {
        small: '22px',
        regular: '24px',
        large: '24px',
    }[size];
    return (
        <Typography
            {...props}
            sx={{
                fontSize,
                lineHeight,
                fontWeight: bold ? 700 : 400,
                color: colors.type.regular.primary,
                ...props.sx,
            }}
        >
            {children}
        </Typography>
    );
};

export const EyebrowText = ({
    children,
    ...props
}: {
    children: React.ReactNode;
} & TypographyProps) => {
    return (
        <Typography
            variant="body1"
            {...props}
            sx={{
                fontSize: '24px',
                lineHeight: 'normal',
                fontWeight: 300,
                color: colors.surface.gray[90],
                ...props.sx,
            }}
        >
            {children}
        </Typography>
    );
};
