import React, { Suspense, useState } from 'react';
import { Header1, Header2 } from 'components/common/Typography';
import { Button, TextField } from 'components/common/Input';
import { Form, useLoaderData, Await } from 'react-router-dom';
import { Box, Skeleton } from '@mui/material';
import { Dayjs } from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';
import EngagementVisibilityControl from '../EngagementVisibilityControl';
import UnsavedWorkConfirmation from 'components/common/Navigation/UnsavedWorkConfirmation';
import { FeedbackMethodSelector } from '../FeedbackMethodSelector';
import { DateRangePickerWithCalculation } from '../DateRangePickerWithCalculation';
import { LanguageManager } from '../LanguageManager';
import { UserManager } from '../UserManager';
import { User } from 'models/user';
import { Language } from 'models/language';
import { FormStep } from 'components/common/Layout/FormStep';

export interface EngagementConfigurationData {
    // 1. Title
    name: string;
    // 2. Feedback methods
    feedback_methods: string[];
    // 3. Dates
    start_date: Dayjs;
    end_date: Dayjs;
    _dateConfirmed: boolean;
    // 4. Languages
    languages: Language[];
    // 5. Access control
    is_internal: boolean;
    slug: string;
    _visibilityConfirmed: boolean;
    // 6. Team members
    users: User[];
}

const EngagementForm = ({
    onSubmit,
    isNewEngagement,
}: {
    onSubmit: (data: EngagementConfigurationData) => void;
    isNewEngagement?: boolean;
}) => {
    const engagementForm = useFormContext<EngagementConfigurationData>();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isDirty, isValid, isSubmitting, touchedFields },
    } = engagementForm;

    const [nameHasBeenEdited, setNameHasBeenEdited] = useState(false);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ maxWidth: '788px' }}>
                <Header2 decorated>{isNewEngagement ? 'Configure Engagement' : 'Edit Configuration'}</Header2>
                <br />
                <Controller
                    control={control}
                    name="name"
                    rules={{ required: 'Engagement title is required' }}
                    render={({ field }) => {
                        return (
                            <FormStep
                                step={1}
                                completed={Boolean(field.value)}
                                completing={touchedFields.name && nameHasBeenEdited}
                                question="What is the title of your engagement?"
                                details="Titles should succinctly describe what your engagement is about in 60 characters or less."
                                labelFor="name"
                            >
                                <TextField
                                    id="name"
                                    {...field}
                                    error={nameHasBeenEdited ? errors.name?.message : undefined}
                                    counter
                                    maxLength={50}
                                    onChange={(value) => {
                                        setNameHasBeenEdited((current) => Boolean(value) || current);
                                        field.onChange(value);
                                    }}
                                    placeholder="Engagement title"
                                />
                            </FormStep>
                        );
                    }}
                />
                <FormStep
                    step={2}
                    completed={watch('feedback_methods').length > 0}
                    question="How will your engagement be gathering feedback?"
                    details="Select all that apply. These are the ways in which you will be collecting feedback from your participants. For example, you may choose to collect feedback through surveys, polls, or discussion forums."
                    isGroup
                >
                    <FeedbackMethodSelector />
                </FormStep>
                <FormStep
                    step={3}
                    completed={Boolean(watch('start_date')) && Boolean(watch('end_date')) && watch('_dateConfirmed')}
                    completing={Boolean(touchedFields.start_date) && Boolean(touchedFields.end_date)}
                    question="When will your engagement be open for receiving feedback?"
                    details="Please select the dates your engagement will be open and closed for receiving feedback. (These dates are not related to when your engagement will be published.)"
                    isGroup
                >
                    <DateRangePickerWithCalculation />
                </FormStep>
                <FormStep
                    step={4}
                    completed={watch('languages').some((l) => l.code)}
                    question="Will your engagement be offered in multiple languages?"
                    details="All engagements must be offered in English, but you may also add content in additional languages. If you select multi-language, you must include French."
                    isGroup
                >
                    <LanguageManager />
                </FormStep>
                <FormStep
                    step={5}
                    completed={Boolean(
                        watch('is_internal') !== undefined && watch('slug') && watch('_visibilityConfirmed'),
                    )}
                    completing={Boolean(touchedFields.is_internal)}
                    question="Who should be able to access your published engagement?"
                    details="If you select BC Gov, your engagement will only be accessible by BC Gov employees who have an IDIR."
                    isGroup
                >
                    <EngagementVisibilityControl />
                </FormStep>
                <FormStep
                    step={6}
                    completed={watch('users').some((u) => u)}
                    question="Who would you like to add to this engagement?"
                    details="In addition to yourself, please add the team members that you would like to have access to this engagement. You can only add individuals that have already signed into MET."
                    isGroup
                >
                    <UserManager />
                </FormStep>
            </Box>
            <Box sx={{ mt: 3 }}>
                <Button
                    sx={{ mr: '16px' }}
                    disabled={
                        !isValid ||
                        !isDirty ||
                        isSubmitting ||
                        !watch('_dateConfirmed') ||
                        !watch('_visibilityConfirmed')
                    }
                    variant="primary"
                    type="submit"
                >
                    {isNewEngagement ? 'Create Engagement' : 'Save Changes'}
                </Button>
                <Button href={isNewEngagement ? '/engagements' : '../view'}>Cancel</Button>
            </Box>
            <UnsavedWorkConfirmation blockNavigationWhen={isDirty && !isSubmitting} />
        </Form>
    );
};

export default EngagementForm;
