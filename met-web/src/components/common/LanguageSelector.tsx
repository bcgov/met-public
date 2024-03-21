import React, { useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks';
import { LanguageState, saveLanguage, loadingLanguage } from 'reduxSlices/languageSlice';
import { MetLabel } from 'components/common';
import { Palette } from 'styles/Theme';
import { Grid, MenuItem, Select } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Language, LANGUAGE_NAME } from 'constants/language';

interface LanguageDropDownItem {
    value: string;
    label: string;
}

const LanguageSelector = () => {
    const dispatch = useAppDispatch();
    const language: LanguageState = useAppSelector((state) => state.language);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChangeLanguage = (selectedLanguage: string) => {
        if (!selectedLanguage) {
            dispatch(loadingLanguage(false));
            return;
        }

        try {
            sessionStorage.setItem('languageId', selectedLanguage);
            dispatch(
                saveLanguage({
                    id: selectedLanguage,
                }),
            );

            // Change the URL when the language is changed
            const pathSegments = location.pathname.split('/');
            const languageIndex = pathSegments.findIndex((seg) => seg.length === 2); // Find index of the 2-character language code
            if (languageIndex !== -1) {
                pathSegments[languageIndex] = selectedLanguage;
            } else {
                // Language code not found in path, insert it at the appropriate position
                pathSegments.splice(1, 0, selectedLanguage);
            }
            dispatch(loadingLanguage(false));

            navigate(pathSegments.join('/'));
        } catch {
            dispatch(loadingLanguage(false));
            console.error('Error occurred while fetching Language information');
        }
    };

    const ITEMS: LanguageDropDownItem[] = useMemo(() => {
        return Object.values(Language).map((lang) => ({
            value: lang,
            label: LANGUAGE_NAME[lang],
        }));
    }, [LANGUAGE_NAME]);

    useEffect(() => {
        // Update language dropdown when the language ID in the URL changes
        const pathSegments = location.pathname.split('/');
        const languageIndex = pathSegments.findIndex((seg) => seg.length === 2); // Find index of the 2-character language code
        if (languageIndex !== -1) {
            const languageId = pathSegments[languageIndex].toLowerCase();
            sessionStorage.setItem('languageId', languageId);
            dispatch(
                saveLanguage({
                    id: languageId,
                }),
            );
        }
    }, [dispatch, location.pathname]);

    return (
        <Grid container direction="row" alignItems="center">
            <Grid item sx={{ paddingRight: '8px' }}>
                <MetLabel>Select Language:</MetLabel>
            </Grid>
            <Grid item>
                <Select
                    id="language"
                    aria-label="select-language"
                    value={language.id}
                    size="small"
                    sx={{
                        backgroundColor: 'var(--bcds-surface-background-white)',
                        color: Palette.info.main,
                        minWidth: '8ch',
                    }}
                    onChange={(event) => handleChangeLanguage(event.target.value as string)}
                >
                    {ITEMS.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
        </Grid>
    );
};

export default LanguageSelector;
