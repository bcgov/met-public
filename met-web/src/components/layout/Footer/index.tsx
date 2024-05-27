import { Box, Divider, Grid, Stack } from '@mui/material';
import { MetBodyOld, MetLabel } from 'components/common';
import React from 'react';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoDark.svg';
import { Palette } from 'styles/Theme';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons/faXTwitter';
import UserService from 'services/userService';
import { useAppSelector } from 'hooks';
import { Unless } from 'react-if';
import { FOOTER_COLORS } from './constants';
import { useAppTranslation } from 'hooks';
import { getBaseUrl } from 'helper';
import { IconButton, Link } from 'components/common/Input';

const Footer = () => {
    const baseURL = getBaseUrl();
    const LanguageId = sessionStorage.getItem('languageId');
    const { t: translate } = useAppTranslation();
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
                <MetBodyOld color="white">{translate('footer.body')}</MetBodyOld>
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
                            alt={translate('footer.defaultLogo')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MetBodyOld>{translate('footer.connectWithUs')}</MetBodyOld>
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
                        <MetLabel>{translate('footer.moreInfo')}</MetLabel>
                    </Grid>
                    <Grid item xs={6}>
                        <Link to={isLoggedIn ? `/home` : `/${LanguageId}`} color={Palette.text.primary}>
                            {translate('footer.home')}
                        </Link>
                    </Grid>
                    <Grid item xs={6}>
                        <Link
                            href="https://www2.gov.bc.ca/gov/content/home/accessible-government"
                            color={Palette.text.primary}
                        >
                            {translate('footer.accessibility')}
                        </Link>
                    </Grid>
                    <Grid item xs={6}>
                        <Link href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca" color={Palette.text.primary}>
                            {translate('footer.aboutGov')}
                        </Link>
                    </Grid>
                    <Grid item xs={6}>
                        <Link href="https://www2.gov.bc.ca/gov/content/home/copyright" color={Palette.text.primary}>
                            {translate('footer.copyright')}
                        </Link>
                    </Grid>
                    <Grid item xs={6}>
                        <Link href="https://www2.gov.bc.ca/gov/content/home/disclaimer" color={Palette.text.primary}>
                            {translate('footer.disclaimer')}
                        </Link>
                    </Grid>
                    <Unless condition={isLoggedIn}>
                        <Grid item xs={6}>
                            <Link
                                href="/"
                                color={Palette.text.primary}
                                onClick={(event) => {
                                    event.preventDefault();
                                    UserService.doLogin(baseURL);
                                }}
                            >
                                {translate('footer.login')}
                            </Link>
                        </Grid>
                    </Unless>
                    <Grid item xs={6}>
                        <Link href="https://www2.gov.bc.ca/gov/content/home/privacy" color={Palette.text.primary}>
                            {translate('footer.privacy')}
                        </Link>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ borderColor: Palette.text.primary }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={2}>
                        <IconButton
                            icon={faFacebookF}
                            sx={{
                                border: '1px solid #494949',
                                borderRadius: '50%',
                            }}
                        />
                        <IconButton
                            icon={faInstagram}
                            sx={{
                                border: '1px solid #494949',
                                borderRadius: '50%',
                            }}
                        />
                        <IconButton
                            icon={faXTwitter}
                            sx={{
                                border: '1px solid #494949',
                                borderRadius: '50%',
                            }}
                        />
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={6} container justifyContent={'flex-end'} alignItems="flex-end">
                    <MetBodyOld>{translate('footer.copyrightNotice')}</MetBodyOld>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Footer;
