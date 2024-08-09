import React from 'react';
import {
    ListItemButton,
    List,
    ListItem,
    Box,
    Drawer,
    Toolbar,
    Divider,
    SwipeableDrawer,
    Grid,
    Avatar,
    ThemeProvider,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Routes, Route } from './SideNavElements';
import { DarkTheme, Palette, colors, ZIndex } from '../../../styles/Theme';
import { SideNavProps, DrawerBoxProps } from './types';
import { When } from 'react-if';
import { useAppSelector } from 'hooks';
import UserGuideNav from './UserGuideNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkSlash } from '@fortawesome/pro-regular-svg-icons/faLinkSlash';
import { faCheck } from '@fortawesome/pro-solid-svg-icons/faCheck';
import { Link } from 'components/common/Navigation';
import { BodyText } from 'components/common/Typography';
import { USER_ROLES } from 'services/userService/constants';
import UserService from 'services/userService';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

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

const DrawerBox = ({ isMediumScreenOrLarger, setOpen }: DrawerBoxProps) => {
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
                        component={Link}
                        disableRipple
                        sx={{
                            '&:hover, &:active, &:focus': {
                                backgroundColor: 'transparent',
                            },
                            padding: 2,
                            pl: 4,
                        }}
                        data-testid={`SideNav/${route.name}-button`}
                        to={route.path}
                        onClick={() => {
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
                mt: isMediumScreenOrLarger ? '8.5rem' : '5.625rem',
                zIndex: ZIndex.sideNav,
            }}
        >
            <List sx={{ pt: { xs: 4, md: 0 }, pb: '0' }}>
                {allowedRoutes.map((route) =>
                    renderListItem(route, currentBaseRoute === route.base ? 'selected' : 'other'),
                )}
            </List>
        </Box>
    );
};

const SideNav = ({ open, setOpen, isMediumScreen }: SideNavProps) => {
    const currentUser = useAppSelector((state) => state.user.userDetail.user);
    if (isMediumScreen)
        return (
            <Drawer
                ModalProps={{
                    hideBackdrop: true,
                }}
                PaperProps={{
                    sx: {
                        border: 'none',
                        width: '300px',
                        boxSizing: 'border-box',
                        background: 'transparent',
                        height: '48.75rem',
                    },
                }}
                hideBackdrop
                elevation={0}
                variant="permanent"
                sx={{
                    height: '100vh',
                    width: '300px',
                    flexShrink: 0,
                }}
            >
                <Toolbar />
                <DrawerBox isMediumScreenOrLarger={isMediumScreen} setOpen={setOpen} />
            </Drawer>
        );
    return (
        <SwipeableDrawer
            PaperProps={{
                sx: { width: '100%', height: '100%', minHeight: 'calc(100vh)', background: colors.surface.blue[90] },
            }}
            sx={{
                mt: '80px',
                zIndex: (theme) => theme.zIndex.drawer + 3, // render above feedback button
            }}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            anchor={'top'}
            open={open}
            disableEnforceFocus
            disablePortal
        >
            <Box>
                <DrawerBox isMediumScreenOrLarger={isMediumScreen} setOpen={setOpen} />
                <ThemeProvider theme={DarkTheme}>
                    <Grid
                        m={2}
                        container
                        sx={{ width: 'calc(100% - 16px) ' }}
                        direction="row"
                        alignItems="center"
                        spacing={1}
                    >
                        <Grid item>
                            <Avatar
                                sx={{
                                    backgroundColor: colors.surface.blue[10],
                                    height: 32,
                                    width: 32,
                                    fontSize: '16px',
                                }}
                            >
                                {currentUser?.first_name[0]}
                                {currentUser?.last_name[0]}
                            </Avatar>
                        </Grid>
                        <Grid item sx={{ textAlign: 'left' }}>
                            <BodyText size="small" sx={{ userSelect: 'none' }}>
                                Hello {currentUser?.first_name}
                            </BodyText>
                            <BodyText sx={{ fontSize: '10px', lineHeight: 1 }}>
                                {currentUser?.roles.includes(USER_ROLES.SUPER_ADMIN)
                                    ? 'Super Admin'
                                    : currentUser?.main_role ?? 'User'}
                            </BodyText>
                        </Grid>
                        <Grid item sx={{ marginLeft: 'auto', marginRight: '32px' }}>
                            <Link onClick={UserService.doLogout} to={'#'}>
                                Logout
                                <FontAwesomeIcon style={{ marginLeft: '4px' }} icon={faArrowRight} />
                            </Link>
                        </Grid>
                    </Grid>
                </ThemeProvider>
            </Box>
        </SwipeableDrawer>
    );
};

export default SideNav;
