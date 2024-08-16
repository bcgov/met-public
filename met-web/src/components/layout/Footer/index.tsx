import { Divider, Grid, Stack, useMediaQuery, Theme } from '@mui/material';
import { MetLabel } from 'components/common';
import React from 'react';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoDarkCropped.svg';
import { Palette } from 'styles/Theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faUniversalAccess } from '@fortawesome/pro-solid-svg-icons';
import UserService from 'services/userService';
import { useAppSelector } from 'hooks';
import { Unless } from 'react-if';
import { useAppTranslation } from 'hooks';
import { getBaseUrl } from 'helper';
import { Link } from 'components/common/Navigation';
import { SocialLinkIconProps } from './types';

const LinkArrow = () => {
    return <span style={{ fontWeight: 'bold', marginLeft: '0.8rem' }}>&gt;</span>;
};

const SocialLinkIcon = ({ iconLink, fontAwesomeIcon }: SocialLinkIconProps) => {
    return (
        <Link
            href={iconLink}
            sx={{
                display: 'flex',
                alignItems: 'center',
                height: '2.5rem',
                width: '2.5rem',
                borderRadius: '50%',
                backgroundColor: Palette.text.primary,
                justifyContent: 'center',
                color: Palette.text.primary,
                textDecoration: 'none',
            }}
        >
            <FontAwesomeIcon
                style={{
                    fontSize: '1.5rem',
                    color: 'white',
                    width: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                icon={fontAwesomeIcon}
            />
        </Link>
    );
};

const Footer = () => {
    const baseURL = getBaseUrl();
    const { t: translate } = useAppTranslation();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isMediumScreenOrLarger: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const linkStyles = {
        color: Palette.text.primary,
        textDecoration: 'none',
        '&:hover': { color: Palette.primary.light },
    };

    return (
        <Grid container component="footer" spacing={0} mt="2em" aria-label="footer">
            {/* Footer acknowledgement container */}
            <Grid
                item
                xs={12}
                sx={{
                    backgroundColor: Palette.acknowledgement.background,
                    borderTop: `0.375rem solid ${Palette.acknowledgement.border}`,
                    borderBottom: `0.375rem solid ${Palette.acknowledgement.border}`,
                }}
                padding={{ xs: '2em 1em', md: '2em 2em', lg: '2em 3em' }}
            >
                <p style={{ color: Palette.background.default }}>{translate('footer.body')}</p>
            </Grid>

            {/* Footer main container */}
            <Grid item xs={12} padding={{ xs: '2em 1em', md: '2em 2em', lg: '2em 3em' }} container rowSpacing={4}>
                <Grid
                    item
                    columns={10}
                    xs={10}
                    md={6}
                    container
                    sx={{
                        pr: isMediumScreenOrLarger ? '4rem' : '2rem',
                        height: isMediumScreenOrLarger ? '15.625rem' : 'auto',
                    }}
                >
                    {/* Footer BC Gov Logo */}
                    <Stack spacing={3} height="100%">
                        <BCLogo
                            style={{
                                alignSelf: 'flex-start',
                                paddingBottom: '1rem',
                                maxWidth: isMediumScreenOrLarger ? '25rem' : '9.375rem',
                            }}
                            alt={translate('footer.defaultLogo')}
                        />

                        {/* Footer accessibility paragraph and link */}
                        <p style={{ margin: '0' }}>{translate('footer.statement')}</p>
                        <Stack
                            direction="row"
                            alignSelf="flex-end"
                            style={{ height: isMediumScreenOrLarger ? '100%' : 'auto', width: '100%' }}
                        >
                            <Link
                                href="https://www2.gov.bc.ca/gov/content/home/accessible-government"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    alignSelf: 'flex-end',
                                    ...linkStyles,
                                }}
                            >
                                <FontAwesomeIcon
                                    style={{
                                        fontSize: '2.5rem',
                                        color: Palette.text.primary,
                                        paddingRight: '0.75rem',
                                        width: '2.5rem',
                                    }}
                                    icon={faUniversalAccess}
                                />

                                {translate('footer.accessibility')}
                                <LinkArrow />
                            </Link>
                        </Stack>
                    </Stack>
                </Grid>

                {/* Footer more info */}
                <Grid
                    item
                    columns={10}
                    xs={10}
                    md={2}
                    container
                    sx={{
                        height: isMediumScreenOrLarger ? '15.625rem' : 'auto',
                        pr: isMediumScreenOrLarger ? '1rem' : '0',
                    }}
                >
                    <Stack spacing={3}>
                        <MetLabel>{translate('footer.moreInfo')}</MetLabel>
                        <Link href="#" sx={linkStyles}>
                            {translate('footer.aboutEngageBC')}
                            <LinkArrow />
                        </Link>
                        <Link href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca" sx={linkStyles}>
                            {translate('footer.aboutGov')}
                            <LinkArrow />
                        </Link>
                    </Stack>
                </Grid>

                {/* Footer connect with us */}
                <Grid
                    item
                    columns={10}
                    xs={10}
                    md={2}
                    container
                    sx={{ height: isMediumScreenOrLarger ? '15.625rem' : 'auto' }}
                >
                    <Stack spacing={3}>
                        <MetLabel>{translate('footer.connectWithUs')}</MetLabel>
                        <Link href="#" sx={linkStyles}>
                            {translate('footer.contactInformation')}
                            <LinkArrow />
                        </Link>
                        <Link href="#" sx={linkStyles}>
                            {translate('footer.serviceCentres')}
                            <LinkArrow />
                        </Link>
                        <Grid container sx={{ flexBasis: { xs: 'auto', md: '100%' } }}>
                            <Stack direction="row" spacing={2} alignSelf={'flex-end'}>
                                <SocialLinkIcon iconLink="#" fontAwesomeIcon={faXTwitter} />
                                <SocialLinkIcon iconLink="#" fontAwesomeIcon={faInstagram} />
                                <SocialLinkIcon iconLink="#" fontAwesomeIcon={faFacebookF} />
                            </Stack>
                        </Grid>
                    </Stack>
                </Grid>

                {/* Footer divider */}
                <Grid item xs={12}>
                    <Divider sx={{ borderColor: Palette.text.primary }} />
                </Grid>

                {/* Footer copyright date and admin login */}
                <Grid item xs={12} sm={6} container justifyContent={'flex-start'} alignItems="flex-start">
                    <p style={{ margin: '0' }}>{translate('footer.copyrightNotice')}</p>
                    <Unless condition={isLoggedIn}>
                        <Grid item xs={12} sx={{ pt: '1rem' }}>
                            <Link
                                href="/"
                                onClick={(event) => {
                                    event.preventDefault();
                                    UserService.doLogin(baseURL);
                                }}
                                sx={linkStyles}
                            >
                                {translate('footer.login')}
                                <LinkArrow />
                            </Link>
                        </Grid>
                    </Unless>
                </Grid>

                {/* Footer copyright, privacy, and disclaimer links */}
                <Grid item xs={12} sm={6} container justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
                    <Stack direction="row" spacing={4}>
                        <Link href="https://www2.gov.bc.ca/gov/content/home/copyright" sx={linkStyles}>
                            {translate('footer.copyright')}
                        </Link>
                        <Link href="https://www2.gov.bc.ca/gov/content/home/privacy" sx={linkStyles}>
                            {translate('footer.privacy')}
                        </Link>
                        <Link href="https://www2.gov.bc.ca/gov/content/home/disclaimer" sx={linkStyles}>
                            {translate('footer.disclaimer')}
                        </Link>
                    </Stack>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Footer;
