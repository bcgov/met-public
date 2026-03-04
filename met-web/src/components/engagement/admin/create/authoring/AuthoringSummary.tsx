import { Grid2 as Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useOutletContext, useLoaderData } from 'react-router';
import { TextField } from 'components/common/Input';
import { AuthoringTemplateOutletContext } from './types';
import { colors } from 'styles/Theme';
import { ErrorMessage, EyebrowText as FormDescriptionText } from 'components/common/Typography';
import { BodyText, Header3 } from 'components/common/Typography';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { convertToRaw, EditorState } from 'draft-js';
import { Controller, useFormContext } from 'react-hook-form';
import { defaultValuesObject, EngagementUpdateData } from './AuthoringContext';
import { EngagementLoaderAdminData } from 'components/engagement/admin/EngagementLoaderAdmin';
import WidgetPicker from '../widgets';
import { WidgetLocation } from 'models/widget';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import UnsavedWorkConfirmation from 'components/common/Navigation/UnsavedWorkConfirmation';

const AuthoringSummary = () => {
    const { setDefaultValues, fetcher, pageName }: AuthoringTemplateOutletContext = useOutletContext(); // Access the form functions and values from the authoring template.
    const {
        setValue,
        getValues,
        reset,
        control,
        formState: { errors, isDirty, isSubmitting },
    } = useFormContext<EngagementUpdateData>();

    // Must be a loader assigned to this route or data won't be refreshed on page change.
    const { engagement } = useLoaderData() as EngagementLoaderAdminData;
    const hasUnsavedWork = isDirty && !isSubmitting;

    // Set current values to default state after saving form
    useEffect(() => {
        const newDefaults = getValues();
        setDefaultValues(newDefaults);
        reset(newDefaults);
    }, [fetcher.data]);

    // Reset values to default and retrieve relevant content from loader.
    useEffect(() => {
        engagement.then((eng) => {
            reset(defaultValuesObject);
            setValue('form_source', pageName);
            setValue('id', Number(eng.id));
            // Make sure it is valid JSON.
            if (tryParse(eng.rich_description)) {
                setValue('rich_description', eng.rich_description);
            }
            setValue('description_title', eng.description_title || '');
            setValue('description', eng.description);
            setValue('summary_editor_state', getEditorStateFromRaw(eng.rich_description || ''));
            // Update default values so that our loaded values are default.
            setDefaultValues(getValues());
            reset(getValues());
        });
    }, []);

    const metHeader3Styles = {
        fontSize: '1.05rem',
        marginBottom: '0.7rem',
    };
    const formDescriptionTextStyles = {
        fontSize: '0.9rem',
        marginBottom: '1.5rem',
    };
    const formItemContainerStyles = {
        padding: '2rem 1.4rem !important',
        margin: '1rem 0',
        borderRadius: '16px',
    };

    const toolbar = {
        options: ['inline', 'list', 'link', 'blockType', 'history'],
        inline: {
            options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
        },
        blockType: { options: ['Normal', 'H2', 'H3', 'Blockquote'] },
        list: { options: ['unordered', 'ordered'] },
    };

    const handleEditorChange = (newEditorState: EditorState) => {
        const plainText = newEditorState.getCurrentContent().getPlainText();
        const stringifiedEditorState = JSON.stringify(convertToRaw(newEditorState.getCurrentContent()));
        setValue('description', plainText);
        setValue('rich_description', stringifiedEditorState);
        return newEditorState;
    };

    // Determines whether a string is JSON parseable and returns the JSON if it is.
    const tryParse = (json: string) => {
        try {
            const object = JSON.parse(json);
            if (object && typeof object === 'object') {
                return object;
            }
        } catch {}
        return false;
    };

    return (
        <>
            {/* prevent navigating away when the user has unsaved work */}
            <UnsavedWorkConfirmation blockNavigationWhen={hasUnsavedWork} />

            <Grid container sx={{ maxWidth: '700px', mt: '1rem' }} direction="column">
                <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.blue[10] }}>
                    <label htmlFor="description_title">
                        <BodyText bold mb="0.5rem">
                            Section Heading
                            <span style={{ fontWeight: 'normal' }}> (Required)</span>
                        </BodyText>
                        <FormDescriptionText style={formDescriptionTextStyles}>
                            Your section heading should be descriptive, short and succinct.
                        </FormDescriptionText>
                        <Controller
                            control={control}
                            name="description_title"
                            rules={{ required: true }}
                            render={({ field }) => {
                                return (
                                    <TextField
                                        {...field}
                                        sx={{ backgroundColor: colors.surface.white }}
                                        id="description_title"
                                        counter
                                        maxLength={60}
                                        placeholder="Section heading text"
                                        error={errors.description_title?.message ?? ''}
                                    />
                                );
                            }}
                        />
                    </label>
                </Grid>

                <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.blue[10] }}>
                    <label htmlFor="summary_editor_state">
                        <BodyText bold mb="0.5rem" role="document" tab-index="0">
                            Body Copy
                            <span style={{ fontWeight: 'normal' }}> (Required)</span>
                        </BodyText>
                        <FormDescriptionText style={formDescriptionTextStyles}>
                            Body copy for the summary section of your engagement should provide a short overview of what
                            your engagement is about and describe what you are asking your audience to do.
                        </FormDescriptionText>
                        <ErrorMessage error={errors.summary_editor_state?.message ?? ''} />
                        <Controller
                            control={control}
                            name="summary_editor_state"
                            rules={{ required: true }}
                            render={({ field }) => {
                                return (
                                    <RichTextArea
                                        ariaLabel="Body Copy: Body copy for the summary section of your engagement should provide a short overview of what your engagement is about and describe what you are asking your audience to do."
                                        spellCheck
                                        editorState={field.value}
                                        onEditorStateChange={(value) => {
                                            field.onChange(handleEditorChange(value));
                                        }}
                                        placeholder="Body copy"
                                        handlePastedText={() => false}
                                        toolbar={toolbar}
                                    />
                                );
                            }}
                        />
                    </label>
                </Grid>

                <Grid sx={{ mt: '1rem' }}>
                    <Header3 style={metHeader3Styles}>Supporting Content (Optional)</Header3>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        You may use a widget to add supporting content to your primary content.
                    </FormDescriptionText>
                    <Grid container sx={{ maxWidth: '700px', mt: '1rem' }} direction="column">
                        <WidgetPicker location={WidgetLocation.Summary} />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default AuthoringSummary;
