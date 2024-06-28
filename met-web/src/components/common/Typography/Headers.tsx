import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

const fontWeight = (weight?: string | number) => {
    switch (weight) {
        case 'bold':
            return 700;
        case 'regular':
            return 400;
        case 'thin':
            return 200;
        default:
            return weight;
    }
};

export const Header1 = ({
    children,
    weight,
    component,
    ...props
}: {
    children: React.ReactNode;
    weight?: 'bold' | 'regular' | 'thin';
    component?: React.ElementType;
} & TypographyProps) => {
    return (
        <Typography
            component={component || 'h1'}
            variant="h1"
            {...props}
            sx={{
                lineHeight: '1.5',
                fontSize: '2rem',
                marginBottom: '2rem',
                marginTop: '1.5rem',
                fontWeight: fontWeight(weight),
                color: '#292929',
                ...props.sx,
            }}
        >
            {children}
        </Typography>
    );
};

export const Header2 = ({
    children,
    decorated = false,
    weight,
    component,
    ...props
}: {
    children: React.ReactNode;
    decorated?: boolean;
    weight?: 'bold' | 'regular' | 'thin';
    component?: React.ElementType;
} & TypographyProps) => {
    return (
        <Typography
            variant="h2"
            component={component || 'h2'}
            {...props}
            sx={{
                lineHeight: '1.5',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                marginTop: '0.5rem',
                fontWeight: fontWeight(weight),
                ...(decorated && {
                    '&::before': {
                        backgroundColor: '#FCBA19',
                        content: '""',
                        display: 'block',
                        width: '40px',
                        height: '4px',
                        position: 'relative',
                        bottom: '4px',
                    },
                }),
                ...props.sx,
            }}
        >
            {children}
        </Typography>
    );
};

const Headers = {
    Header1,
    Header2,
};

export default Headers;
