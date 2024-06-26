import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Button } from 'components/common/Input';
import UserService from 'services/userService';
import { useMediaQuery, Theme, IconButton } from '@mui/material';
import SideNav from '../SideNav/SideNav';
import CssBaseline from '@mui/material/CssBaseline';
import { Palette } from 'styles/Theme';
import EnvironmentBanner from './EnvironmentBanner';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoDark.svg';
import { When } from 'react-if';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/pro-regular-svg-icons/faBars';
import { HeaderProps } from './types';
import { useNavigate } from 'react-router-dom';
import { TenantState } from 'reduxSlices/tenantSlice';
import { useAppSelector } from '../../../hooks';
import { BodyText, Header1 } from 'components/common/Typography';

const InternalHeader = ({ drawerWidth = 280 }: HeaderProps) => {
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const [open, setOpen] = useState(false);
    const tenant: TenantState = useAppSelector((state) => state.tenant);
    const navigate = useNavigate();

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme: Theme) => (isMediumScreen ? theme.zIndex.drawer + 1 : theme.zIndex.drawer),
                    backgroundColor: Palette.internalHeader.backgroundColor,
                    color: Palette.internalHeader.color,
                }}
                data-testid="appbar-header"
            >
                <CssBaseline />
                <Toolbar>
                    <When condition={!isMediumScreen && drawerWidth}>
                        <IconButton
                            color="info"
                            sx={{
                                height: '2em',
                                width: '2em',
                                marginRight: { xs: '1em' },
                            }}
                            onClick={() => setOpen(!open)}
                        >
                            <FontAwesomeIcon icon={faBars} style={{ fontSize: '20px' }} />
                        </IconButton>
                    </When>
                    <Box
                        component={BCLogo}
                        sx={{
                            cursor: 'pointer',
                            height: '5em',
                            width: { xs: '7em', md: '15em' },
                            marginRight: { xs: '1em', md: '3em' },
                        }}
                        onClick={() => {
                            navigate('/home');
                        }}
                        alt="British Columbia Logo"
                    />
                    {isMediumScreen ? (
                        <Header1
                            onClick={() => {
                                navigate('/home');
                            }}
                            sx={{ flexGrow: 1, cursor: 'pointer', margin: 0 }}
                        >
                            {tenant.name}
                        </Header1>
                    ) : (
                        <Header1
                            onClick={() => {
                                navigate('/home');
                            }}
                            sx={{ flexGrow: 1, cursor: 'pointer', textTransform: 'capitalize', margin: 0 }}
                        >
                            {tenant.short_name}
                        </Header1>
                    )}
                    <Button data-testid="button-header" variant="tertiary" onClick={() => UserService.doLogout()}>
                        <BodyText bold size="large">
                            Logout
                        </BodyText>
                    </Button>
                </Toolbar>
                <EnvironmentBanner />
            </AppBar>
            <SideNav
                setOpen={setOpen}
                data-testid="sidenav-header"
                isMediumScreen={isMediumScreen}
                open={open}
                drawerWidth={drawerWidth}
            />
        </>
    );
};

export default InternalHeader;
