import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useAppSelector } from '../../../hooks';
import { IconButton, Button, useMediaQuery } from '@mui/material';
import UserService from '../../../services/UserServices';
import { LogoContainer, LogoutContainer, TitleContainer, AuthButton, HeaderText } from './HeaderElements';
import sx from 'mui-sx';
import SideNav from '../SideNav/SideNav';

const Header = () => {
    //states
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const [open, setOpen] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    const matches = useMediaQuery((theme) => theme.breakpoints.up('md'));

    return (
        <>
            <AppBar
                className="font-BCBold"
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: '#f2f2f2',
                    height: '10vh',
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                {matches || !isLoggedIn ? (
                    <></>
                ) : (
                    <IconButton aria-label="delete">
                        <Button onClick={() => setOpen(!open)} variant="contained" fullWidth />
                    </IconButton>
                )}
                <LogoContainer>
                    <img
                        src={'https://marketplacebc.ca/wp-content/themes/sbbc-marketplace/images/bc-logo.svg'}
                        width="100%"
                        height="100%"
                        alt="bc_Pgov_logo"
                    />
                </LogoContainer>

                <TitleContainer>
                    <Toolbar disableGutters>
                        <HeaderText variant="h3" noWrap sx={{ mr: 2 }}>
                            MET
                        </HeaderText>
                    </Toolbar>
                </TitleContainer>
                <LogoutContainer>
                    {isLoggedIn ? (
                        <>
                            <AuthButton variant="contained" onClick={() => UserService.doLogout()}>
                                Logout
                            </AuthButton>
                            <SideNav desktopScreen={matches} open={open} />
                        </>
                    ) : (
                        <AuthButton variant="contained" onClick={() => UserService.doLogin()}>
                            Login
                        </AuthButton>
                    )}
                </LogoutContainer>
            </AppBar>

            <Toolbar />
        </>
    );
};
export default Header;
