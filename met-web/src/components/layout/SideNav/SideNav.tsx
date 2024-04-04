import React from 'react';
import { ListItemButton, List, ListItem, Box, Drawer, Toolbar, Divider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes } from './SideNavElements';
import { Palette } from '../../../styles/Theme';
import { SideNavProps } from './types';
import { MetHeader4 } from 'components/common';
import { When, Unless } from 'react-if';
import { useAppSelector } from 'hooks';
import UserGuideNav from './UserGuideNav';

const DrawerBox = () => {
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
    return (
        <Box
            sx={{
                overflow: 'auto',
                height: '100%',
                background: Palette.primary.main,
            }}
        >
            <List sx={{ paddingTop: '2.5em' }}>
                {filteredRoutes.map((route) => (
                    <ListItem key={route.name}>
                        <ListItemButton
                            data-testid={`SideNav/${route.name}-button`}
                            onClick={() => navigate(route.path)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: Palette.hover.light,
                                },
                            }}
                        >
                            <When condition={currentBaseRoute === route.base}>
                                <MetHeader4 color={Palette.secondary.main} bold>
                                    {route.name}
                                </MetHeader4>
                            </When>
                            <Unless condition={currentBaseRoute === route.base}>
                                <MetHeader4 color={'white'}>{route.name}</MetHeader4>
                            </Unless>
                        </ListItemButton>
                    </ListItem>
                ))}
                <Divider sx={{ backgroundColor: 'var(--bcds-surface-background-white)' }} />
                <UserGuideNav />
            </List>
        </Box>
    );
};

const SideNav = ({ open, setOpen, isMediumScreen, drawerWidth = 280 }: SideNavProps) => {
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
                            backgroundColor: Palette.primary.main,
                        },
                    }}
                >
                    <Toolbar />
                    <DrawerBox />
                </Drawer>
            ) : (
                <Drawer
                    sx={{
                        width: '15%',
                        background: Palette.primary.main,
                    }}
                    onClose={() => setOpen(false)}
                    anchor={'left'}
                    open={open}
                    hideBackdrop={!open}
                >
                    <DrawerBox />
                </Drawer>
            )}
        </>
    );
};

export default SideNav;
