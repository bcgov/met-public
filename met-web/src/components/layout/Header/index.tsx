import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useAppSelector } from '../../../hooks';
import UserService from '../../../services/userService';
import { LogoContainer, LogoutContainer, TitleContainer, sxLight, AuthButton, HeaderText } from './HeaderElements';
import sx from 'mui-sx';

const Header = () => {
    //states
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);

    return (
        <AppBar
            className="font-BCBold"
            position="static"
            style={{
                backgroundColor: '#f2f2f2',
                height: '10vh',
                display: 'flex',
                flexDirection: 'row',
            }}
            sx={sx({
                condition: isLoggedIn,
                sx: sxLight,
            })}
        >
            <LogoContainer>
                <img
                    src={'https://marketplacebc.ca/wp-content/themes/sbbc-marketplace/images/bc-logo.svg'}
                    width="100%"
                    height="100%"
                    alt="bc_gov_logo"
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
                    <AuthButton variant="contained" onClick={() => UserService.doLogout()}>
                        Logout
                    </AuthButton>
                ) : (
                    <AuthButton variant="contained" onClick={() => UserService.doLogin()}>
                        Login
                    </AuthButton>
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

            {isLoggedIn ? (
                <>
                    <SideNav isMediumScreen={isMediumScreen} open={open} />
                </>
            ) : (
                <></>
            )}
        </>
    );
};
export default Header;
