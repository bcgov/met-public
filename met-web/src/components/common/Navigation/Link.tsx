import React from 'react';
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { colors } from '..';

interface FocusableNavLinkProps extends MuiLinkProps {
    to?: string;
    href?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    size?: 'small' | 'regular' | 'large';
}

export const Link: React.FC<FocusableNavLinkProps> = ({ children, size = 'regular', to, href, onClick, ...props }) => {
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
        <MuiLink
            onClick={onClick}
            component={to ? NavLink : 'a'}
            to={to}
            href={href}
            sx={{
                '&:focus-visible': {
                    outline: `2px solid ${colors.focus.regular.outer}`,
                    outlineOffset: '4px',
                },
                outline: 'none',
                outlineOffset: '2px',
                borderRadius: '8px',
                fontSize,
                lineHeight,
                ...props.sx, // include any other styles passed in props
            }}
            {...props}
        >
            {children}
        </MuiLink>
    );
};
