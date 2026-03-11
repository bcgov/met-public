import { Grid2 as Grid } from '@mui/material';
import { colors } from 'components/common';
import { TextField } from 'components/common/Input';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import UnsavedWorkConfirmation from 'components/common/Navigation/UnsavedWorkConfirmation';
import { BodyText, ErrorMessage, Header3 } from 'components/common/Typography';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { ContentState, EditorState } from 'draft-js';
import React, { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useOutletContext } from 'react-router';
import { defaultValuesObject, EngagementUpdateData } from './AuthoringContext';
import { AuthoringFormContainer, AuthoringFormSection } from './AuthoringFormLayout';
import { AuthoringTemplateOutletContext } from './types';

type SubscribeAuthoringData = EngagementUpdateData & {
    subscribe_section_header: string;
    subscribe_section_description: EditorState;
    subscribe_consent_message: EditorState;
};

const AuthoringSubscribe = () => {
    const { setDefaultValues, fetcher, pageName, engagement: eng }: AuthoringTemplateOutletContext = useOutletContext();
    const {
        setValue,
        getValues,
        reset,
        control,
        formState: { errors, isDirty, isSubmitting },
    } = useFormContext<SubscribeAuthoringData>();

    const hasUnsavedWork = isDirty && !isSubmitting;

    useEffect(() => {
        const newDefaults = getValues();
        setDefaultValues(newDefaults);
        reset(newDefaults);
    }, [fetcher.data]);

    useEffect(() => {
        reset(defaultValuesObject);
        setValue('form_source', pageName);
        setValue('id', Number(eng.id));
        setValue('subscribe_section_header', eng.subscribe_section_header || '');
        setValue('subscribe_section_description', getEditorState(eng.subscribe_section_description));
        setValue('subscribe_consent_message', getEditorState(eng.subscribe_consent_message || eng.consent_message));
        setDefaultValues(getValues());
        reset(getValues());
    }, [eng, pageName]);

    const tryParse = (json: string) => {
        try {
            const object = JSON.parse(json);
            if (object && typeof object === 'object') {
                return object;
            }
        } catch {}
        return false;
    };

    const getEditorState = (value?: string) => {
        if (!value) {
            return EditorState.createEmpty();
        }

        if (tryParse(value)) {
            return getEditorStateFromRaw(value);
        }

        return EditorState.createWithContent(ContentState.createFromText(value));
    };

    const metHeader3Styles = {
        fontSize: '1.05rem',
        marginBottom: '0.7rem',
    };
    const authoringFormContainerStyles = {
        gap: 0,
        '& .met-input-form-field-title': { fontSize: '0.875rem' },
        '& .met-input-text': { background: 'white' },
    };
    const toolbar = {
        options: ['inline', 'list', 'link', 'blockType', 'history'],
        inline: {
            options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
        },
        blockType: { options: ['Normal', 'H2', 'H3', 'Blockquote'] },
        list: { options: ['unordered', 'ordered'] },
    };

    return (
        <>
            <UnsavedWorkConfirmation blockNavigationWhen={hasUnsavedWork} />

            <AuthoringFormContainer sx={authoringFormContainerStyles}>
                <Grid sx={{ mt: '1rem' }}>
                    <Header3 style={metHeader3Styles}>Primary Content (Required)</Header3>
                </Grid>

                <AuthoringFormSection name="Section Heading" required={true} labelFor={'subscribe_section_header'}>
                    <BodyText fontSize="0.875rem">
                        Your section heading should be descriptive, short and succinct.
                    </BodyText>
                    <Controller
                        control={control}
                        name="subscribe_section_header"
                        rules={{ required: true, maxLength: 60 }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                sx={{ backgroundColor: colors.surface.white }}
                                id="subscribe_section_header"
                                aria-label="Section heading. Your section heading should be descriptive, short and succinct."
                                counter
                                maxLength={60}
                                placeholder="Section heading text"
                                error={errors.subscribe_section_header?.message ?? ''}
                                onChange={(value) => {
                                    field.onChange(value);
                                }}
                            />
                        )}
                    />
                </AuthoringFormSection>

                <AuthoringFormSection
                    name="Body Copy"
                    required={true}
                    labelFor={'subscribe_section_description'}
                    details="Tell your users some more about why they want to subscribe, or about the update process"
                >
                    <ErrorMessage error={errors.subscribe_section_description?.message?.toString() || ''} />
                    <Controller
                        control={control}
                        name="subscribe_section_description"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <RichTextArea
                                ariaLabel="Body Copy: Tell your users some more about why they want to subscribe, or about the update process"
                                spellCheck
                                editorStyle={{ cursor: 'text' }}
                                editorState={field.value}
                                onEditorStateChange={(value) => {
                                    field.onChange(value);
                                }}
                                handlePastedText={() => false}
                                toolbar={toolbar}
                            />
                        )}
                    />
                </AuthoringFormSection>

                <AuthoringFormSection
                    name="Privacy Notice"
                    required={true}
                    labelFor={'subscribe_consent_message'}
                    details={
                        'A Privacy Notice must be displayed and agreed to by potential ' +
                        'subscribers before they subscribe. Updates to the following notice ' +
                        'should only be made if you have been provided with legally approved revisions.'
                    }
                >
                    <ErrorMessage error={errors.subscribe_consent_message?.message?.toString() || ''} />
                    <Controller
                        control={control}
                        name="subscribe_consent_message"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <RichTextArea
                                ariaLabel="Privacy Notice: A Privacy Notice must be displayed and agreed to by potential subscribers before they subscribe."
                                spellCheck
                                editorStyle={{ cursor: 'text' }}
                                editorState={field.value}
                                onEditorStateChange={(value) => {
                                    field.onChange(value);
                                }}
                                handlePastedText={() => false}
                                toolbar={toolbar}
                            />
                        )}
                    />
                </AuthoringFormSection>
            </AuthoringFormContainer>
        </>
    );
};

export default AuthoringSubscribe;
