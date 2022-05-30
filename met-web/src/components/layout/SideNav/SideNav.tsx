import React, { useState } from 'react';
import { ListItemButton, List, ListItem, ListItemText, Box, Drawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Routes } from './SideNavElements';

const DrawerBox = ({ navigate }) => {
    const [activeLink, setActiveLink] = useState('/');

    const navigation = (path) => {
        setActiveLink(path);
        navigate(path);
    };

    return (
        <Box sx={{ height: '100%', width: '100%', background: '#003366' }} role="presentation">
            <List sx={{ top: '10%' }}>
                {Routes.map((route) => (
                    <ListItem sx={{ height: '50%' }} key={route.name}>
                        <ListItemButton onClick={() => navigation(route.path)}>
                            <ListItemText
                                primaryTypographyProps={{
                                    variant: 'h6',
                                    sx: {
                                        fontWeight: 'bold',
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

const SideNav = ({ open, isMediumScreen }) => {
    const navigate = useNavigate();

    return (
        <>
            {isMediumScreen ? (
                <Drawer
                    sx={{
                        width: '13%',
                        background: '#003366',
                    }}
                    PaperProps={{ sx: { width: '15%' } }}
                    anchor={'left'}
                    open={true}
                    hideBackdrop={true}
                >
                    <DrawerBox navigate={navigate} />
                </Drawer>
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
