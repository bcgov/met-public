import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useOutletContext, useLoaderData } from 'react-router-dom';
import { TextField } from 'components/common/Input';
import { AuthoringTemplateOutletContext } from './types';
import { colors } from 'styles/Theme';
import { EyebrowText as FormDescriptionText } from 'components/common/Typography';
import { MetHeader3, MetLabel as MetBigLabel } from 'components/common';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { convertToRaw, EditorState } from 'draft-js';
import { Controller } from 'react-hook-form';
import { defaultValuesObject } from './AuthoringContext';
import { EngagementLoaderData } from 'components/engagement/public/view';
import WidgetPicker from '../widgets';
import { WidgetLocation } from 'models/widget';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';

const AuthoringSummary = () => {
    const { setValue, control, reset, getValues, setDefaultValues }: AuthoringTemplateOutletContext =
        useOutletContext(); // Access the form functions and values from the authoring template.

    // Must be a loader assigned to this route or data won't be refreshed on page change.
    const { engagement } = useLoaderData() as EngagementLoaderData;

    // Reset values to default and retrieve relevant content from loader.
    useEffect(() => {
        reset(defaultValuesObject);
        engagement.then((eng) => {
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
        });
    }, [engagement]);

    // Define the styles
    const metBigLabelStyles = {
        fontSize: '1.05rem',
        marginBottom: '0.7rem',
        lineHeight: 1.167,
        color: '#292929',
        fontWeight: '700',
    };
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
        <Grid container sx={{ maxWidth: '700px', mt: '1rem' }} direction="column">
            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.blue[10] }} item>
                <label htmlFor="description_title">
                    <MetBigLabel style={metBigLabelStyles}>
                        Section Heading
                        <span style={{ fontWeight: 'normal' }}> (Required)</span>
                    </MetBigLabel>
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
                                />
                            );
                        }}
                    />
                </label>
            </Grid>

            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.blue[10] }} item>
                <label htmlFor="summary_editor_state">
                    <MetBigLabel style={metBigLabelStyles} role="document" tab-index="0">
                        Body Copy
                        <span style={{ fontWeight: 'normal' }}> (Required)</span>
                    </MetBigLabel>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        Body copy for the summary section of your engagement should provide a short overview of what
                        your engagement is about and describe what you are asking your audience to do.
                    </FormDescriptionText>
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
                                    handlePastedText={() => false}
                                    toolbar={toolbar}
                                />
                            );
                        }}
                    />
                </label>
            </Grid>

            <Grid sx={{ mt: '1rem' }} item>
                <MetHeader3 style={metHeader3Styles}>Supporting Content (Optional)</MetHeader3>
                <FormDescriptionText style={formDescriptionTextStyles}>
                    You may use a widget to add supporting content to your primary content.
                </FormDescriptionText>
                <Grid container sx={{ maxWidth: '700px', mt: '1rem' }} direction="column">
                    <WidgetPicker location={WidgetLocation.Summary} />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AuthoringSummary;
