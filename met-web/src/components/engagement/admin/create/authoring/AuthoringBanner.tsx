import React, { useState, useEffect } from 'react';
import { FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Select } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import { TextField } from 'components/common/Input';
import { AuthoringTemplateOutletContext } from './types';
import { colors } from 'styles/Theme';
import { BodyText } from 'components/common/Typography';
import ImageUpload from 'components/imageUpload';
import { AuthoringFormContainer, AuthoringFormSection } from './AuthoringFormLayout';
import { Header3 } from 'components/common/Typography/Headers';
import { EngagementViewSections } from 'components/engagement/public/view';
import { Controller, useFormContext } from 'react-hook-form';
import { SUBMISSION_STATUS } from 'constants/engagementStatus';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { convertToRaw, EditorState } from 'draft-js';
import { defaultValuesObject, EngagementUpdateData } from './AuthoringContext';
import { ErrorMessage } from 'components/common/Typography/Body';

const ENGAGEMENT_UPLOADER_HEIGHT = '360px';
const ENGAGEMENT_CROPPER_ASPECT_RATIO = 1920 / 700;

const AuthoringBanner = () => {
    // Access the form functions and values from the authoring template
    const { engagement, setDefaultValues, pageName }: AuthoringTemplateOutletContext = useOutletContext();
    const {
        setValue,
        getValues,
        watch,
        reset,
        control,
        formState: { errors },
    } = useFormContext<EngagementUpdateData>();

    const open_section = engagement.status_block.find((block) => block.survey_status === SUBMISSION_STATUS.OPEN);
    const closed_section = engagement.status_block.find((block) => block.survey_status === SUBMISSION_STATUS.CLOSED);
    const upcoming_section = engagement.status_block.find(
        (block) => block.survey_status === SUBMISSION_STATUS.UPCOMING,
    );
    const view_results_section = engagement.status_block.find(
        (block) => block.survey_status === SUBMISSION_STATUS.VIEW_RESULTS,
    );

    const [upcomingEditorState, setUpcomingEditorState] = useState<EditorState>(
        getEditorStateFromRaw(upcoming_section?.block_text || ''),
    );
    const [closedEditorState, setClosedEditorState] = useState<EditorState>(
        getEditorStateFromRaw(closed_section?.block_text || ''),
    );

    const handleAddBannerImage = (files: File[]) => {
        if (files.length > 0) {
            setValue('image_file', files[0], { shouldDirty: true });
            return;
        }
        setValue('image_file', null, { shouldDirty: true });
        setValue('image_url', '');
    };

    useEffect(() => {
        reset(defaultValuesObject);
        setValue('form_source', pageName);
        setValue('id', Number(engagement.id));
        setValue('name', engagement.name);
        setValue('image_url', engagement.banner_url);
        setValue('eyebrow', engagement.sponsor_name);
        setValue('open_cta', open_section?.button_text);
        setValue('open_cta_link_type', open_section?.link_type || 'internal');
        setValue('open_section_link', open_section?.internal_link);
        setValue('open_external_link', open_section?.external_link);
        setValue('view_results_cta', view_results_section?.button_text);
        setValue('view_results_link_type', view_results_section?.link_type || 'internal');
        setValue('view_results_section_link', view_results_section?.internal_link);
        setValue('view_results_external_link', view_results_section?.external_link);
        setValue('closed_message', closed_section?.block_text);
        setValue('upcoming_message', upcoming_section?.block_text);
        setUpcomingEditorState(getEditorStateFromRaw(upcoming_section?.block_text || ''));
        setClosedEditorState(getEditorStateFromRaw(closed_section?.block_text || ''));
        setDefaultValues(getValues());
    }, [engagement]);

    const updateEditorState = (editorState: EditorState, field: 'upcoming_message' | 'closed_message') => {
        const stateSetters = {
            upcoming_message: setUpcomingEditorState,
            closed_message: setClosedEditorState,
        };
        stateSetters[field](editorState);
        setValue(field, JSON.stringify(convertToRaw(editorState.getCurrentContent())), { shouldDirty: true });
        // Set the plain text value for the editor state for length validation
        setValue(`_${field}_plain`, editorState.getCurrentContent().getPlainText());
    };

    return (
        <AuthoringFormContainer
            sx={{
                '& .met-input-form-field-title': { fontSize: '0.875rem' },
                '& .met-input-text': { background: 'white' },
                '& #image-upload-section .MuiGrid-container': { background: 'white' },
            }}
        >
            <AuthoringFormSection
                required
                name="Engagement Title"
                labelFor="name"
                details="This is the title that will display for your engagement and should be descriptive, short and succinct."
            >
                <Controller
                    name="name"
                    control={control}
                    defaultValue={engagement.name}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="name"
                            title="Title"
                            counter
                            maxLength={60}
                            placeholder="Engagement title"
                            error={errors.name?.message}
                        />
                    )}
                />
            </AuthoringFormSection>
            <AuthoringFormSection
                name="Eyebrow Text"
                labelFor="eyebrow"
                details={
                    'If your audience will need additional context to interpret the topic of your ' +
                    'engagement, or it is important for them to understand who, within BC Gov, is ' +
                    'requesting feedback, you may wish to add two to five words of eyebrow text.'
                }
            >
                <Controller
                    name="eyebrow"
                    control={control}
                    defaultValue={engagement.sponsor_name}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value || undefined}
                            id="eyebrow"
                            title="Eyebrow"
                            counter
                            maxLength={40}
                            placeholder="Eyebrow text"
                            error={errors.eyebrow?.message}
                        />
                    )}
                />
            </AuthoringFormSection>
            <AuthoringFormSection
                required
                name="Hero Image"
                labelFor="select-file-button"
                details={
                    'Please ensure you use high quality images that help to communicate the topic of your ' +
                    'engagement. You must ensure that any important subject matter is positioned on the right side.'
                }
            >
                <ErrorMessage error={errors.image_url?.message} />
                <ImageUpload
                    margin={4}
                    data-testid="engagement-form/image-upload"
                    handleAddFile={handleAddBannerImage}
                    savedImageUrl={engagement.banner_url}
                    savedImageName={engagement.banner_filename}
                    height={ENGAGEMENT_UPLOADER_HEIGHT}
                    cropAspectRatio={ENGAGEMENT_CROPPER_ASPECT_RATIO}
                />
            </AuthoringFormSection>

            <Grid item sx={{ mt: '1rem' }}>
                <Header3>Engagement State Content Variants</Header3>
                <BodyText size="small">
                    The content in this section of your engagement may be changed based on the state or status of your
                    engagement. Select the Section Preview or Page Preview button to see each of these states.
                </BodyText>
            </Grid>
            <AuthoringFormSection
                name="“Upcoming” State Message Text "
                details={
                    "While your engagement is open, the Primary CTA (button) in your engagement's hero banner should " +
                    'link to the most important action you want your engagement audience to take. Enter text for the ' +
                    'Primary CTA (button) below and then indicate where you would like it to link to.'
                }
            >
                <BodyText size="small" bold sx={{ mb: -2 }}>
                    Message Text
                </BodyText>
                <ErrorMessage error={errors._upcoming_message_plain?.message} />
                <RichTextArea
                    ariaLabel="Upcoming State Message Text"
                    toolbar={{
                        options: ['inline', 'link', 'history'],
                        inline: { options: ['bold', 'italic', 'underline', 'superscript', 'subscript'] },
                    }}
                    editorState={upcomingEditorState}
                    onEditorStateChange={(value) => updateEditorState(value, 'upcoming_message')}
                />
                <BodyText size="small" ml="auto" mt={-2}>
                    {upcomingEditorState.getCurrentContent().getPlainText().length}/150
                </BodyText>
            </AuthoringFormSection>
            <AuthoringFormSection
                required
                name="“Open” State Primary CTA"
                labelFor="cta_button_text"
                details={
                    "When your engagement is open the Primary CTA (button) in your engagement's hero banner should " +
                    'link to the most important action you want your engagement audience to take. Enter text for the ' +
                    'Primary CTA (button) below and then indicate where you would like it to link to.'
                }
            >
                <Controller
                    name="open_cta"
                    control={control}
                    defaultValue={open_section?.button_text}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="cta_button_text"
                            title="Primary CTA (Button) Text"
                            counter
                            maxLength={20}
                            placeholder="Call-to-action button text"
                            error={errors.open_cta?.message}
                        />
                    )}
                />
                <Controller
                    name="open_cta_link_type"
                    control={control}
                    defaultValue={open_section?.link_type}
                    render={({ field }) => (
                        <RadioGroup row id="cta_link_radio" {...field}>
                            <Grid item xs={6} direction="column" sx={{ paddingRight: '2rem' }}>
                                <FormControlLabel value="internal" control={<Radio />} label="In-Page Section Link" />
                                <br />
                                <Controller
                                    name="open_section_link"
                                    control={control}
                                    defaultValue={open_section?.internal_link}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            disabled={watch('open_cta_link_type') !== 'internal'}
                                            aria-label="Section Link"
                                            fullWidth
                                            sx={{ mt: 1, height: '3em', '& fieldset': { borderColor: '#7A7876' } }}
                                            id="section_link"
                                        >
                                            <MenuItem value={EngagementViewSections.PROVIDE_FEEDBACK}>
                                                Provide Feedback Section
                                            </MenuItem>
                                            <MenuItem value={EngagementViewSections.CONTENT_TABS}>
                                                Tabbed Content
                                            </MenuItem>
                                            <MenuItem value={EngagementViewSections.DESCRIPTION}>
                                                Description Section
                                            </MenuItem>
                                        </Select>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel value="external" control={<Radio />} label="External URL" />
                                <br />
                                <Controller
                                    name="open_external_link"
                                    aria-label="External URL"
                                    control={control}
                                    defaultValue={open_section?.external_link}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value || undefined}
                                            disabled={watch('open_cta_link_type') !== 'external'}
                                            sx={{ backgroundColor: colors.surface.white }}
                                            id="external_link"
                                            placeholder="Paste or type URL here"
                                            error={errors.open_external_link?.message}
                                            errorPosition="bottom"
                                        />
                                    )}
                                />
                            </Grid>
                        </RadioGroup>
                    )}
                />
            </AuthoringFormSection>
            <AuthoringFormSection
                name="“Closed” (Results Pending) State Message Text"
                details={
                    'When your engagement is closed, you may wish to add message text to your hero banner advising ' +
                    'your engagement audience to come back later to view the results of your engagement.'
                }
            >
                <BodyText size="small" bold sx={{ mb: -2 }}>
                    Message Text
                </BodyText>
                <ErrorMessage error={errors._closed_message_plain?.message} />
                <RichTextArea
                    ariaLabel="Closed State Message Text"
                    toolbar={{
                        options: ['inline', 'link', 'history'],
                        inline: { options: ['bold', 'italic', 'underline', 'superscript', 'subscript'] },
                    }}
                    editorState={closedEditorState}
                    onEditorStateChange={(value) => updateEditorState(value, 'closed_message')}
                />
                <BodyText size="small" ml="auto" mt={-2}>
                    {closedEditorState.getCurrentContent().getPlainText().length}/150
                </BodyText>
            </AuthoringFormSection>
            <AuthoringFormSection
                name="“View Results” State Primary CTA"
                labelFor="cta_button_text"
                details={
                    'If you will be publishing the results of your engagement, you can use the primary CTA in your ' +
                    'hero banner do direct your engagement audience to those results. You may link to results ' +
                    'published within this engagement, or enter a URL to an external web page.'
                }
            >
                <Controller
                    name="view_results_cta"
                    control={control}
                    defaultValue={view_results_section?.block_text}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="cta_button_text"
                            title="Button (Primary CTA) Text"
                            counter
                            maxLength={20}
                            placeholder="View results text"
                        />
                    )}
                />
                <Controller
                    name="view_results_link_type"
                    control={control}
                    defaultValue={view_results_section?.link_type}
                    render={({ field }) => (
                        <RadioGroup row id="cta_view_results_radio" defaultValue="internal" {...field}>
                            <Grid item xs={6} direction="column" sx={{ paddingRight: '2rem' }}>
                                <FormControlLabel value="internal" control={<Radio />} label="In-Page Section Link" />
                                <br />
                                <Controller
                                    name="view_results_section_link"
                                    control={control}
                                    defaultValue={view_results_section?.internal_link}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            aria-label="Section Link"
                                            fullWidth
                                            disabled={watch('view_results_link_type') !== 'internal'}
                                            sx={{ mt: 1, height: '3em', '& fieldset': { borderColor: '#7A7876' } }}
                                            id="view_results_link"
                                        >
                                            <MenuItem value={EngagementViewSections.PROVIDE_FEEDBACK}>
                                                Provide Feedback Section
                                            </MenuItem>
                                            <MenuItem value={EngagementViewSections.CONTENT_TABS}>
                                                Tabbed Content
                                            </MenuItem>
                                            <MenuItem value={EngagementViewSections.DESCRIPTION}>
                                                Description Section
                                            </MenuItem>
                                        </Select>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel value="external" control={<Radio />} label="External URL" />
                                <br />

                                <Controller
                                    name="view_results_external_link"
                                    control={control}
                                    defaultValue={view_results_section?.external_link}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value || undefined}
                                            disabled={watch('view_results_link_type') !== 'external'}
                                            sx={{ backgroundColor: colors.surface.white }}
                                            id="view_results_link"
                                            placeholder="Paste or type URL here"
                                        />
                                    )}
                                />
                            </Grid>
                        </RadioGroup>
                    )}
                />
            </AuthoringFormSection>
        </AuthoringFormContainer>
    );
};

export default AuthoringBanner;
