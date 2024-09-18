import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useOutletContext, useRouteLoaderData, useNavigate } from 'react-router-dom';
import { TextField } from 'components/common/Input';
import { AuthoringTemplateOutletContext } from './types';
import { colors } from 'styles/Theme';
import { EyebrowText as FormDescriptionText } from 'components/common/Typography';
import { MetHeader3, MetLabel as MetBigLabel } from 'components/common';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { Controller } from 'react-hook-form';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import dayjs from 'dayjs';
import { EngagementUpdateData } from './AuthoringContext';
import { Engagement } from 'models/engagement';

const AuthoringSummary = () => {
    const { setValue, control, reset, getValues, setDefaultValues, fetcher, slug }: AuthoringTemplateOutletContext =
        useOutletContext(); // Access the form functions and values from the authoring template.

    // Update the loader data when the authoring section is changed, by triggering navigation().
    const navigate = useNavigate();
    useEffect(() => {
        engagementData.then(() => navigate('.', { replace: true }));
    }, [slug]);

    // Get the engagement data
    const { engagement: engagementData } = useRouteLoaderData('single-engagement') as {
        engagement: Promise<Engagement>;
    };

    // Check if the form has succeeded or failed after a submit, and issue a message to the user.
    const dispatch = useAppDispatch();
    useEffect(() => {
        if ('success' === fetcher.data || 'failure' === fetcher.data) {
            const responseText =
                'success' === fetcher.data ? 'Engagement saved successfully.' : 'Unable to save engagement.';
            const responseSeverity = 'success' === fetcher.data ? 'success' : 'error';
            dispatch(
                openNotification({
                    severity: responseSeverity,
                    text: responseText,
                }),
            );
            fetcher.data = undefined;
        }
    }, [fetcher.data]);

    const untouchedDefaultValues: EngagementUpdateData = {
        id: 0,
        status_id: 0,
        taxon_id: 0,
        content_id: 0,
        name: '',
        start_date: dayjs(new Date(1970, 0, 1)),
        end_date: dayjs(new Date(1970, 0, 1)),
        description: '',
        rich_description: '',
        description_title: '',
        banner_filename: '',
        status_block: [],
        title: '',
        icon_name: '',
        metadata_value: '',
        send_report: undefined,
        slug: '',
        request_type: '',
        text_content: '',
        json_content: '{ blocks: [], entityMap: {} }',
        summary_editor_state: EditorState.createEmpty(),
    };

    // Reset values to default and retrieve relevant content from loader.
    useEffect(() => {
        reset(untouchedDefaultValues);
        engagementData.then((engagement) => {
            setValue('id', Number(engagement.id));
            // Make sure it is valid JSON.
            if (tryParse(engagement.rich_description)) {
                setValue('rich_description', engagement.rich_description);
            }
            setValue('description_title', engagement.description_title || 'Hello world');
            setValue('description', engagement.description);
            setValue(
                'summary_editor_state',
                EditorState.createWithContent(convertFromRaw(JSON.parse(engagement.rich_description))),
            );
            setDefaultValues(getValues()); // Update default values so that our loaded values are default.
        });
    }, [engagementData]);

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
        setValue('description_title', value);
        return value;
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
        } catch (e) {}
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
                                    toolbarStyle={toolbarStyles}
                                    editorStyle={editorStyles}
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
            </Grid>
        </Grid>
    );
};

export default AuthoringSummary;
