import React, { useState, useEffect, useContext } from 'react';
import { useAppDispatch } from 'hooks';
import { BodyText } from './Typography/Body';
import { Palette } from 'styles/Theme';
import { Grid2 as Grid, MenuItem, Select } from '@mui/material';
import { useLocation } from 'react-router';
import { Language } from 'models/language';
import { LanguageContext } from './LanguageContext';

const LanguageSelector = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const { availableEngagementTranslations } = useContext(LanguageContext);
    const [languages, setLanguages] = useState<Language[]>([]);

    useEffect(() => {
        if (availableEngagementTranslations.length > 0) {
            // English is assumed to be the "default" language.
            const languagesPlusDefault = [
                {
                    id: 0,
                    name: 'English',
                    code: 'en',
                    right_to_left: false,
                },
                ...availableEngagementTranslations,
            ];
            setLanguages(languagesPlusDefault);
        } else {
            setLanguages([]);
        }
    }, [availableEngagementTranslations]);

    const handleChangeLanguage = (selectedLanguage: string) => {
        // TODO: Implement engagement language switching.
        // if (!selectedLanguage) {
        //     dispatch(loadingLanguage(false));
        //     return;
        // }
        // try {
        //     sessionStorage.setItem('languageId', selectedLanguage);
        //     dispatch(
        //         saveLanguage({
        //             id: selectedLanguage,
        //         }),
        //     );
        //     // Change the URL when the language is changed
        //     const pathSegments = location.pathname.split('/');
        //     const languageIndex = pathSegments.findIndex((seg) => seg.length === 2); // Find index of the 2-character language code
        //     if (languageIndex !== -1) {
        //         pathSegments[languageIndex] = selectedLanguage;
        //     } else {
        //         // Language code not found in path, insert it at the appropriate position
        //         pathSegments.splice(1, 0, selectedLanguage);
        //     }
        //     dispatch(loadingLanguage(false));
        //     navigate(pathSegments.join('/'));
        // } catch (error) {
        //     dispatch(loadingLanguage(false));
        //     console.error('Error occurred while fetching Language information');
        // }
    };

    useEffect(() => {
        // TODO: Add logic to update URL when engagement language changes.
        // Update language dropdown when the language ID in the URL changes
        // const pathSegments = location.pathname.split('/');
        // const languageIndex = pathSegments.findIndex((seg) => seg.length === 2); // Find index of the 2-character language code
        // if (languageIndex !== -1) {
        //     const languageId = pathSegments[languageIndex].toLowerCase();
        //     sessionStorage.setItem('languageId', languageId);
        //     dispatch(
        //         saveLanguage({
        //             id: languageId,
        //         }),
        //     );
        // }
    }, [dispatch, location.pathname]);

    return (
        <Grid container direction="row" alignItems="center">
            <Grid pr="8px">
                <BodyText bold>Select Language:</BodyText>
            </Grid>
            <Grid>
                <Select
                    id="language"
                    aria-label="select-language"
                    value={0}
                    size="small"
                    sx={{
                        bgcolor: 'background.paper',
                        color: Palette.info.main,
                    }}
                    onChange={(event) => handleChangeLanguage(event.target.value as string)}
                >
                    {languages.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
        </Grid>
    );
};

export default LanguageSelector;
