import React, { useState } from 'react';
import { ListItemButton, List, ListItem, ListItemText, Box, Drawer, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Routes } from './SideNavElements';

const DrawerBox = ({ navigate }: DrawerBoxProps) => {
    const [activeLink, setActiveLink] = useState('/');

    const navigation = (path: string) => {
        setActiveLink(path);
        navigate(path);
    };

    return (
        <Box sx={{ overflow: 'auto', height: '100%', background: '#003366' }} role="presentation">
            <List>
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

const SideNav = ({ open, isMediumScreen }: SideNavProps) => {
    const navigate = useNavigate();

    return (
        <>
            {isMediumScreen ? (
                <Box sx={{ paddingTop: '10vh', height: '100vh', width: 240 }}>
                    <DrawerBox navigate={navigate} />
                </Box>
            ) : (
                <Drawer
                    sx={{
                        width: '15%',
                        background: '#003366',
                    }}
                    anchor={'left'}
                    open={open}
                    hideBackdrop={!open}
                >
                    <DrawerBox navigate={navigate} />
                </Drawer>
            )}
        </>
    );
};

export default SideNav;
