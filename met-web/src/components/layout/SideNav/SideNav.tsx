import React from 'react';
import { ListItemButton, List, ListItem, Box, Drawer, Toolbar, Divider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes, Route } from './SideNavElements';
import { Palette, colors } from '../../../styles/Theme';
import { SideNavProps, DrawerBoxProps, CloseButtonProps } from './types';
import { When, Unless } from 'react-if';
import { useAppSelector } from 'hooks';
import UserGuideNav from './UserGuideNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkSlash } from '@fortawesome/pro-regular-svg-icons/faLinkSlash';
import { faCheck } from '@fortawesome/pro-solid-svg-icons/faCheck';
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons/faArrowLeft';

export const routeItemStyle = {
    padding: 0,
    backgroundColor: Palette.background.default,
    '&:hover, &:focus': {
        filter: 'brightness(96%)',
    },
    '&:active': {
        filter: 'brightness(92%)',
    },
    '&:has(.MuiButtonBase-root:focus-visible)': {
        boxShadow: `inset 0px 0px 0px 2px ${colors.focus.regular.outer}`,
    },
    '&:first-of-type': {
        borderTopRightRadius: '16px', //round outline to match border radius of parent
    },
    '&:last-of-type': {
        borderBottomRightRadius: '16px',
    },
};

const CloseButton = ({ setOpen }: CloseButtonProps) => {
    return (
        <>
            <ListItem key={'closeMenu'} sx={routeItemStyle}>
                <ListItemButton
                    onClick={() => setOpen(false)}
                    disableRipple
                    sx={{
                        padding: 2,
                        pr: 4,
                        justifyContent: 'flex-end',
                        color: Palette.text.primary,
                        '&:hover, &:active, &:focus': {
                            backgroundColor: 'transparent',
                        },
                    }}
                >
                    <FontAwesomeIcon icon={faArrowLeft} style={{ paddingRight: '0.75rem' }} />
                    Close Menu
                </ListItemButton>
            </ListItem>
            <Divider sx={{ backgroundColor: colors.surface.gray[30] }} />
        </>
    );
};

const DrawerBox = ({ isMediumScreenOrLarger, setOpen }: DrawerBoxProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const permissions = useAppSelector((state) => state.user.roles);

    const currentBaseRoute = Routes.map((route) => route.base)
        .filter((route) => location.pathname.includes(route))
        .reduce((prev, curr) => (prev.length > curr.length ? prev : curr));

    const allowedRoutes = Routes.filter((route) => {
        return !route.authenticated || route.allowedRoles.some((role) => permissions.includes(role));
    });

    const renderListItem = (route: Route, itemType: string) => {
        return (
            <>
                <When condition={'Tenant Admin' === route.name}>
                    <Divider sx={{ backgroundColor: Palette.primary.light, height: '0.2rem' }} />
                </When>
                <ListItem
                    key={route.name}
                    sx={{
                        ...routeItemStyle,
                        backgroundColor: 'selected' === itemType ? colors.surface.blue[10] : Palette.background.default,
                    }}
                >
                    <ListItemButton
                        component="a"
                        disableRipple
                        sx={{
                            '&:hover, &:active, &:focus': {
                                backgroundColor: 'transparent',
                            },
                            padding: 2,
                            pl: 4,
                        }}
                        data-testid={`SideNav/${route.name}-button`}
                        onClick={() => {
                            navigate(route.path);
                            setOpen(false);
                        }}
                    >
                        <FontAwesomeIcon
                            style={{
                                fontSize: '1.1rem',
                                color: 'selected' === itemType ? Palette.primary.light : Palette.text.primary,
                                paddingRight: '0.75rem',
                                width: '1.1rem',
                            }}
                            icon={route.icon ?? faLinkSlash}
                        />

                        <span
                            style={{
                                color: 'selected' === itemType ? Palette.primary.light : Palette.text.primary,
                                fontWeight: 'selected' === itemType ? 'bold' : '500',
                                fontSize: '1rem',
                            }}
                        >
                            {route.name}
                            <When condition={currentBaseRoute === route.base}>
                                <span style={{ position: 'absolute', right: '2rem' }}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                            </When>
                        </span>
                    </ListItemButton>
                </ListItem>
                <Divider sx={{ backgroundColor: colors.surface.gray[30] }} />
                <When condition={'User Admin' === route.name}>
                    <UserGuideNav />
                </When>
            </>
        );
    };

    return (
        <Box
            component="nav"
            aria-label="Administration navigation"
            sx={{
                mr: isMediumScreenOrLarger ? '1.25rem' : '0',
                overflow: 'auto',
                backgroundColor: Palette.background.default,
                borderTopRightRadius: '16px',
                borderBottomRightRadius: '16px',
                boxShadow: '0 5px 10px rgba(0, 0, 0, 0.4)',
                mt: '5.625rem',
            }}
        >
            <List sx={{ pt: '0', pb: '0' }}>
                <Unless condition={isMediumScreenOrLarger}>
                    <CloseButton setOpen={setOpen} />
                </Unless>
                {allowedRoutes.map((route) =>
                    renderListItem(route, currentBaseRoute === route.base ? 'selected' : 'other'),
                )}
            </List>
        </Box>
    );
};

const SideNav = ({ open, setOpen, isMediumScreen, drawerWidth = 300 }: SideNavProps) => {
    if (!drawerWidth) return <></>;
    if (isMediumScreen)
        return (
            <Drawer
                PaperProps={{
                    sx: {
                        border: 'none',
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: Palette.background.default,
                    },
                }}
                elevation={0}
                variant="permanent"
                sx={{
                    height: '100vh',
                    width: drawerWidth,
                    flexShrink: 0,
                }}
            >
                <Toolbar />
                <DrawerBox isMediumScreenOrLarger={isMediumScreen} setOpen={setOpen} />
            </Drawer>
        );
    return (
        <Drawer
            PaperProps={{ sx: { width: '100%' } }}
            sx={{
                mt: '80px',
                width: '100%',
            }}
            onClose={() => setOpen(false)}
            anchor={'left'}
            open={open}
            hideBackdrop={!open}
        >
            <DrawerBox isMediumScreenOrLarger={isMediumScreen} setOpen={setOpen} />
        </Drawer>
    );
};

export default SideNav;
