import React, { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    AppBar,
    Theme,
    ThemeProvider,
    Box,
    useMediaQuery,
    Select,
    MenuItem,
    SelectChangeEvent,
    Modal,
} from '@mui/material';
import { Palette, colors, DarkTheme, BaseTheme, ZIndex } from 'styles/Theme';
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
import { useFormContext } from 'react-hook-form';
import { EngagementUpdateData } from './AuthoringContext';
import { ResponsiveContainer } from 'components/common/Layout';
import { Await } from 'react-router-dom';
import ConfirmModal from 'components/common/Modals/ConfirmModal';
import { Language } from 'models/language';

const AuthoringBottomNav = ({ currentLanguage, setCurrentLanguage, languages, pageTitle }: AuthoringBottomNavProps) => {
    const {
        setValue,
        formState: { isDirty, isSubmitting },
    } = useFormContext<EngagementUpdateData>();
    const isMediumScreenOrLarger = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
    const [atFooter, setAtFooter] = useState(false);
    const navRef = useRef<HTMLDivElement | null>(null);
    const placeholderRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        const footer = document.querySelector('footer');
        const hostParent = footer?.parentElement ?? document.body;
        const placeholder = document.createElement('div');
        placeholder.id = 'authoring-bottom-nav-portal';
        placeholder.style.position = 'relative';
        placeholder.style.zIndex = `${ZIndex.sideNav}`; // keep above page content
        placeholder.style.width = '100%';
        placeholder.style.top = '2em'; // slight offset to avoid any potential overlap with footer content
        hostParent.insertBefore(placeholder, footer ?? null);
        placeholderRef.current = placeholder;
        setPortalEl(placeholder);

        let footerObserver: IntersectionObserver | null = null;
        if (footer) {
            footerObserver = new IntersectionObserver(
                (entries) => {
                    const intersecting = entries.some((entry) => entry.isIntersecting);
                    setAtFooter(intersecting);
                },
                { threshold: 0 },
            );
            footerObserver.observe(footer);
        }

        return () => {
            footerObserver?.disconnect();
            placeholder.remove();
            setPortalEl(null);
            placeholderRef.current = null;
        };
    }, []);

    useLayoutEffect(() => {
        if (!portalEl || !navRef.current) return;
        const updateHeight = () => {
            portalEl.style.height = `${navRef.current?.offsetHeight ?? 0}px`;
        };
        updateHeight();
        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(navRef.current);
        globalThis.addEventListener('resize', updateHeight, { passive: true });
        return () => {
            resizeObserver.disconnect();
            globalThis.removeEventListener('resize', updateHeight);
        };
    }, [portalEl]);

    const buttonStyles = {
        height: '2.6rem',
        borderRadius: '8px',
        border: 'none',
        padding: '0',
        margin: '0',
        minWidth: '8.125rem',
        fontSize: '0.9rem',
        width: { xs: '50%', sm: 'unset' },
    };

    if (!portalEl) return null;

    const fixedPosition = {
        position: 'fixed' as const,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
    };
    const absolutePosition = {
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
    };

    return createPortal(
        <AppBar
            component={'nav'}
            position="static"
            ref={navRef}
            sx={{
                backgroundColor: 'transparent',
                borderTopRightRadius: '16px',
                borderBottomLeftRadius: '0',
                borderBottomRightRadius: '0',
                minHeight: '5rem',
                backgroundClip: 'padding-box',
                overflow: 'hidden',
                top: 'auto',
                boxShadow: elevations.default,
                ...(atFooter ? absolutePosition : fixedPosition),
            }}
            data-testid="appbar-authoring-bottom-nav"
        >
            <Box
                sx={{
                    background: colors.surface.blue[90],
                    minHeight: '5rem',
                    justifyContent: 'flex-start',
                    // padding: padding,
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
                            pl: { xs: '1em', md: '3.1rem' },
                            pt: { xs: '2rem', md: '0' },
                        }}
                    >
                        <BodyText bold>Currently Authoring</BodyText>
                        <BodyText sx={{ fontSize: '0.7rem', alignItems: 'center', marginTop: '-5px', display: 'flex' }}>
                            <span>{pageTitle}</span>
                            <span style={{ fontSize: '0.4rem', paddingLeft: '0.4rem', paddingRight: '0.4rem' }}>
                                {'\u2B24'}
                            </span>
                            <Suspense>
                                <Await resolve={languages}>{currentLanguage.name}</Await>
                            </Suspense>
                        </BodyText>
                    </Box>
                    <ResponsiveContainer
                        sx={{
                            width: '100%',
                            maxWidth: { xs: 'calc(2em + 700px)', md: 'calc(3rem + 700px)', lg: 'calc(6.2rem + 700px)' },
                            justifyContent: 'flex-start',
                            display: 'flex',
                            // Overrides needed for multiple viewports.
                            pt: { xs: '0', md: '1em', lg: '1em', xl: '1em' },
                            pb: { xs: '2em', md: '1em', lg: '1em', xl: '1em' },
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: '1rem',
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
                        <Box
                            className="button-container"
                            sx={{ flexWrap: 'nowrap', display: 'flex', gap: '1rem', width: '100%' }}
                        >
                            <Button
                                disabled={!isDirty || isSubmitting}
                                type="submit"
                                form="authoring-form"
                                onClick={() => setValue('request_type', 'update')}
                                sx={{
                                    ...buttonStyles,
                                }}
                            >
                                Save Section
                            </Button>
                            <Button
                                disabled={!isDirty || isSubmitting}
                                type="submit"
                                form="authoring-form"
                                onClick={() => setValue('request_type', 'preview')}
                                sx={{
                                    ...buttonStyles,
                                    marginLeft: 'auto',
                                }}
                            >
                                <img
                                    style={{
                                        paddingRight: '0.3rem',
                                        filter: !isDirty || isSubmitting ? 'opacity(40%)' : 'opacity(100%)',
                                    }}
                                    src={pagePreview}
                                    alt=""
                                    aria-hidden="true"
                                />
                                Preview
                            </Button>
                        </Box>
                    </ResponsiveContainer>
                </ThemeProvider>
            </Box>
        </AppBar>,
        portalEl,
    );
};

const LanguageSelector = ({
    currentLanguage,
    setCurrentLanguage,
    languages,
    isDirty,
    isSubmitting,
}: LanguageSelectorProps) => {
    const [languageModalOpen, setLanguageModalOpen] = useState(false);
    const [newLanguage, setNewLanguage] = useState('');
    const [languageList, setLanguageList] = useState<Language[]>([]);

    useEffect(() => {
        languages.then((lngs) => {
            setLanguageList(lngs);
        });
    }, []);

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        if (!isSubmitting) {
            const newLang = event.target.value;
            setNewLanguage(newLang);
            if (isDirty) {
                setLanguageModalOpen(true);
            } else {
                setCurrentLanguage(newLang, getLanguageValue(newLang, languageList));
            }
        }
    };

    const languageModalConfirm = () => {
        setCurrentLanguage(newLanguage, getLanguageValue(newLanguage, languageList));
        setLanguageModalOpen(false);
    };

    return (
        <>
            {/* confirm that the user wants to switch languages */}
            <Modal open={languageModalOpen} aria-describedby="publish-modal-subtext">
                <ConfirmModal
                    style="warning"
                    header={`Are you sure you want to switch to ${currentLanguage.name || 'another language'}?`}
                    subHeader={`You have unsaved changes for the ${currentLanguage.name || 'current'} language.`}
                    subTextId="publish-modal-subtext"
                    subText={[
                        {
                            text: 'It is suggested that you save your current changes first.',
                            bold: false,
                        },
                    ]}
                    handleConfirm={languageModalConfirm}
                    handleClose={() => setLanguageModalOpen(false)}
                    confirmButtonText={'Change Language'}
                    cancelButtonText={'Cancel & Go Back'}
                />
            </Modal>

            <Suspense>
                <Await resolve={languages}>
                    {(languages) => (
                        <Select
                            value={currentLanguage.id}
                            onChange={handleSelectChange}
                            sx={{
                                height: '2.6rem',
                                borderRadius: '8px',
                                width: { xs: '100%', sm: 'unset' },
                                minWidth: '130px',
                                backgroundColor: colors.surface.gray[10],
                                border: 'none',
                                color: Palette.text.primary,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                '& .MuiSelect-icon': {
                                    color: Palette.text.primary,
                                },
                            }}
                            renderValue={() => {
                                const completed = false; // todo: Replace with real "completed" boolean value once it is available.
                                return (
                                    <span>
                                        <When condition={completed}>
                                            <FontAwesomeIcon style={{ marginRight: '0.3rem' }} icon={faCheck} />
                                        </When>
                                        {currentLanguage.name}
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
                    )}
                </Await>
            </Suspense>
        </>
    );
};

export default AuthoringBottomNav;
