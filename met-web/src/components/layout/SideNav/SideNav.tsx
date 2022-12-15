import React from 'react';
import { ListItemButton, List, ListItem, ListItemText, Box, Drawer, Toolbar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes } from './SideNavElements';
import { Palette } from '../../../styles/Theme';
import { SideNavProps } from './types';
import { MetHeader4 } from 'components/common';
import { When, Unless } from 'react-if';

const DrawerBox = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getCurrentBaseRoute = () => {
        return Routes.map((route) => route.base)
            .filter((route) => location.pathname.includes(route))
            .reduce((prev, curr) => (prev.length > curr.length ? prev : curr));
    };

    const currentBaseRoute = getCurrentBaseRoute();

    return (
        <Box
            sx={{
                overflow: 'auto',
                height: '100%',
                background: Palette.primary.main,
            }}
        >
            <List sx={{ paddingTop: '2.5em' }}>
                {Routes.map((route) => (
                    <ListItem key={route.name}>
                        <ListItemButton
                            data-testid={`SideNav/${route.name}-button`}
                            onClick={() => navigate(route.path)}
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
            </List>
        </Box>
    );
};

const SideNav = ({ open, isMediumScreen, drawerWidth = 280 }: SideNavProps) => {
    return (
        <>
            {isMediumScreen ? (
                <Drawer
                    variant="permanent"
                    sx={{
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
                    anchor={'left'}
                    open={open}
                    hideBackdrop={!open}
                >
                    <Toolbar />
                    <DrawerBox />
                </Drawer>
            )}
        </>
    );
};

export default SideNav;
