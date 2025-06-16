import React from 'react';
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';
import { LinkProps, NavLink } from 'react-router-dom';
import { colors } from '..';

interface FocusableNavLinkProps extends MuiLinkProps {
    to?: string;
    href?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    size?: 'small' | 'regular' | 'large';
}

/**
 * A link component that can be used with react-router's NavLink or as a regular anchor tag.
 * It supports different sizes and colors, and can handle click events.
 * @param {FocusableNavLinkProps} props - The properties for the link component.
 * @param {React.ReactNode} props.children - The content of the link.
 * @param {string} [props.size='regular'] - The size of the link; can be 'small', 'regular', or 'large'.
 * @param {string} props.to - An **internal route** to open when clicked. If this is specified, element renders with react-router's NavLink.
 * @param {string} props.href - An **external URL** to open when clicked. Renders as a regular anchor tag.
 * @param {React.MouseEventHandler<HTMLAnchorElement>} [props.onClick] - Optional click handler for the link.
 * @param {string} [props.color] - The color of the link text. If not specified, it defaults to the theme's link color.
 * @returns {JSX.Element} A styled link component that can be used in a React application.
 * @example
 * <Link to="/home" size="large" color="primary" onClick={() => console.log('Link clicked')}>
 *     Home
 * </Link>
 * <Link href="https://example.com" size="small" color="secondary">
 *     External Link
 * </Link>
 * @see {@link https://mui.com/material-ui/api/link/} for more details on the MuiLink component.
 */
export const Link: React.FC<FocusableNavLinkProps> = ({
    children,
    size = 'regular',
    to,
    href,
    onClick,
    color,
    ...props
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
    const textColor = color ?? undefined;
    return (
        <MuiLink
            onClick={onClick}
            component={to ? NavLink : 'a'}
            to={to}
            href={href}
            sx={{
                color: textColor,
                textDecorationColor: textColor,
                '&:focus-visible': {
                    outline: `2px solid ${colors.focus.regular.outer}`,
                    outlineOffset: '2px',
                    boxShadow: '0px 0px 0px 2px white',
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

/* Adapter for elements expecting Mui's Link component, allowing them to use react-router's Link component */
export const RouterLinkRenderer = ({ href, ...props }: Omit<LinkProps, 'to'> & { href: string }) => (
    <Link to={href} {...props} />
);
