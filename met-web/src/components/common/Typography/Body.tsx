import React from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { colors } from '../../common';

export const BodyText = ({
    bold,
    thin,
    size = 'regular',
    children,
    ...props
}: {
    bold?: boolean;
    thin?: boolean;
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
    const fontWeight = () => {
        if (bold) {
            return 700;
        }
        if (thin) {
            return 300;
        }
        return 400;
    };
    return (
        <Typography
            {...props}
            sx={{
                fontSize,
                lineHeight,
                fontWeight: fontWeight(),
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
