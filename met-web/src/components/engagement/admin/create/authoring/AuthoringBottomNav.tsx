import React, { Suspense, useState } from 'react';
import { Await, useAsyncValue, useLocation } from 'react-router-dom';
import { AppBar, Theme, ThemeProvider, Box, useMediaQuery, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Palette, colors, DarkTheme, BaseTheme } from 'styles/Theme';
import { When, Unless } from 'react-if';
import { BodyText } from 'components/common/Typography';
import { elevations } from 'components/common';
import { Button } from 'components/common/Input';
import { Link } from 'components/common/Navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/pro-regular-svg-icons';
import { useAppSelector } from 'hooks';
import { getAuthoringRoutes } from './AuthoringNavElements';
import { getTenantLanguages } from 'services/languageService';
import { Language } from 'models/language';
import { StatusCircle } from '../../view/AuthoringTab';
import pagePreview from 'assets/images/pagePreview.png';

interface AuthoringBottomNavProps {
    isDirty: boolean;
    isValid: boolean;
    isSubmitting: boolean;
}

const AuthoringBottomNav = (props: AuthoringBottomNavProps) => {
    const { isDirty, isValid, isSubmitting } = props;
    const isMediumScreenOrLarger = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const padding = { xs: '1rem 1rem', md: '1rem 1.5rem 1rem 2rem', lg: '1rem 3rem 1rem 2rem' };

    const tenant = useAppSelector((state) => state.tenant);
    const locationArray = useLocation().pathname.split('/');
    const pageSlug = locationArray[locationArray.length - 1];
    const engagementId = locationArray[2];

    const languages = getTenantLanguages(tenant.id); // todo: Using tenant language list until language data is integrated with the engagement.
    const [currentLanguage, setCurrentLanguage] = useState(useAppSelector((state) => state.language.id));

    const getPageValue = () => {
        const authoringRoutes = getAuthoringRoutes(Number(engagementId), tenant);
        return authoringRoutes.find((route) => route.path.includes(pageSlug))?.name;
    };

    const getLanguageValue = (currentLanguage: string, allLanguages: Language[]) => {
        return allLanguages.find((language) => language.code === currentLanguage)?.name;
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const newLanguageCode = event.target.value;
        setCurrentLanguage(newLanguageCode);
    };

    const Selector = () => {
        const languages = useAsyncValue() as Language[];
        return (
            <Select
                MenuProps={{ sx: { zIndex: 2000 } }}
                sx={{
                    height: '2.6rem',
                    borderRadius: '8px',
                    width: '9.375rem',
                    backgroundColor: colors.surface.gray[10],
                    border: 'none',
                    color: Palette.text.primary,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    '& .MuiSelect-icon': {
                        color: Palette.text.primary,
                    },
                }}
                renderValue={(value) => {
                    const completed = false; // todo: Replace with real "completed" boolean value once it is available.
                    return (
                        <span>
                            <When condition={completed}>
                                <FontAwesomeIcon style={{ marginRight: '0.3rem' }} icon={faCheck} />
                            </When>
                            {languages.find((language) => language.code === value)?.name}
                            <Unless condition={completed}>
                                <StatusCircle required={true} />
                            </Unless>
                        </span>
                    );
                }}
                value={currentLanguage}
                onChange={handleSelectChange}
            >
                {languages.map((language, index) => {
                    const completed = false; // todo: Replace with the real "completed" boolean values once they are available.
                    return (
                        <MenuItem value={language.code} key={index}>
                            <When condition={completed}>
                                <FontAwesomeIcon style={{ marginRight: '0.3rem' }} icon={faCheck} />
                            </When>
                            {language.name}
                            <Unless condition={completed}>
                                <StatusCircle required={true} />
                            </Unless>
                        </MenuItem>
                    );
                })}
            </Select>
        );
    };

    const buttonStyles = {
        height: '2.6rem',
        borderRadius: '8px',
        border: 'none',
        padding: '0 1rem',
        minWidth: '8.125rem',
        fontSize: '0.9rem',
    };

    return (
        <AppBar
            component={'nav'}
            position="fixed"
            sx={{
                backgroundColor: 'transparent',
                borderTopRightRadius: '16px',
                minHeight: '5rem',
                backgroundClip: 'padding-box',
                overflow: 'hidden',
                top: 'auto',
                left: 0,
                bottom: 0,
                boxShadow: elevations.default,
            }}
            data-testid="appbar-authoring-bottom-nav"
        >
            <Box
                sx={{
                    background: colors.surface.blue[90],
                    minHeight: '5rem',
                    justifyContent: 'flex-start',
                    padding: padding,
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: isMediumScreenOrLarger ? 'nowrap' : 'wrap',
                }}
            >
                <ThemeProvider theme={DarkTheme}>
                    <Box
                        sx={{
                            width: '18.75rem',
                            minWidth: '18.75rem',
                            marginBottom: isMediumScreenOrLarger ? '0' : '1rem',
                        }}
                    >
                        <BodyText sx={{ fontWeight: 'bold' }}>Currently Authoring</BodyText>
                        <BodyText sx={{ fontSize: '0.7rem', alignItems: 'center', marginTop: '-5px', display: 'flex' }}>
                            <span>{getPageValue()}</span>
                            <span style={{ fontSize: '0.4rem', paddingLeft: '0.4rem', paddingRight: '0.4rem' }}>
                                {'\u2B24'}
                            </span>
                            <Suspense>
                                <Await resolve={languages}>
                                    {(languages: Language[]) => (
                                        <span>{getLanguageValue(currentLanguage, languages)}</span>
                                    )}
                                </Await>
                            </Suspense>
                        </BodyText>
                    </Box>
                    <Box
                        sx={{
                            width: '43.75rem',
                            justifyContent: 'flex-start',
                            display: 'flex',
                        }}
                    >
                        <ThemeProvider theme={BaseTheme}>
                            <Suspense>
                                <Await resolve={languages}>
                                    <Selector />
                                </Await>
                            </Suspense>
                        </ThemeProvider>

                        <Button
                            disabled={!isValid || !isDirty || isSubmitting}
                            type="submit"
                            name="request_type"
                            value="update"
                            sx={{
                                ...buttonStyles,
                                margin: '0 1.2rem',
                            }}
                        >
                            <Link sx={{ color: colors.surface.gray[60] }} href="#">
                                Save Section
                            </Link>
                        </Button>
                        <Button
                            type="submit"
                            name="request_type"
                            value="preview"
                            sx={{
                                ...buttonStyles,
                                marginLeft: 'auto',
                            }}
                        >
                            <img style={{ paddingRight: '0.3rem' }} src={pagePreview} alt="page preview icon" />
                            Preview
                        </Button>
                    </Box>
                    <Box style={{ width: '25rem', display: 'flex' }}></Box>
                </ThemeProvider>
            </Box>
        </AppBar>
    );
};

export default AuthoringBottomNav;
