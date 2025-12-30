import React, { useLayoutEffect, useState } from 'react';
import {
    ListItemButton,
    List,
    ListItem,
    Box,
    Drawer,
    Toolbar,
    SwipeableDrawer,
    Grid,
    Avatar,
    ThemeProvider,
} from '@mui/material';
import { getAuthoringRoutes as getRoutes, AuthoringRoute as Route } from './AuthoringNavElements';
import { DarkTheme, Palette, colors, ZIndex } from 'styles/Theme';
import { AuthoringNavProps, DrawerBoxProps } from './types';
import { When } from 'react-if';
import { useAppSelector } from 'hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/pro-light-svg-icons/faPencil';
import { Link } from 'components/common/Navigation';
import { BodyText } from 'components/common/Typography';
import { USER_ROLES } from 'services/userService/constants';
import UserService from 'services/userService';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeftLong } from '@fortawesome/pro-light-svg-icons';
import { faCheck } from '@fortawesome/pro-regular-svg-icons';
import { StatusCircle } from '../../view/AuthoringTab';

export const routeItemStyle = {
    padding: 0,
    backgroundColor: Palette.background.default,
    '&:hover, &:focus': {
        filter: 'brightness(96%)',
    },
    '&:active': {
        filter: 'brightness(92%)',
    },
    borderRadius: '8px',
};

const DrawerBox = ({ isMediumScreenOrLarger, setOpen, engagementId }: DrawerBoxProps) => {
    const permissions = useAppSelector((state) => state.user.roles);

    const currentRoutePath = getRoutes(Number(engagementId))
        .map((route) => route.path)
        .filter((route) => window.location.pathname.includes(route))
        .reduce((prev, curr) => (prev.length > curr.length ? prev : curr));

    const allowedRoutes = getRoutes(Number(engagementId)).filter((route) => {
        return !route.authenticated || route.allowedRoles.some((role) => permissions.includes(role));
    });

    const renderListItem = (route: Route, itemType: string, key: number, engagementId: number) => {
        const navLabelTextStyles: React.CSSProperties = {
            display: 'flex',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            color: Palette.text.primary,
            marginTop: '1.4rem',
            marginBottom: '1rem',
        };
        return (
            <React.Fragment key={key}>
                <When condition={'Hero Banner' === route.name || 'View Results' === route.name}>
                    <span style={navLabelTextStyles}>
                        {'Hero Banner' === route.name ? 'Required' : 'Optional'} Sections
                    </span>
                </When>
                <ListItem
                    key={key}
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
                        }}
                        data-testid={`SideNav/${route.name}-button`}
                        to={route.path}
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        <When condition={true}>
                            <span
                                style={{
                                    paddingRight: '0.6rem',
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    style={{
                                        color: 'selected' === itemType ? Palette.primary.main : Palette.text.primary,
                                        fontWeight: 'bold',
                                    }}
                                />
                            </span>
                        </When>
                        <span
                            style={{
                                color: 'selected' === itemType ? Palette.primary.main : Palette.text.primary,
                                fontWeight: 'selected' === itemType ? 'bold' : '500',
                                fontSize: '1rem',
                            }}
                        >
                            {route.name}
                        </span>
                        <StatusCircle required={route.required || false} />
                        <When condition={currentRoutePath === route.path}>
                            <span
                                style={{
                                    position: 'absolute',
                                    right: '1.2rem',
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faPencil}
                                    style={{
                                        color: 'selected' === itemType ? Palette.primary.main : Palette.text.primary,
                                    }}
                                />
                            </span>
                        </When>
                    </ListItemButton>
                </ListItem>
            </React.Fragment>
        );
    };

    return (
        <Box
            component="nav"
            aria-label="Authoring Navigation"
            sx={{
                mr: '0',
                mt: isMediumScreenOrLarger ? '9rem' : '5.625rem',
                pl: '3.1rem',
                overflow: 'auto',
                backgroundColor: Palette.background.default,
                zIndex: ZIndex.sideNav,
                borderRadius: '0 8px 8px 0',
            }}
        >
            <List sx={{ pt: { xs: 4, md: 0 }, pb: '0' }}>
                {/* Engagement Home link */}
                <Link
                    to={getRoutes(Number(engagementId))[0].path}
                    style={{
                        color: Palette.text.primary,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <FontAwesomeIcon
                        style={{ fontSize: '1.3rem', fontWeight: 'normal', paddingRight: '0.5rem' }}
                        icon={faArrowLeftLong}
                    />
                    <span style={{ fontWeight: 'bold' }}>{getRoutes(Number(engagementId))[0].name}</span>
                </Link>
                <br />
                {/* All other menu items */}
                {allowedRoutes.map(
                    (route, key) =>
                        0 !== key &&
                        renderListItem(
                            route,
                            currentRoutePath === route.path ? 'selected' : 'other',
                            key,
                            Number(engagementId),
                        ),
                )}
            </List>
        </Box>
    );
};

const AuthoringSideNav = ({ open, setOpen, isMediumScreen, engagementId }: AuthoringNavProps) => {
    const currentUser = useAppSelector((state) => state.user.userDetail.user);
    const [sideNavOffset, setSideNavOffset] = useState(0);

    useLayoutEffect(() => {
        if (!isMediumScreen) return;
        const handleScroll = () => {
            const footerBox = document.querySelector('footer')?.getBoundingClientRect();
            if (!footerBox) return;
            // How far down the side nav can be in "absolute" mode and not overlap the footer
            const footerClearance =
                footerBox.top - (document.querySelector('#authoring-sidenav-drawer')?.clientHeight ?? 0);
            setSideNavOffset(footerClearance);
        };
        globalThis.addEventListener('scroll', handleScroll, { passive: true });
        globalThis.addEventListener('resize', handleScroll, { passive: true });
        handleScroll(); // Initial run on load
        return () => {
            globalThis.removeEventListener('scroll', handleScroll);
            globalThis.removeEventListener('resize', handleScroll);
        };
    }, [isMediumScreen]);

    if (isMediumScreen)
        return (
            <Drawer
                ModalProps={{
                    hideBackdrop: true,
                }}
                slotProps={{
                    paper: {
                        id: 'authoring-sidenav-drawer',
                        sx: {
                            border: 'none',
                            width: '18.75rem',
                            boxSizing: 'border-box',
                            background: 'transparent',
                            height: '55rem',
                            position: sideNavOffset <= 0 ? 'absolute' : 'fixed',
                            top: sideNavOffset <= 0 ? sideNavOffset + globalThis.scrollY : 'auto',
                        },
                    },
                }}
                hideBackdrop
                elevation={0}
                variant="permanent"
                sx={{
                    height: '100vh',
                    width: '18.75rem',
                    flexShrink: 0,
                }}
            >
                <Toolbar />
                <DrawerBox isMediumScreenOrLarger={isMediumScreen} setOpen={setOpen} engagementId={engagementId} />
            </Drawer>
        );
    return (
        <SwipeableDrawer
            PaperProps={{
                sx: { width: '100%', height: '100%', minHeight: 'calc(100vh)', background: colors.surface.blue[90] },
            }}
            sx={{
                mt: '5rem',
                zIndex: (theme) => theme.zIndex.drawer + 3, // render above feedback button
            }}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            anchor={'top'}
            open={open}
            disableEnforceFocus
            disablePortal
            swipeAreaWidth={64}
        >
            <Box>
                <DrawerBox isMediumScreenOrLarger={isMediumScreen} setOpen={setOpen} engagementId={engagementId} />
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
                                    : (currentUser?.main_role ?? 'User')}
                            </BodyText>
                        </Grid>
                        <Grid item sx={{ marginLeft: 'auto', marginRight: '2rem' }}>
                            <Link onClick={UserService.doLogout} to={'#'}>
                                Logout
                                <FontAwesomeIcon style={{ marginLeft: '0.25rem' }} icon={faArrowRight} />
                            </Link>
                        </Grid>
                    </Grid>
                </ThemeProvider>
            </Box>
        </SwipeableDrawer>
    );
};

export default AuthoringSideNav;
