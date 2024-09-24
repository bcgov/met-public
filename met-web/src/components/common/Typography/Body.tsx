import React from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { colors } from 'styles/Theme';

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
                ...props.sx,
            }}
        >
            {children}
        </Typography>
    );
};

export const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) {
        return <></>;
    }
    return (
        <BodyText bold size="small" sx={{ color: colors.notification.error.shade, lineHeight: '24px' }}>
            <FontAwesomeIcon
                icon={faExclamationCircle}
                style={{ marginRight: '8px', fontSize: '18px', position: 'relative', top: '2px' }}
            />
            {error}
        </BodyText>
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
                ...props.sx,
            }}
        >
            {children}
        </Typography>
    );
};
