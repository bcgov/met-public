import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useAppSelector } from '../../../hooks';
import { IconButton, Button, useMediaQuery } from '@mui/material';
import UserService from '../../../services/userService';
import { LogoContainer, LogoutContainer, TitleContainer, AuthButton, HeaderText } from './HeaderElements';
import SideNav from '../SideNav/SideNav';

const Header = () => {
    //states
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isMediumScreen: boolean = useMediaQuery((theme: any) => theme.breakpoints.up('md'));
    const [open, setOpen] = useState(false);

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
                {isMediumScreen || !isLoggedIn ? (
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
                        </>
                    ) : (
                        <AuthButton variant="contained" onClick={() => UserService.doLogin()}>
                            Login
                        </AuthButton>
                    )}
                </LogoutContainer>
            </AppBar>

            <SideNav isMediumScreen={isMediumScreen} open={open} />
        </>
    );
};
export default Header;
