import React, { useState } from 'react';
import { ListItemButton, List, ListItem, ListItemText, Box, Drawer, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Routes } from './SideNavElements';
import { Palette } from '../../../styles/Theme';
import { DrawerBoxProps, SideNavProps } from './types';

const DrawerBox = ({ navigate }: DrawerBoxProps) => {
    const [activeLink, setActiveLink] = useState('/');

    const navigation = (path: string) => {
        setActiveLink(path);
        navigate(path);
    };

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
                        <ListItemButton onClick={() => navigation(route.path)}>
                            <ListItemText
                                primaryTypographyProps={{
                                    variant: 'h6',
                                    sx: {
                                        color: activeLink === route.path ? '#ffc107' : '#fafafa',
                                    },
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
    const navigate = useNavigate();

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
                    <DrawerBox navigate={navigate} />
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
                    <DrawerBox navigate={navigate} />
                </Drawer>
            )}
        </>
    );
};

export default SideNav;
