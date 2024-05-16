import React from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { globalFocusVisible, colors } from '../../common';
import { Link as RouterLink } from 'react-router-dom';

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
        small: '1.375',
        regular: '1.5',
        large: '1.625',
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

export const Link = ({
    bold,
    size = 'regular',
    children,
    ...props
}: {
    bold?: boolean;
    size?: 'small' | 'regular' | 'large';
    to: string;
    children: React.ReactNode;
}) => {
    const fontSize = {
        small: '14px',
        regular: '16px',
        large: '18px',
    }[size];
    const lineHeight = {
        small: '1.375',
        regular: '1.5',
        large: '1.625',
    }[size];
    return (
        <RouterLink
            style={{
                lineHeight,
                fontSize,
                textDecoration: 'none',
                fontWeight: bold ? 700 : 400,
                color: colors.type.regular.link,
                ...globalFocusVisible,
            }}
            {...props}
        >
            {children}
        </RouterLink>
    );
};
