import React, { Suspense, useEffect, useRef, useState } from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    useMediaQuery,
    Theme,
    ThemeProvider,
    ButtonBase,
    Grid,
    Avatar,
    MenuItem,
    Drawer,
    MenuList,
    Collapse,
    CssBaseline,
} from '@mui/material';
import { colors, DarkTheme, Palette } from 'styles/Theme';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoDark.svg';
import { useAppSelector } from '../../../hooks';
import { BodyText } from 'components/common/Typography';
import { Link } from 'components/common/Navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronDown, faClose, faSignOut } from '@fortawesome/pro-regular-svg-icons';
import UserService from 'services/userService';
import { Await, useAsyncValue, useRouteLoaderData } from 'react-router-dom';
import { Tenant } from 'models/tenant';
import { When, Unless } from 'react-if';
import { Button } from 'components/common/Input';
import DropdownMenu, { dropdownMenuStyles } from 'components/common/Navigation/DropdownMenu';
import { elevations } from 'components/common';
import TrapFocus from '@mui/base/TrapFocus';
import SideNav from '../SideNav/SideNav';
import { USER_ROLES } from 'services/userService/constants';

const InternalHeader = () => {
    const isMediumScreenOrLarger = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const isMobileScreen = !useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
    const [sideNavOpen, setSideNavOpen] = useState(false);
    const [secondaryMenuOpen, setSecondaryMenuOpen] = useState(false);
    const tenant = useAppSelector((state) => state.tenant);
    const user = useAppSelector((state) => state.user);
    const canNavigate = user.roles.length !== 0; // If user has no roles in this tenant, don't show the side nav
    const [tenantDrawerOpen, setTenantDrawerOpen] = useState(false);

    const handleTenantDrawerOpen = (isOpen: boolean) => {
        setTenantDrawerOpen(isOpen);
    };

    useEffect(() => {
        if (isMediumScreenOrLarger || sideNavOpen) {
            const timer = setTimeout(() => {
                setSecondaryMenuOpen(true);
            }, 200); // Delay to allow the sidenav to open first
            return () => clearTimeout(timer);
        } else {
            setSecondaryMenuOpen(false);
        }
    }, [isMediumScreenOrLarger, sideNavOpen]);

    const { myTenants } = useRouteLoaderData('authenticated-root') as { myTenants: Tenant[] };

    const sidePadding = { xs: '0 1em', md: '0 1.5em 0 2em', lg: '0 3em 0 2em' };

    return (
        // Keep focus within the app bar + sidenav when sidenav is open on mobile
        <TrapFocus open={sideNavOpen && isMobileScreen}>
            <Box
                sx={{
                    '& div.PrivateSwipeArea-root': {
                        zIndex: (theme: Theme) => theme.zIndex.drawer + 4,
                    },
                }}
            >
                <AppBar
                    position="fixed"
                    sx={{
                        zIndex: (theme: Theme) => theme.zIndex.drawer + 4, // render above sidenav
                        backgroundColor: 'transparent',
                        color: Palette.internalHeader.color,
                        borderBottomRightRadius: '16px',
                        backgroundClip: 'padding-box',
                        overflow: 'hidden',
                        left: 0,
                        boxShadow: tenantDrawerOpen ? 'none' : elevations.default,
                    }}
                    data-testid="appbar-header"
                >
                    <CssBaseline />
                    <Toolbar
                        sx={{
                            height: '4em',
                            padding: sidePadding,
                            backgroundColor: Palette.internalHeader.backgroundColor,
                        }}
                    >
                        <Link underline="none" href="https://gov.bc.ca" sx={{ height: '100%', mr: '2px' }}>
                            <Box
                                component={BCLogo}
                                sx={{
                                    height: '100%',
                                    width: 'auto',
                                    padding: '0 0',
                                    ml: '-13px',
                                }}
                                alt="British Columbia Logo"
                            />
                        </Link>
                        <Box
                            sx={{
                                borderLeft: `1px solid ${colors.surface.gray[80]}`,
                                height: '1.5em',
                                width: '1px',
                                marginRight: '1em',
                            }}
                        />
                        <BodyText thin sx={{ color: colors.surface.blue[80], userSelect: 'none' }}>
                            engage{/*no space*/}
                            <span style={{ color: colors.surface.blue[90], fontWeight: 'normal' }}>BC</span>
                        </BodyText>
                        <Unless condition={isMediumScreenOrLarger || !canNavigate}>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setSideNavOpen(!sideNavOpen);
                                }}
                                icon={
                                    <FontAwesomeIcon
                                        icon={sideNavOpen ? faClose : faBars}
                                        fontSize={20}
                                        style={{
                                            transform: `rotate(${sideNavOpen ? '180deg' : '0'})`,
                                            transition: 'transform 0.3s',
                                            position: isMobileScreen ? 'relative' : undefined,
                                            left: isMobileScreen ? '6px' : undefined,
                                        }}
                                    />
                                }
                                sx={{
                                    marginLeft: 'auto',
                                    minWidth: 'unset',
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Unless condition={isMobileScreen}>
                                    <BodyText>Menu</BodyText>
                                </Unless>
                            </Button>
                        </Unless>
                    </Toolbar>
                    <Collapse
                        in={secondaryMenuOpen}
                        timeout={{
                            appear: 0,
                            enter: 200,
                            exit: 200,
                        }}
                    >
                        <Box
                            sx={{
                                zIndex: (theme: Theme) => theme.zIndex.drawer + 3, // render above sidenav
                                background: colors.surface.blue[90],
                                height: '3.5em',
                                minHeight: 0,
                                justifyContent: 'space-between',
                                padding: sidePadding,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <ThemeProvider theme={DarkTheme}>
                                <Suspense
                                    fallback={
                                        <Link to="/home">
                                            <BodyText sx={{ userSelect: 'none' }}>{tenant.name}</BodyText>
                                        </Link>
                                    }
                                >
                                    <Await resolve={myTenants}>
                                        <TenantSelector
                                            isVisible={isMediumScreenOrLarger || sideNavOpen}
                                            onStateChange={handleTenantDrawerOpen}
                                        />
                                    </Await>
                                </Suspense>
                                <When condition={isMediumScreenOrLarger}>
                                    <UserMenu />
                                </When>
                            </ThemeProvider>
                        </Box>
                    </Collapse>
                </AppBar>
                <When condition={canNavigate}>
                    <SideNav
                        open={sideNavOpen}
                        setOpen={setSideNavOpen}
                        data-testid="sidenav-header"
                        isMediumScreen={isMediumScreenOrLarger}
                    />
                </When>
            </Box>
        </TrapFocus>
    );
};

const TenantSelector = ({
    isVisible,
    onStateChange,
}: {
    isVisible: boolean;
    onStateChange?: (isOpen: boolean) => void;
}) => {
    const shouldUseMobileView = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const currentTenant = useAppSelector((state) => state.tenant);
    const tenants = (useAsyncValue() as Tenant[]).filter((tenant) => tenant.short_name !== currentTenant.short_name);
    const noOtherTenants = tenants.length === 0;
    const tenantDropdownButton = useRef<HTMLButtonElement>(null);
    const [tenantDrawerOpen, setTenantDrawerOpen] = useState(false);

    useEffect(() => {
        if (!isVisible) setTenantDrawerOpen(false);
    }, [isVisible, setTenantDrawerOpen]);

    useEffect(() => {
        if (onStateChange) onStateChange(tenantDrawerOpen);
    }, [tenantDrawerOpen, onStateChange]);

    if (noOtherTenants) {
        return (
            <Link to="/home">
                <BodyText sx={{ userSelect: 'none' }}>{currentTenant.name}</BodyText>
            </Link>
        );
    }

    const tenantList = tenants.map((tenant) => (
        <MenuItem
            key={tenant.short_name}
            component={Link}
            href={`/${tenant.short_name}/home`}
            sx={{
                paddingLeft: 2,
                paddingRight: 2,
                fontSize: '16px',
                textTransform: 'capitalize',
            }}
        >
            {tenant.name}
        </MenuItem>
    ));

    if (shouldUseMobileView) {
        return (
            <>
                <ButtonBase
                    aria-haspopup
                    aria-controls={tenantDrawerOpen ? 'tenant-drawer' : undefined}
                    aria-expanded={tenantDrawerOpen}
                    aria-label={'Tenant Switcher'}
                    onClick={() => {
                        setTenantDrawerOpen(!tenantDrawerOpen);
                    }}
                    sx={{
                        height: 'calc( 100% - 2px )' /* 1px on either side to show border*/,
                        ...dropdownMenuStyles,
                    }}
                >
                    <TenantButtonContent isOpen={tenantDrawerOpen} />
                </ButtonBase>
                <Drawer
                    disableEnforceFocus
                    disablePortal
                    anchor="top"
                    open={tenantDrawerOpen}
                    onClose={() => {
                        setTenantDrawerOpen(false);
                    }}
                    sx={{
                        zIndex: (theme: Theme) => theme.zIndex.drawer + 3, // render under app bar but above side nav
                        '& .MuiDrawer-paper': {
                            padding: '1rem',
                            top: '6.5rem',
                            backgroundImage: 'none',
                            borderBottomRightRadius: '16px',
                        },
                    }}
                >
                    <nav>
                        <MenuList
                            autoFocusItem
                            aria-label="Tenant Switcher"
                            role="navigation"
                            sx={{
                                mt: 0,
                                '& .MuiMenuItem-root': {
                                    marginBottom: '1rem',
                                    '&:first-of-type': {
                                        marginTop: '-4px',
                                    },
                                    '&:last-of-type': {
                                        marginBottom: 0,
                                    },
                                },
                            }}
                        >
                            {tenantList}
                        </MenuList>
                    </nav>
                </Drawer>
            </>
        );
    }

    return (
        <DropdownMenu
            forNavigation
            name="Tenant Switcher"
            buttonContent={TenantButtonContent}
            buttonProps={{
                sx: {
                    marginLeft: '-16px' /*Visual alignment with nav bar*/,
                    height: 'calc( 100% - 2px )' /* 1px on either side to show border*/,
                },
            }}
            popperProps={{
                placement: 'bottom-start',
                sx: {
                    width: tenantDropdownButton.current?.offsetWidth,
                },
            }}
        >
            {tenantList}
        </DropdownMenu>
    );
};

const TenantButtonContent = ({ isOpen }: { isOpen: boolean }) => {
    const currentTenant = useAppSelector((state) => state.tenant);
    const noOtherTenants = !(useAsyncValue() as Tenant[]).some(
        (tenant) => tenant.short_name !== currentTenant.short_name,
    );
    return (
        <Grid container data-testid="tenant-switcher-button" direction="row" alignItems="center" spacing={1}>
            <Grid item sx={{ flex: '1 1 auto' }}>
                <BodyText
                    sx={{
                        userSelect: 'none',
                        textTransform: 'capitalize',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {currentTenant.name}
                </BodyText>
            </Grid>
            <Grid item hidden={noOtherTenants} sx={{ flex: '0 0 auto' }}>
                <FontAwesomeIcon color="white" rotation={isOpen ? 180 : undefined} icon={faChevronDown} />
            </Grid>
        </Grid>
    );
};

const UserMenu = () => {
    const userGreeting = useRef<HTMLDivElement>(null);

    return (
        <DropdownMenu
            name="Account Menu"
            buttonContent={UserButtonContent}
            buttonProps={{
                sx: {
                    marginLeft: 'auto' /* float to the right */,
                    height: 'calc( 100% - 2px )' /* 1px on either side to show border*/,
                },
            }}
            popperProps={{
                placement: 'bottom-end',
                sx: {
                    width: userGreeting.current && userGreeting.current.offsetWidth + 34 + 13,
                },
            }}
        >
            <MenuItem
                component={ButtonBase}
                onClick={() => {
                    UserService.doLogout();
                }}
                sx={{ width: '100%', paddingLeft: 2, paddingRight: 2 }}
            >
                <FontAwesomeIcon style={{ marginRight: '0.5rem' }} icon={faSignOut} />
                Logout
            </MenuItem>
        </DropdownMenu>
    );
};

const UserButtonContent = ({ isOpen }: { isOpen: boolean }) => {
    const currentUser = useAppSelector((state) => state.user.userDetail.user);
    return (
        <Grid container data-testid="user-menu-button" direction="row" alignItems="center" spacing={1}>
            <Grid item>
                <Avatar
                    sx={{
                        backgroundColor: colors.surface.blue[10],
                        height: 32,
                        width: 32,
                        fontSize: '16px',
                    }}
                >
                    {currentUser?.first_name[0]}
                    {currentUser?.last_name[0]}
                </Avatar>
            </Grid>
            <Grid item>
                <BodyText size="small" sx={{ userSelect: 'none' }}>
                    Hello {currentUser?.first_name}
                </BodyText>
                <BodyText sx={{ fontSize: '10px', lineHeight: 1 }}>
                    {currentUser?.roles.includes(USER_ROLES.SUPER_ADMIN)
                        ? 'Super Admin'
                        : currentUser?.main_role ?? 'User'}
                </BodyText>
            </Grid>
            <Grid item>
                <FontAwesomeIcon color="white" rotation={isOpen ? 180 : undefined} icon={faChevronDown} />
            </Grid>
        </Grid>
    );
};

export default InternalHeader;
