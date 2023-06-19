import { Box, Divider, Grid, Link, Stack } from '@mui/material';
import { MetBody, MetLabel, SocialIconButton } from 'components/common';
import React from 'react';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoDark.svg';
import { Palette } from 'styles/Theme';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import UserService from 'services/userService';
import { useAppSelector } from 'hooks';
import { Unless } from 'react-if';
import { NavLink } from 'react-router-dom';
import { FOOTER_COLORS } from './constants';

export const Footer = () => {
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    return (
        <Grid container justifyContent="center" alignItems="center" spacing={0} mt="2em">
            <Grid
                item
                xs={12}
                sx={{
                    backgroundColor: FOOTER_COLORS.BACKGROUND,
                    borderTop: `6px solid ${FOOTER_COLORS.BORDER}`,
                    borderBottom: `6px solid ${FOOTER_COLORS.BORDER}`,
                }}
                padding={{ xs: '2em 1em', md: '2em 6em' }}
            >
                <MetBody color="white">
                    The B.C. Public Service acknowledges the territories of First Nations around B.C. and is grateful to
                    carry out our work on these lands. We acknowledge the rights, interests, priorities, and concerns of
                    all Indigenous Peoples - First Nations, Métis and Inuit - respecting and acknowledging their
                    distinct cultures, histories, rights, laws, and governments.
                </MetBody>
            </Grid>
            <Grid
                item
                xs={12}
                padding={{ xs: '2em 1em', md: '2em 6em' }}
                container
                justifyContent={'flex-start'}
                alignItems="flex-start"
                rowSpacing={3}
            >
                <Grid
                    item
                    xs={12}
                    md={6}
                    container
                    justifyContent={'flex-start'}
                    alignItems="flex-start"
                    rowSpacing={3}
                >
                    <Grid item xs={12}>
                        <Box
                            component={BCLogo}
                            sx={{
                                height: '5em',
                                width: '15em',
                            }}
                            alt="British Columbia Logo"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MetBody>CONNECT WITH US</MetBody>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={6}
                    container
                    justifyContent={'flex-start'}
                    alignItems="flex-start"
                    rowSpacing={3}
                >
                    <Grid item xs={12}>
                        <MetLabel>MORE INFO</MetLabel>
                    </Grid>
                    <Grid item xs={6}>
                        <Link to="/" color={Palette.text.primary} component={NavLink}>
                            Home
                        </Link>
                    </Grid>
                    <Grid item xs={6}>
                        <Link
                            href="https://www2.gov.bc.ca/gov/content/home/accessible-government"
                            color={Palette.text.primary}
                        >
                            Accessibility
                        </Link>
                    </Grid>
                    <Grid item xs={6}>
                        <Link href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca" color={Palette.text.primary}>
                            About gov.bc.ca
                        </Link>
                    </Grid>
                    <Grid item xs={6}>
                        <Link href="http://www2.gov.bc.ca/gov/content/home/copyright" color={Palette.text.primary}>
                            Copyright
                        </Link>
                    </Grid>
                    <Grid item xs={6}>
                        <Link href="https://www2.gov.bc.ca/gov/content/home/disclaimer" color={Palette.text.primary}>
                            Disclaimer
                        </Link>
                    </Grid>
                    <Unless condition={isLoggedIn}>
                        <Grid item xs={6}>
                            <Link
                                href="/"
                                color={Palette.text.primary}
                                onClick={(event) => {
                                    event.preventDefault();
                                    UserService.doLogin();
                                }}
                            >
                                Admin Login
                            </Link>
                        </Grid>
                    </Unless>
                    <Grid item xs={6}>
                        <Link href="http://www2.gov.bc.ca/gov/content/home/privacy" color={Palette.text.primary}>
                            Privacy
                        </Link>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ borderColor: Palette.text.primary }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={2}>
                        <SocialIconButton>
                            <FacebookIcon htmlColor={Palette.text.primary} />
                        </SocialIconButton>
                        <SocialIconButton>
                            <InstagramIcon htmlColor={Palette.text.primary} />
                        </SocialIconButton>
                        <SocialIconButton>
                            <TwitterIcon htmlColor={Palette.text.primary} />
                        </SocialIconButton>
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={6} container justifyContent={'flex-end'} alignItems="flex-end">
                    <MetBody>© 2023 Government of British Columbia</MetBody>
                </Grid>
            </Grid>
        </Grid>
    );
};
