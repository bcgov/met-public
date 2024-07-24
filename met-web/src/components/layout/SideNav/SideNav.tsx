import React from 'react';
import { ListItemButton, List, ListItem, Box, Drawer, Toolbar, Divider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes, Route } from './SideNavElements';
import { Palette, colors } from '../../../styles/Theme';
import { SideNavProps, DrawerBoxProps, CloseButtonProps, IconAssignments } from './types';
import { MetHeader4 } from 'components/common';
import { When, Unless } from 'react-if';
import { useAppSelector } from 'hooks';
import UserGuideNav from './UserGuideNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/pro-regular-svg-icons/faHouse';
import { faPeopleArrows } from '@fortawesome/pro-regular-svg-icons/faPeopleArrows';
import { faSquarePollHorizontal } from '@fortawesome/pro-regular-svg-icons/faSquarePollHorizontal';
import { faTags } from '@fortawesome/pro-regular-svg-icons/faTags';
import { faGlobe } from '@fortawesome/pro-regular-svg-icons/faGlobe';
import { faUserGear } from '@fortawesome/pro-regular-svg-icons/faUserGear';
import { faHouseUser } from '@fortawesome/pro-regular-svg-icons/faHouseUser';
import { faMessagePen } from '@fortawesome/pro-regular-svg-icons/faMessagePen';
import { faLinkSlash } from '@fortawesome/pro-regular-svg-icons/faLinkSlash';
import { faCheck } from '@fortawesome/pro-solid-svg-icons/faCheck';
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons/faArrowLeft';

const CloseButton = ({ setOpen }: CloseButtonProps) => {
    return (
        <>
            <ListItem
                key={'closeMenu'}
                sx={{
                    backgroundColor: Palette.background.default,
                    '&:hover, &:focus': {
                        filter: 'brightness(96%)',
                    },
                    '&:active': {
                        filter: 'brightness(92%)',
                    },
                }}
            >
                <ListItemButton
                    onClick={() => setOpen(false)}
                    disableRipple
                    sx={{
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

const DrawerBox = ({ isMediumScreen, setOpen }: DrawerBoxProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const permissions = useAppSelector((state) => state.user.roles);

    const getCurrentBaseRoute = () => {
        return Routes.map((route) => route.base)
            .filter((route) => location.pathname.includes(route))
            .reduce((prev, curr) => (prev.length > curr.length ? prev : curr));
    };

    const currentBaseRoute = getCurrentBaseRoute();

    const filteredRoutes = Routes.filter((route) => {
        if (route.authenticated) {
            return route.allowedRoles.some((role) => permissions.includes(role));
        }
        return true;
    });

    const handleListItems = (route: Route, itemType: string) => {
        return (
            <>
                <When condition={'Tenant Admin' === route.name}>
                    <Divider sx={{ backgroundColor: Palette.primary.light, height: '0.2rem' }} />
                </When>
                <ListItem
                    key={route.name}
                    sx={{
                        backgroundColor: 'selected' === itemType ? colors.surface.blue[10] : Palette.background.default,
                        '&:hover, &:focus': {
                            filter: 'brightness(96%)',
                        },
                        '&:active': {
                            filter: 'brightness(92%)',
                        },
                    }}
                >
                    <ListItemButton
                        disableRipple
                        sx={{
                            '&:hover, &:active, &:focus': {
                                backgroundColor: 'transparent',
                            },
                        }}
                        data-testid={`SideNav/${route.name}-button`}
                        onClick={() => {
                            navigate(route.path);
                            setOpen(false);
                        }}
                    >
                        {handleFontAwesomeIcon(route, itemType)}
                        <MetHeader4
                            style={{
                                color: 'selected' === itemType ? Palette.primary.light : Palette.text.primary,
                                fontWeight: 'selected' === itemType ? 'bold' : '500',
                                fontSize: '1rem',
                            }}
                        >
                            {route.name}
                            <When condition={currentBaseRoute === route.base}>
                                <span style={{ position: 'absolute', right: '1rem' }}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                            </When>
                        </MetHeader4>
                    </ListItemButton>
                </ListItem>
                <Divider sx={{ backgroundColor: colors.surface.gray[30] }} />
                <When condition={'User Admin' === route.name}>
                    <UserGuideNav />
                </When>
            </>
        );
    };

    const handleFontAwesomeIcon = (route: Route, itemType: string) => {
        const fontAwesomeStyles = {
            fontSize: '1.1rem',
            color: 'selected' === itemType ? Palette.primary.light : Palette.text.primary,
            paddingRight: '0.75rem',
            width: '1.1rem',
        };
        const iconAssignments: IconAssignments = {
            Home: faHouse,
            Engagements: faPeopleArrows,
            Surveys: faSquarePollHorizontal,
            Metadata: faTags,
            Languages: faGlobe,
            'User Admin': faUserGear,
            'Tenant Admin': faHouseUser,
            'MET Feedback': faMessagePen,
        };
        // If the route name doesn't match an expected page title, return the broken link icon
        const possiblePageTitles: string[] = Object.keys(iconAssignments).filter((key) => key.includes(route.name));
        if (0 === possiblePageTitles.length) {
            return <FontAwesomeIcon icon={faLinkSlash} style={fontAwesomeStyles} />;
        }
        // Otherwise return the icon for the icon assignments key name that matches the route name.
        return <FontAwesomeIcon icon={iconAssignments[route.name]} style={fontAwesomeStyles} />;
    };

    return (
        <Box
            sx={{
                mr: isMediumScreen ? '1.25rem' : '0',
                overflow: 'auto',
                backgroundColor: Palette.background.default,
                borderTopRightRadius: '16px',
                borderBottomRightRadius: '16px',
                boxShadow: '0 5px 10px rgba(0, 0, 0, 0.4)',
                mt: '5.625rem',
            }}
        >
            <List sx={{ pt: '0', pb: '0' }}>
                {!isMediumScreen && <CloseButton setOpen={setOpen} />}
                {filteredRoutes.map((route) => (
                    <>
                        <When condition={currentBaseRoute === route.base}>{handleListItems(route, 'selected')}</When>
                        <Unless condition={currentBaseRoute === route.base}>{handleListItems(route, 'other')}</Unless>
                    </>
                ))}
            </List>
        </Box>
    );
};

const SideNav = ({ open, setOpen, isMediumScreen, drawerWidth = 300 }: SideNavProps) => {
    if (!drawerWidth) return <></>;
    return (
        <>
            {isMediumScreen ? (
                <Drawer
                    variant="permanent"
                    sx={{
                        height: '100vh',
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            backgroundColor: Palette.background.default,
                        },
                    }}
                >
                    <Toolbar />
                    <DrawerBox isMediumScreen={isMediumScreen} setOpen={setOpen} />
                </Drawer>
            ) : (
                <Drawer
                    sx={{
                        mt: '80px',
                        width: '100%',
                        background: Palette.background.default,
                        [`& .MuiDrawer-paper`]: {
                            width: '100%',
                            boxSizing: 'border-box',
                            backgroundColor: Palette.background.default,
                        },
                    }}
                    onClose={() => setOpen(false)}
                    anchor={'left'}
                    open={open}
                    hideBackdrop={!open}
                >
                    <DrawerBox isMediumScreen={isMediumScreen} setOpen={setOpen} />
                </Drawer>
            )}
        </>
    );
};

export default SideNav;
