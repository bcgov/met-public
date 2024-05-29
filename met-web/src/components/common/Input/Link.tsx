import React, { useState } from 'react';
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';
import { NavLink } from 'react-router-dom';

interface FocusableNavLinkProps extends MuiLinkProps {
    to?: string;
    href?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const Link: React.FC<FocusableNavLinkProps> = ({ children, to, href, onClick, ...props }) => {
    const [focused, setFocused] = useState(false);

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    return (
        <MuiLink
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={onClick}
            component={to ? NavLink : 'a'}
            to={to}
            href={href}
            sx={{
                boxShadow: focused ? '0 0 0 2px white, 0 0 0 4px #2E5DD7' : 'none',
                outline: 'none',
                borderRadius: '8px',
                ...props.sx, // include any other styles passed in props
            }}
            {...props}
        >
            {children}
        </MuiLink>
    );
};
