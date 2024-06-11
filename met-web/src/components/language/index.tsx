import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getLanguages, getTenantLanguages, postTenantLanguage, deleteTenantLanguage } from 'services/languageService';
import { Language } from 'models/language';
import { Header1, BodyText } from 'components/common/Typography/';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

const LanguageAdminPanel = () => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tenantId, setTenantId] = useState(sessionStorage.getItem('tenantId'));
    const dispatch = useAppDispatch();
    const isSmallScreen = useMediaQuery('(min-width:700px)');

    const fetchAndSortLanguages = async () => {
        setIsLoading(true);
        const fetchedLanguages = await getLanguages();
        fetchedLanguages.sort((a, b) => a.name.localeCompare(b.name));
        setLanguages(fetchedLanguages);
        setIsLoading(false);
    };

    const fetchTenantLanguages = async () => {
        if (tenantId) {
            const fetchedTenantLanguages = await getTenantLanguages(tenantId);
            setSelectedLanguages(fetchedTenantLanguages);
        } else {
        }
    };

    const handleLanguagesChange = async (event: any, newTenantLanguages: Language[]) => {
        setIsLoading(true);

        if (tenantId) {
            if (newTenantLanguages.length > selectedLanguages.length) {
                const addedLanguage = newTenantLanguages.filter((language) => !selectedLanguages.includes(language))[0];
                const savedTenantLanguage = await postTenantLanguage(tenantId, addedLanguage.id);
                if (savedTenantLanguage) {
                    dispatch(
                        openNotification({
                            severity: 'success',
                            text: 'Added language to tenant.',
                        }),
                    );
                }
            } else if (newTenantLanguages.length < selectedLanguages.length) {
                const removedLanguage = selectedLanguages.filter(
                    (language) => !newTenantLanguages.includes(language),
                )[0];
                const response = await deleteTenantLanguage(tenantId, removedLanguage.id);
                if (response.status === 'success') {
                    dispatch(
                        openNotification({
                            severity: 'success',
                            text: 'Deleted language from tenant.',
                        }),
                    );
                }
            }
        }
        setSelectedLanguages(newTenantLanguages);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAndSortLanguages();
        fetchTenantLanguages();
    }, []);

    return (
        <main style={{ margin: '5%' }}>
            <Header1>Languages</Header1>
            <BodyText>Select which languages are available for translations.</BodyText>
            {languages.length > 0 && (
                <Autocomplete
                    style={{ marginTop: '5%', marginBottom: '5%', width: isSmallScreen ? '50%' : '100%' }}
                    multiple
                    // Prevent users from clearing all languages with a button click.
                    clearIcon={<span style={{ display: 'none' }}></span>}
                    options={languages}
                    getOptionLabel={(option) => option.name}
                    loading={isLoading}
                    value={selectedLanguages}
                    onChange={(event, value) => handleLanguagesChange(event, value)}
                    renderInput={(params) => <TextField {...params} variant="standard" label="Language" />}
                />
            )}
        </main>
    );
};

export default LanguageAdminPanel;
