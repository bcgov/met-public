import { Grid } from '@mui/material';
import React, { useEffect, Suspense } from 'react';
import { useOutletContext, useRouteLoaderData, Await } from 'react-router-dom';
import { TextField } from 'components/common/Input';
import { AuthoringTemplateOutletContext } from './types';
import { colors } from 'styles/Theme';
import { EyebrowText as FormDescriptionText } from 'components/common/Typography';
import { MetHeader3, MetLabel as MetBigLabel } from 'components/common';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { convertToRaw, EditorState } from 'draft-js';
import { Controller } from 'react-hook-form';
import { EngagementContent } from 'models/engagementContent';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

const AuthoringSummary = () => {
    const {
        setValue,
        control,
        reset,
        getValues,
        engagement,
        defaultValues,
        setDefaultValues,
        fetcher,
    }: AuthoringTemplateOutletContext = useOutletContext(); // Access the form functions and values from the authoring template.

    // Check if the form has succeeded or failed after a submit, and issue a message to the user.
    const dispatch = useAppDispatch();
    useEffect(() => {
        if ('success' === fetcher.data) {
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Engagement saved successfully.',
                }),
            );
        } else if ('failure' === fetcher.data) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Unable to save engagement.',
                }),
            );
        }
        fetcher.data = undefined;
    }, [fetcher.data]);

    const { content } = useRouteLoaderData('authoring-loader') as {
        content: Promise<EngagementContent[]>;
    };

    useEffect(() => {
        // Reset values to default and retrieve relevant content from loader.
        reset(defaultValues);
        setValue('id', Number(engagement.id));
        content.then((content) => {
            setValue('content_id', Number(content[0].id));
            setValue('title', content[0].title);
            setValue('text_content', content[0].text_content);
            if (tryParse(content[0].json_content)) {
                // Make sure it's valid JSON.
                setValue('json_content', content[0].json_content);
            }
            setDefaultValues(getValues()); // Update default values so that our loaded values are default.
        });
    }, [content]);

    //Define the styles
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
    const toolbarStyles = {
        border: '1px solid #7A7876',
        borderBottom: 'none',
        borderRadius: '8px 8px 0 0',
        marginBottom: '0',
        maxWidth: '100%',
    };
    const editorStyles = {
        height: '15em',
        padding: '0 1em 1em',
        backgroundColor: colors.surface.white,
        border: '1px solid #7A7876',
        borderTop: 'none',
        borderRadius: '0 0 8px 8px',
        maxWidth: '100%',
    };

    const toolbar = {
        options: ['inline', 'list', 'link', 'blockType', 'history'],
        inline: {
            options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
        },
        blockType: { options: ['Normal', 'H2', 'H3', 'Blockquote'] },
        list: { options: ['unordered', 'ordered'] },
    };

    const handleTitleChange = (value: string) => {
        setValue('title', value);
        return value;
    };

    const handleEditorChange = (newEditorState: EditorState) => {
        const plainText = newEditorState.getCurrentContent().getPlainText();
        const stringifiedEditorState = JSON.stringify(convertToRaw(newEditorState.getCurrentContent()));
        setValue('text_content', plainText);
        setValue('json_content', stringifiedEditorState);
        return newEditorState;
    };

    // Determines whether a string is JSON parseable.
    const tryParse = (json: string) => {
        try {
            const object = JSON.parse(json);
            if (object && typeof object === 'object') {
                return object;
            }
        } catch (e) {}
        return false;
    };

    return (
        <Grid container sx={{ maxWidth: '700px', mt: '1rem' }} direction="column">
            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.blue[10] }} item>
                <label htmlFor="title">
                    <MetBigLabel style={metBigLabelStyles}>
                        Section Heading
                        <span style={{ fontWeight: 'normal' }}> (Required)</span>
                    </MetBigLabel>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        Your section heading should be descriptive, short and succinct.
                    </FormDescriptionText>
                    <Controller
                        control={control}
                        name="title"
                        rules={{ required: true }}
                        render={({ field }) => {
                            return (
                                <TextField
                                    {...field}
                                    sx={{ backgroundColor: colors.surface.white }}
                                    id="title"
                                    value={field.value}
                                    error={undefined}
                                    counter
                                    maxLength={60}
                                    placeholder="Section heading text"
                                    onChange={(value) => {
                                        field.onChange(handleTitleChange(value));
                                    }}
                                />
                            );
                        }}
                    />
                </label>
            </Grid>

            <Grid sx={{ ...formItemContainerStyles, backgroundColor: colors.surface.blue[10] }} item>
                <label htmlFor="editor_state">
                    <MetBigLabel style={metBigLabelStyles} role="document" tab-index="0">
                        Body Copy
                        <span style={{ fontWeight: 'normal' }}> (Required)</span>
                    </MetBigLabel>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        Your section heading should be descriptive, short and succinct.
                    </FormDescriptionText>
                    <Suspense>
                        <Await resolve={content}>
                            {(content) => (
                                <Controller
                                    control={control}
                                    name="editor_state"
                                    rules={{ required: true }}
                                    render={({ field }) => {
                                        return (
                                            <RichTextArea
                                                ariaLabel="Body Copy: Your section heading should be descriptive, short and succinct."
                                                spellCheck
                                                initialContentState={
                                                    tryParse(content[0].json_content)
                                                        ? JSON.parse(content[0].json_content)
                                                        : ''
                                                }
                                                onEditorStateChange={(value) => {
                                                    field.onChange(handleEditorChange(value));
                                                }}
                                                handlePastedText={() => false}
                                                toolbarStyle={toolbarStyles}
                                                editorStyle={editorStyles}
                                                toolbar={toolbar}
                                            />
                                        );
                                    }}
                                />
                            )}
                        </Await>
                    </Suspense>
                </label>
            </Grid>

            <Grid sx={{ mt: '1rem' }} item>
                <MetHeader3 style={metHeader3Styles}>Supporting Content (Optional)</MetHeader3>
                <FormDescriptionText style={formDescriptionTextStyles}>
                    You may use a widget to add supporting content to your primary content.
                </FormDescriptionText>
            </Grid>
        </Grid>
    );
};

export default AuthoringSummary;
