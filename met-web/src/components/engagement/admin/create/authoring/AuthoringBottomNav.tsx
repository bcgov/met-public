import React from 'react';
import { AppBar, Theme, ThemeProvider, Box, useMediaQuery, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Palette, colors, DarkTheme, BaseTheme } from 'styles/Theme';
import { When, Unless } from 'react-if';
import { BodyText } from 'components/common/Typography';
import { elevations } from 'components/common';
import { Button } from 'components/common/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/pro-regular-svg-icons';
import { StatusCircle } from '../../view/AuthoringTab';
import pagePreview from 'assets/images/pagePreview.png';
import { AuthoringBottomNavProps, LanguageSelectorProps } from './types';
import { getLanguageValue } from './AuthoringTemplate';

const AuthoringBottomNav = ({
    isDirty,
    isValid,
    isSubmitting,
    currentLanguage,
    setCurrentLanguage,
    languages,
    pageTitle,
}: AuthoringBottomNavProps) => {
    const isMediumScreenOrLarger = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const padding = { xs: '1rem 1rem', md: '1rem 1.5rem 1rem 2rem', lg: '1rem 3rem 1rem 2rem' };

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
                            width: '18.8rem',
                            minWidth: '18.8rem',
                            marginBottom: isMediumScreenOrLarger ? '0' : '1rem',
                        }}
                    >
                        <BodyText bold>Currently Authoring</BodyText>
                        <BodyText sx={{ fontSize: '0.7rem', alignItems: 'center', marginTop: '-5px', display: 'flex' }}>
                            <span>{pageTitle}</span>
                            <span style={{ fontSize: '0.4rem', paddingLeft: '0.4rem', paddingRight: '0.4rem' }}>
                                {'\u2B24'}
                            </span>
                            {getLanguageValue(currentLanguage, languages)}
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
                            <LanguageSelector
                                currentLanguage={currentLanguage}
                                setCurrentLanguage={setCurrentLanguage}
                                languages={languages}
                                isDirty={isDirty}
                                isSubmitting={isSubmitting}
                            />
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
                            Save Section
                        </Button>
                        <Button
                            disabled={!isValid || !isDirty || isSubmitting}
                            type="submit"
                            name="request_type"
                            value="preview"
                            sx={{
                                ...buttonStyles,
                                marginLeft: 'auto',
                            }}
                        >
                            <img
                                style={{
                                    paddingRight: '0.3rem',
                                    filter: !isValid || !isDirty || isSubmitting ? 'opacity(40%)' : 'opacity(100%)',
                                }}
                                src={pagePreview}
                                alt=""
                                aria-hidden="true"
                            />
                            Preview
                        </Button>
                    </Box>
                    <Box style={{ width: '25rem', display: 'flex' }}></Box>
                </ThemeProvider>
            </Box>
        </AppBar>
    );
};

const LanguageSelector = ({
    currentLanguage,
    setCurrentLanguage,
    languages,
    isDirty,
    isSubmitting,
}: LanguageSelectorProps) => {
    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const newLanguageCode = event.target.value;
        if (isDirty && !isSubmitting)
            // todo: Replace this message with our stylized modal message.
            window.confirm(
                `Are you sure you want to switch to ${
                    getLanguageValue(newLanguageCode, languages) || 'another language'
                }? You have unsaved changes for the ${
                    getLanguageValue(currentLanguage, languages) || 'current'
                } language.`,
            );
        setCurrentLanguage(newLanguageCode);
    };
    return (
        <Select
            value={currentLanguage}
            onChange={handleSelectChange}
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
        >
            {languages.map((language) => {
                const completed = false; // todo: Replace with the real "completed" boolean values once they are available.
                return (
                    <MenuItem value={language.code} key={language.code}>
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

export default AuthoringBottomNav;
