import React from 'react';
import { ListItemButton, List, ListItem, ListItemText, Box, Drawer, Toolbar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes } from './SideNavElements';
import { Palette } from '../../../styles/Theme';
import { SideNavProps } from './types';

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
            <List sx={{ paddingTop: '2em' }}>
                {Routes.map((route) => (
                    <ListItem key={route.name}>
                        <ListItemButton
                            data-testid={`SideNav/${route.name}-button`}
                            onClick={() => navigate(route.path)}
                        >
                            <ListItemText
                                primaryTypographyProps={{
                                    variant: 'h6',
                                    sx: [
                                        currentBaseRoute === route.base
                                            ? { color: Palette.secondary.main, fontWeight: 700 }
                                            : { color: 'white' },
                                    ],
                                }}
                                primary={route.name}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

const SideNav = ({ open, isMediumScreen, drawerWidth = 240 }: SideNavProps) => {
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
