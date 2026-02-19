import { Autocomplete, Grid2 as Grid, Modal, TextField as MUITextField } from '@mui/material';
import { ErrorMessage, EyebrowText as FormDescriptionText, Header3 } from 'components/common/Typography';
import { colors } from 'components/common';
import { TextField } from 'components/common/Input';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import React, { Suspense, useEffect, useState } from 'react';
import WidgetPicker from '../widgets';
import { WidgetLocation } from 'models/widget';
import { Await, useLoaderData, useOutletContext } from 'react-router-dom';
import { Controller, useFormContext } from 'react-hook-form';
import { defaultValuesObject, EngagementUpdateData } from './AuthoringContext';
import { AuthoringTemplateOutletContext } from './types';
import UnsavedWorkConfirmation from 'components/common/Navigation/UnsavedWorkConfirmation';
import { AuthoringLoaderData } from './authoringLoader';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import ConfirmModal from 'components/common/Modals/ConfirmModal';
import { EngagementStatus } from 'constants/engagementStatus';
import { AuthoringFormContainer, AuthoringFormSection } from './AuthoringFormLayout';

type SelectOption = { label: string; value: number };

const AuthoringFeedback = () => {
    const [surveySelectOptions, setSurveySelectOptions] = useState<SelectOption[]>([{ label: 'None', value: -1 }]);
    const [surveyChangeModalOpen, setSurveyChangeModalOpen] = useState(false);
    const [surveyChangeValue, setSurveyChangeValue] = useState<SelectOption | null>(null);
    const { setDefaultValues, fetcher, pageName, engagement: eng }: AuthoringTemplateOutletContext = useOutletContext(); // Access the form functions and values from the authoring template.
    const tenantId = eng.tenant_id;
    const engagementId = eng.id;
    let statusId = eng.status_id;
    const {
        setValue,
        getValues,
        reset,
        control,
        formState: { errors, isDirty, isSubmitting },
    } = useFormContext<EngagementUpdateData>();

    // Must be a loader assigned to this route or data won't be refreshed on page change.
    const { engagement, surveys } = useLoaderData() as AuthoringLoaderData; // Get fresh data to avoid DB sync issues
    const hasUnsavedWork = isDirty && !isSubmitting;

    // Set current values to default state after saving form
    useEffect(() => {
        const newDefaults = getValues();
        setDefaultValues(newDefaults);
        reset(newDefaults);
    }, [fetcher.data]);

    // Reset values to default and retrieve relevant content from loader.
    useEffect(() => {
        surveys.then((surveys) => {
            if (surveys?.items && Array.isArray(surveys.items) && surveys.items.length > 0) {
                const filteredOptions: SelectOption[] = [];
                surveys.items.forEach((svy) => {
                    // Only return surveys that share a tenant with the current engagement and aren't claimed
                    if (
                        svy.tenant_id === tenantId &&
                        (Number(svy.engagement_id) === engagementId || !svy.engagement_id)
                    ) {
                        filteredOptions.push({
                            label: svy?.name || '',
                            value: svy?.id || 0,
                        });
                    }
                });
                setSurveySelectOptions([{ label: 'None', value: -1 }, ...filteredOptions]);
                engagement.then((eng) => {
                    statusId = eng.status_id || statusId;
                    reset(defaultValuesObject);
                    setValue('form_source', pageName);
                    setValue('id', Number(eng.id));
                    setValue('status_id', Number(eng.id));
                    setValue('feedback_heading', eng.feedback_heading);
                    // Check if feedback_body is valid stringified JSON, then convert it to an editor state
                    if (tryParse(eng.feedback_body)) {
                        setValue('feedback_body', getEditorStateFromRaw(eng.feedback_body) || '');
                    }
                    // Check if the selected survey exists in the array of available surveys
                    setValue(
                        'selected_survey_id',
                        eng.surveys?.find((s) => Number(s.id) === eng.selected_survey_id) ? eng.selected_survey_id : -1,
                    );
                    setValue('surveys', eng.surveys || []);
                    setDefaultValues(getValues());
                    reset(getValues());
                });
            }
        });
    }, [engagement, surveys]);

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

    // Change the survey value if the change survey modal is opened and the user confirms.
    const surveyChangeConfirm = () => {
        if (surveyChangeValue?.value) {
            setValue('selected_survey_id', surveyChangeValue.value, { shouldDirty: true });
        }
        setSurveyChangeValue(null);
        setSurveyChangeModalOpen(false);
    };

    // Define the styles
    const metHeader3Styles = {
        fontSize: '1.05rem',
        marginBottom: '0.7rem',
    };
    const formDescriptionTextStyles = {
        fontSize: '0.9rem',
        marginBottom: '1.5rem',
    };
    const authoringFormContainerStyles = {
        gap: 0,
        '& .met-input-form-field-title': { fontSize: '0.875rem' },
        '& .met-input-text': { background: 'white' },
        '& #image-upload-section .MuiGrid-container': { background: 'white' },
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
            {/* prevent user from accidentally changing the selected survey if engagement is currently open */}
            <Modal open={surveyChangeModalOpen} aria-describedby="select-survey-modal-subtext">
                <ConfirmModal
                    style="danger"
                    header={`Are you sure you want to change the active survey for this engagement?`}
                    subHeader="The engagement has already been published."
                    subTextId="select-survey-modal-subtext"
                    subText={[
                        {
                            text: `Survey responses may have already been collected for the previous survey.`,
                            bold: false,
                        },
                    ]}
                    handleConfirm={surveyChangeConfirm}
                    handleClose={() => setSurveyChangeModalOpen(false)}
                    confirmButtonText={`Change the Active Survey`}
                    cancelButtonText={'Cancel & Go Back'}
                />
            </Modal>

            {/* prevent navigating away when the user has unsaved work */}
            <UnsavedWorkConfirmation blockNavigationWhen={hasUnsavedWork} />

            {/* Feedback form */}
            <AuthoringFormContainer sx={authoringFormContainerStyles}>
                <Grid sx={{ mt: '1rem' }}>
                    <Header3 style={metHeader3Styles}>Primary Content (Required)</Header3>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        This section of content should provide a brief overview of your approach to feedback and what
                        you would like your audience to do.
                    </FormDescriptionText>
                </Grid>

                <AuthoringFormSection name="Section Heading" required={true} labelFor={'feedback_heading'}>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        Your feedback heading should be descriptive, short, and succinct.
                    </FormDescriptionText>
                    <Controller
                        control={control}
                        name="feedback_heading"
                        rules={{ required: true, maxLength: 60 }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                sx={{ backgroundColor: colors.surface.white }}
                                id="feedback_heading"
                                aria-label="Feedback heading. Your feedback heading should be descriptive, short, and succinct."
                                counter
                                maxLength={60}
                                placeholder="Feedback heading message"
                                error={errors.feedback_heading?.message ?? ''}
                                onChange={(value) => {
                                    field.onChange(value);
                                }}
                            />
                        )}
                    />
                </AuthoringFormSection>

                <AuthoringFormSection name="Body Copy" required={true} labelFor={'feedback_body'}>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        You must either include links to your engagement feedback methods within this section’s body
                        copy using the link button in the WSIWYG editor below, or, Call to Action Buttons in the
                        following two fields.
                    </FormDescriptionText>
                    <ErrorMessage error={errors.feedback_body?.message?.toString() || ''} />
                    <Controller
                        control={control}
                        name="feedback_body"
                        rules={{ required: true }}
                        render={({ field }) => {
                            return (
                                <RichTextArea
                                    ariaLabel="Body Copy: Body copy for the feedback section of your engagement should provide a short overview of your feedback approach and what you are asking your audience to do."
                                    spellCheck
                                    editorStyle={{
                                        cursor: 'text',
                                    }}
                                    editorState={field.value}
                                    onEditorStateChange={(value) => {
                                        field.onChange(value);
                                    }}
                                    handlePastedText={() => false}
                                    toolbar={toolbar}
                                />
                            );
                        }}
                    />
                </AuthoringFormSection>

                <AuthoringFormSection name="Survey" required={false} labelFor={'selected_survey_id'}>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        Select the survey that you wish to link to your feedback section. External surveys are coming
                        soon!
                    </FormDescriptionText>
                    <Suspense>
                        <Await resolve={[surveys, engagement]}>
                            <Controller
                                control={control}
                                name="selected_survey_id"
                                render={({ field }) => (
                                    <Autocomplete<SelectOption, false, true, false>
                                        disableClearable
                                        aria-label="Select the survey that you wish to link to your feedback section. External surveys are coming soon."
                                        id="selected_survey_id"
                                        size="small"
                                        sx={{ minHeight: '48px' }}
                                        options={surveySelectOptions}
                                        value={surveySelectOptions?.find((o) => o.value === field.value) ?? undefined}
                                        isOptionEqualToValue={(opt, val) => opt.value === val.value}
                                        getOptionLabel={(opt: SelectOption) => opt?.label ?? ''}
                                        onChange={(_e, v) => {
                                            // Confirm that the user wants to change the survey if the engagement is published
                                            if (statusId === EngagementStatus.Published) {
                                                setSurveyChangeValue(v);
                                                setSurveyChangeModalOpen(true);
                                            } else {
                                                field.onChange(v?.value ? v.value : null);
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <MUITextField
                                                {...params}
                                                name="selected-survey"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        minHeight: '48px',
                                                    },
                                                }}
                                                size="small"
                                                error={!!errors?.selected_survey_id?.message}
                                                helperText={errors?.selected_survey_id?.message}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Await>
                    </Suspense>
                </AuthoringFormSection>

                <Grid sx={{ mt: '1rem' }}>
                    <Header3 style={metHeader3Styles}>Supporting Content (Optional)</Header3>
                    <FormDescriptionText style={formDescriptionTextStyles}>
                        You may use a widget to add supporting content to your primary content.
                    </FormDescriptionText>
                    <Grid container sx={{ maxWidth: '700px', mt: '1rem' }} direction="column">
                        <WidgetPicker location={WidgetLocation.Feedback} />
                    </Grid>
                </Grid>
            </AuthoringFormContainer>
        </>
    );
};

export default AuthoringFeedback;
