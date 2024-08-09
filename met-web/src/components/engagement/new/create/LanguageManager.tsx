import React, { useEffect } from 'react';
import { Box, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material';
import { textInputStyles } from 'components/common/Input/TextInput';
import { useAsyncValue } from 'react-router-dom';
import { BodyText } from 'components/common/Typography';
import { When } from 'react-if';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/pro-regular-svg-icons';
import { colors } from 'styles/Theme';
import { useFormContext } from 'react-hook-form';
import { Language } from 'models/language';
import MultiSelect from './MultiSelect';
import { SystemMessage } from 'components/common/Layout/SystemMessage';

export const LanguageManager = () => {
    const engagementForm = useFormContext();
    const { setValue, watch } = engagementForm;
    const selectedLanguages = watch('languages') as Language[];
    const [isSingleLanguage, setIsSingleLanguage] = React.useState<boolean | null>(null);
    const requiredLanguages = isSingleLanguage !== false ? ['en'] : ['en', 'fr'];
    const availableLanguages = useAsyncValue() as Language[];
    const requiredLanguagesAvailable = requiredLanguages.filter((l) =>
        availableLanguages.map((l) => l.code).includes(l),
    );

    const [searchTerm, setSearchTerm] = React.useState('');

    useEffect(() => {
        // Don't do anything if language multiplicity has not been indicated
        if (isSingleLanguage === null) return;

        // If it's english only, remove any other languages
        if (isSingleLanguage) {
            setValue('languages', [{ code: 'en', name: 'English' }]);
            return;
        }
        // If the required languages are not included, add them
        if (requiredLanguagesAvailable.length) {
            const languagesToAdd = availableLanguages.filter(
                (l) =>
                    requiredLanguagesAvailable.includes(l.code) &&
                    !watch('languages')
                        .map((l: Language) => l.code)
                        .includes(l.code),
            );
            setValue('languages', [...watch('languages'), ...languagesToAdd]);
        }
    }, [watch, isSingleLanguage]);

    return (
        <Box width="100%">
            <RadioGroup
                onChange={(e) => setIsSingleLanguage(e.target.value === 'true')}
                aria-label="Select Engagement's Language Type"
                name="languageType"
                value={isSingleLanguage}
            >
                <FormControlLabel value={true} control={<Radio />} label="English Only" />
                <FormControlLabel value={false} control={<Radio />} label="Multi-language" />
            </RadioGroup>
            <When condition={isSingleLanguage === false}>
                <SystemMessage status="warning">
                    Under construction - this setting currently has no effect
                </SystemMessage>
                <MultiSelect
                    containerProps={{ sx: { mt: 2 } }}
                    onChange={(_, language, reason) => {
                        if (reason === 'removeOption' && language) {
                            setValue(
                                'languages',
                                selectedLanguages.filter((l) => l.code !== language.code),
                            );
                        }
                        if (reason === 'selectOption' && language) {
                            setValue('languages', [...selectedLanguages, language]);
                        }
                    }}
                    options={availableLanguages ?? []}
                    getOptionLabel={(option: Language) => `${option.name}`}
                    sx={{ maxWidth: '320px' }}
                    renderOption={(props, option, state) => {
                        return (
                            <li {...props}>
                                <Grid container direction="row" spacing={2} alignItems={'center'}>
                                    <Grid item>
                                        <BodyText>{`${option.name}`}</BodyText>
                                    </Grid>
                                    {props['aria-disabled'] && (
                                        <Grid item alignSelf="flex-end" marginLeft="auto">
                                            <FontAwesomeIcon icon={faCheck} color={colors.notification.success.shade} />
                                        </Grid>
                                    )}
                                </Grid>
                            </li>
                        );
                    }}
                    renderSelectedOption={(props, option, state) => {
                        return (
                            <Grid container direction="row" spacing={1} alignItems="center">
                                <Grid item>
                                    <BodyText bold={requiredLanguagesAvailable.includes(option.code)}>
                                        {`${option.name}`}
                                        {requiredLanguagesAvailable.includes(option.code) && ' (Default)'}
                                    </BodyText>
                                </Grid>
                            </Grid>
                        );
                    }}
                    renderInput={(params) => {
                        return (
                            <TextField
                                value={searchTerm}
                                onBlur={() => setSearchTerm('')}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    placeholder: 'Select Language',
                                    sx: textInputStyles,
                                }}
                                inputProps={{
                                    ...params.inputProps,
                                    sx: {
                                        fontSize: '16px',
                                        lineHeight: '24px',
                                        color: colors.type.regular.primary,
                                        '&::placeholder': {
                                            color: colors.type.regular.secondary,
                                        },
                                        '&:disabled': {
                                            cursor: 'not-allowed',
                                        },
                                    },
                                }}
                            />
                        );
                    }}
                    buttonLabel="Add Language"
                    loading={false}
                    selectedOptions={selectedLanguages}
                    selectLabel="Add Languages"
                    selectedLabel={{ singular: 'Language Added', plural: 'Languages Added' }}
                    searchPlaceholder="Select Language"
                    getOptionDisabled={(option) => selectedLanguages.filter((l) => l.code === option.code).length > 0}
                    getOptionRequired={(option) => requiredLanguagesAvailable.includes(option.code)}
                />
            </When>
        </Box>
    );
};
