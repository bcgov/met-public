import React from 'react';
import AppBar from '@mui/material/AppBar';
import { Grid, ListItemButton, List, ListItem, ListItemText, Box } from '@mui/material';
import { useAppSelector } from '../../../hooks';
import UserService from '../../../services/UserServices';


const list = () => (
    <Box
        sx={{
            background: '#003366',
            height: '100%',
            color: 'white',
            width: 'auto',
            justifyContent: 'center',
            alignItems: 'center',
        }}
        role="presentation"
    >
        <List>
            {['Engagements', 'Surveys', 'Calendar', 'Reporting'].map((text, index) => (
                <ListItem key={text}>
                    <ListItemButton
                        sx={{
                            fontWeight: 'bold',
                            width: '100%',
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ListItemText
                            sx={{
                                fontWeight: 'bold',
                                width: '100%',
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            primary={text}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </Box>
);

const Drawer = () => {
    return (
        <AppBar
            className="font-BCBold"
            position="absolute"
            style={{
                backgroundColor: '#003366',
                height: '90vh',
                top: '10%',
                left: '0%',
                width: '13%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {list()}
        </AppBar>
    );
};

export default Drawer;
