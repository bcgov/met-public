import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import UserService from 'services/userService';
import { useMediaQuery, Theme } from '@mui/material';
import { useLocation } from 'react-router-dom';

const LoggedOutHeader = () => {
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const location = useLocation();
    const loginPage = location.pathname === '/';
    console.log('location', location.pathname);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Box
                        component="img"
                        sx={{
                            height: '5em',
                            // width: '15em',
                            width: { xs: '7em', md: '15em' },
                            marginRight: { xs: '1em', md: '3em' },
                        }}
                        alt="BC Logo."
                        src="https://www2.gov.bc.ca/StaticWebResources/static/gov3/images/gov_bc_logo.svg"
                    />
                    <Typography variant={isMediumScreen ? 'h3' : 'h6'} component="div" sx={{ flexGrow: 1 }}>
                        {loginPage ? 'Login to MET' : 'MET'}
                    </Typography>
                    <Button color="inherit" onClick={() => UserService.doLogin()}>
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default LoggedOutHeader;
