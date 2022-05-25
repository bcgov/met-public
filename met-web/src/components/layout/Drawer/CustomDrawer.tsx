import React from 'react';
import AppBar from '@mui/material/AppBar';
import { Grid, ListItemButton, List, ListItem, ListItemText, Box } from '@mui/material';
import { useAppSelector } from '../../../hooks';
import UserService from '../../../services/UserServices';
import { useNavigate } from 'react-router-dom';

const Routes = [
    { name: 'Engagements', path: '/' },
    { name: 'Surveys', path: '/survey' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Reporting', path: '/reporting' },
];

const list = (navigate) => (
    <Box role="presentation">
        <List>
            {Routes.map((route, index) => (
                <ListItem key={route.name}>
                    <ListItemButton onClick={() => navigate(route.path)}>
                        <ListItemText
                            primaryTypographyProps={{ variant: 'h6', sx: { fontWeight: 'bold' } }}
                            primary={route.name}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </Box>
);

const Drawer = () => {
    const navigate = useNavigate();
    return (
        <AppBar
            className="font-BCBold"
            position="absolute"
            style={{
                height: '90vh',
                top: '10%',
                left: '0%',
                width: '13%',
            }}
        >
            {list(navigate)}
        </AppBar>
    );
};

export default Drawer;
