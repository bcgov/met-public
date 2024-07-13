import React from 'react';
import { DetailsContainer, Detail, ResponsiveContainer } from 'components/common/Layout';
import { BodyText, Header1, Header2 } from 'components/common/Typography';
import { Button, TextField } from 'components/common/Input';
import ConfirmModal from 'components/common/Modals/ConfirmModal';
import { Form, useNavigate, useFetcher } from 'react-router-dom';
import { Box, Modal } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faConstruction } from '@fortawesome/pro-regular-svg-icons';
import { Dayjs } from 'dayjs';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { DatesCalculator } from './DatesCalculator';
import { colors } from 'styles/Theme';
import EngagementVisibilityControl from './EngagmentVisibilityControl';
import UnsavedWorkConfirmation from 'components/common/Navigation/UnsavedWorkConfirmation';
import { AutoBreadcrumbs } from 'components/common/Navigation/Breadcrumb';

interface EngagementCreationData {
    name: string;
    start_date: Dayjs;
    end_date: Dayjs;
    is_internal: boolean;
    slug: string;
}

const _TemporaryConstructionNotice = () => (
    <Box
        sx={{
            width: 'calc(100% - 16px)',
            height: '250px',
            backgroundColor: colors.surface.gray[40],
            borderRadius: '8px',
            margin: '8px',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        <FontAwesomeIcon style={{ fontSize: '60px' }} icon={faConstruction} />
        <BodyText mt={1}>Under construction</BodyText>
    </Box>
);

const EngagementCreationWizard = () => {
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();
    const fetcher = useFetcher();

    const engagementCreationForm = useForm<EngagementCreationData>({
        defaultValues: {
            name: '',
            start_date: undefined,
            end_date: undefined,
            is_internal: undefined,
            slug: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: EngagementCreationData) => {
        fetcher.submit(
            {
                name: data.name,
                start_date: data.start_date.format('YYYY-MM-DD'),
                end_date: data.end_date.format('YYYY-MM-DD'),
                is_internal: data.is_internal,
                slug: data.slug,
            },
            {
                method: 'post',
                action: '/engagements/create/',
            },
        );
    };

    const {
        control,
        handleSubmit,
        formState: { errors, isDirty, isValid, isSubmitting },
    } = engagementCreationForm;

    return (
        <ResponsiveContainer>
            <AutoBreadcrumbs />
            <FormProvider {...engagementCreationForm}>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Header1 sx={{ mb: 0 }}>New Engagement</Header1>
                    <Header2 weight="thin">Create a new engagement in six easy configuration steps.</Header2>
                    <BodyText>
                        <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px' }} />
                        <i>
                            You will be able to modify the configuration of your engagement later in the case the
                            parameters of your engagement change.
                        </i>
                    </BodyText>
                    <br />
                    <Header2 decorated>Configure Engagement</Header2>
                    <BodyText bold size="large">
                        In order to create your new engagement we’ll need to configure a few things first.
                    </BodyText>
                    <br />
                    <DetailsContainer sx={{ maxWidth: '1000px', margin: { xs: '0 -16px', sm: '0' } }}>
                        <Detail>
                            <Controller
                                control={control}
                                name="name"
                                rules={{ required: 'Engagement title is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        error={errors.name?.message}
                                        counter
                                        maxLength={50}
                                        title="1. What is the title of your Engagement?"
                                        instructions="Titles should succinctly describe what your engagement is about in 60 characters or less."
                                        placeholder="Engagement title"
                                    />
                                )}
                            />
                        </Detail>
                        <Detail>
                            <BodyText bold size="large">
                                2. How will you be gathering feedback for this engagement?
                            </BodyText>
                            <BodyText size="small">Select all that apply</BodyText>
                            <_TemporaryConstructionNotice />
                        </Detail>
                        <Detail>
                            <BodyText bold size="large">
                                3. When will your engagement be open for receiving feedback?
                            </BodyText>
                            <BodyText size="small">
                                Please select the dates your engagement will be open and closed for receiving feedback.
                                (These dates are not related to when your engagement will be published.)
                            </BodyText>
                            <DatesCalculator />
                        </Detail>
                        <Detail>
                            <BodyText bold size="large">
                                4. Will your engagement be offered in multiple languages?
                            </BodyText>
                            <BodyText size="small">
                                All engagements must be offered in English, but you may also add content in additional
                                languages if you select multi-language.
                            </BodyText>
                            <_TemporaryConstructionNotice />
                        </Detail>
                        <Detail>
                            <BodyText bold size="large">
                                5. Who should be able to access your published engagement?
                            </BodyText>
                            <BodyText size="small">
                                If you select BC Gov, your engagement will only be accessible by BC Gov employees who
                                have an IDIR.
                            </BodyText>
                            <EngagementVisibilityControl />
                        </Detail>
                        <Detail>
                            <BodyText bold size="large">
                                6. Who would you like to add to this engagement?
                            </BodyText>
                            <BodyText size="small">
                                In addition to yourself, please add the team members that you would like to have access
                                to this engagement. You can only add individuals that already have a MET account.
                            </BodyText>
                            <_TemporaryConstructionNotice />
                        </Detail>
                        <Detail invisible sx={{ flexDirection: 'row', gap: '16px' }}>
                            <Button
                                sx={{ mr: '16px' }}
                                disabled={!isValid || !isDirty || isSubmitting}
                                variant="primary"
                                type="submit"
                            >
                                Create Engagement
                            </Button>
                            <Button href="/engagements">Cancel</Button>
                        </Detail>
                    </DetailsContainer>
                </Form>
            </FormProvider>

            <UnsavedWorkConfirmation blockNavigationWhen={isDirty && !isSubmitting} />
            <Modal open={open} onClose={() => setOpen(false)}>
                <ConfirmModal
                    style="default"
                    header="You are using a preview version of the new engagement creation wizard."
                    subHeader="Do you want to continue using the preview version?"
                    subText={[
                        { text: 'The classic form is available for use if you prefer.' },
                        { text: 'Some features may not be available or may not work as expected.' },
                    ]}
                    handleConfirm={() => setOpen(false)}
                    handleClose={() => navigate('/engagements/create/form')}
                    confirmButtonText="Yes, use wizard preview"
                    cancelButtonText="No, go to classic form"
                />
            </Modal>
        </ResponsiveContainer>
    );
};

export default EngagementCreationWizard;
