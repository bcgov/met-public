import React, { useContext, useState, useEffect } from 'react';
import { Typography, Grid, TextField, Stack } from '@mui/material';
import { MetPaper, MetLabel, PrimaryButton, SecondaryButton, MetHeader4 } from '../../common';
import RichTextEditor from './RichTextEditor';
import { ActionContext } from './ActionContext';
import ImageUpload from 'components/imageUpload';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { AddSurveyBlock } from './AddSurveyBlock';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { Then, If, Else } from 'react-if';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';

const schema = yup
    .object({
        name: yup.string().max(50, 'Engagement name should not exceed 50 characters').required(),
        start_date: yup.string().required(),
        end_date: yup.string().required(),
        description: yup.string().max(500, 'Description should not exceed 500 characters').required(),
        content: yup.string().max(50, 'Content should not exceed 500 characters').required(),
    })
    .required();

type EngagementForm = yup.TypeOf<typeof schema>;

const EngagementForm = () => {
    const {
        handleCreateEngagementRequest,
        handleUpdateEngagementRequest,
        isSaving,
        savedEngagement,
        engagementId,
        handleAddBannerImage,
    } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const methods = useForm<EngagementForm>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            start_date: '',
            end_date: '',
            description: '',
            content: '',
        },
    });

    const { handleSubmit } = methods;

    const isNewEngagement = engagementId === 'create';

    const [engagementFormData, setEngagementFormData] = useState({
        name: '',
        start_date: '',
        end_date: '',
        description: '',
        content: '',
    });
    const [richDescription, setRichDescription] = useState('');
    const [richContent, setRichContent] = useState('');

    useEffect(() => {
        setEngagementFormData({
            name: savedEngagement?.name || '',
            start_date: savedEngagement.start_date,
            end_date: savedEngagement.end_date,
            description: savedEngagement?.description || '',
            content: savedEngagement?.content || '',
        });
        setRichDescription(savedEngagement?.rich_description || '');
        setRichContent(savedEngagement?.rich_content || '');
    }, [savedEngagement]);

    const [engagementFormError, setEngagementFormError] = useState({
        name: false,
        start_date: false,
        end_date: false,
        description: false,
        content: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setEngagementFormData({
            ...engagementFormData,
            [e.target.name]: e.target.value,
        });
        setEngagementFormError({
            ...engagementFormError,
            [e.target.name]: false,
        });
    };

    const handleDescriptionChange = (rawText: string) => {
        setEngagementFormData({
            ...engagementFormData,
            description: rawText,
        });

        setEngagementFormError({
            ...engagementFormError,
            description: false,
        });
    };

    const handleContentChange = (rawText: string) => {
        setEngagementFormData({
            ...engagementFormData,
            content: rawText,
        });

        setEngagementFormError({
            ...engagementFormError,
            content: false,
        });
    };

    const handleRichDescriptionChange = (newState: string) => {
        setRichDescription(newState);
    };

    const handleRichContentChange = (newState: string) => {
        setRichContent(newState);
    };

    const { name, start_date, end_date, description, content } = engagementFormData;

    const validateForm = () => {
        const errors = {
            name: !name,
            start_date: !start_date,
            end_date: !end_date,
            description: !description,
            content: !content,
        };

        setEngagementFormError(errors);

        return Object.values(errors).some((isError: unknown) => isError);
    };

    const onSubmit: SubmitHandler<EngagementForm> = async (data: EngagementForm) => {
        if (!savedEngagement) {
            return;
        }

        try {
            const engagement = await handleSaveEngagement();

            navigate(`/engagements/${engagement.id}/form`);
        } catch (err) {
            dispatch(openNotification({ severity: 'error', text: 'An error occured while trying to save Engagement' }));
        }
    };

    const handleCreateEngagement = async () => {
        const hasErrors = validateForm();

        if (hasErrors) {
            return;
        }

        const engagement = await handleCreateEngagementRequest({
            ...engagementFormData,
            rich_description: richDescription,
            rich_content: richContent,
        });

        navigate(`/engagements/${engagement.id}/form`);

        return engagement;
    };

    const handleUpdateEngagement = async () => {
        const hasErrors = validateForm();

        if (hasErrors) {
            return;
        }

        const engagement = await handleUpdateEngagementRequest({
            ...engagementFormData,
            rich_description: richDescription,
            rich_content: richContent,
        });

        navigate(`/engagements/${engagement.id}/form`);

        return savedEngagement;
    };

    const handleSaveEngagement = () => {
        if (isNewEngagement) {
            return handleCreateEngagement();
        }

        return handleUpdateEngagement();
    };

    const handlePreviewEngagement = async () => {
        const engagement = await handleSaveEngagement();
        if (!engagement) {
            return;
        }

        navigate(`/engagements/${engagement.id}/view`);
        window.scrollTo(0, 0);
    };

    return (
        <MetPaper elevation={1}>
            <FormProvider {...methods}>
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    rowSpacing={2}
                    sx={{ padding: '2em' }}
                >
                    <Grid item xs={12}>
                        <ImageUpload
                            data-testid="engagement-form/image-upload"
                            handleAddFile={handleAddBannerImage}
                            savedImageUrl={savedEngagement.banner_url}
                        />
                    </Grid>
                    <Grid item xs={12} lg={8} md={6}>
                        <MetLabel sx={{ marginBottom: '2px' }}>Engagement Name</MetLabel>
                        <ControlledTextField
                            name="name"
                            id="engagement-name"
                            variant="outlined"
                            label=" "
                            InputLabelProps={{
                                shrink: false,
                            }}
                            value={name}
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid
                        item
                        lg={8}
                        xs={12}
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="baseline"
                        rowSpacing={{ xs: 1, sm: 0 }}
                        columnSpacing={2}
                    >
                        <Grid item xs={12}>
                            <MetLabel>Engagement Date</MetLabel>
                        </Grid>

                        <Grid item md={6} xs={12}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography minWidth={{ xs: '2.5em', md: 'auto' }} align="center">
                                    From
                                </Typography>

                                <ControlledTextField
                                    type="date"
                                    name="start_date"
                                    id="from-date"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    InputProps={{ inputProps: { min: start_date || null } }}
                                    value={start_date}
                                    fullWidth
                                    size="small"
                                />
                            </Stack>
                        </Grid>

                        <Grid item md={6} xs={12}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography minWidth={{ xs: '2.5em', md: 'auto' }}>To</Typography>
                                <ControlledTextField
                                    type="date"
                                    name="end_date"
                                    id="from-date"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    InputProps={{ inputProps: { min: end_date || null } }}
                                    value={end_date}
                                    fullWidth
                                    size="small"
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <MetLabel sx={{ marginBottom: '2px' }}>Engagement Description</MetLabel>
                        <RichTextEditor
                            setRawText={handleDescriptionChange}
                            handleEditorStateChange={handleRichDescriptionChange}
                            initialRawEditorState={savedEngagement.rich_description || ''}
                            error={engagementFormError.description}
                            helperText="Description cannot be empty"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <MetHeader4 bold={true} sx={{ marginBottom: '2px' }}>
                            Content Block
                        </MetHeader4>
                        <MetPaper>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="flex-start"
                                spacing={2}
                                sx={{ padding: '1em' }}
                            >
                                <Grid item xs={12}>
                                    <MetLabel sx={{ marginBottom: '2px' }}>Engagement Content</MetLabel>
                                    <RichTextEditor
                                        setRawText={handleContentChange}
                                        handleEditorStateChange={handleRichContentChange}
                                        initialRawEditorState={savedEngagement.rich_content || ''}
                                        error={engagementFormError.content}
                                        helperText="Content cannot be empty"
                                    />
                                </Grid>
                            </Grid>
                        </MetPaper>
                    </Grid>

                    <Grid item xs={12}>
                        <AddSurveyBlock />
                    </Grid>

                    <Grid item xs={12}>
                        <If condition={isNewEngagement}>
                            <Then>
                                <PrimaryButton
                                    sx={{ marginRight: 1 }}
                                    data-testid="engagement-form/create-engagement-button"
                                    onClick={handleSubmit(onSubmit)}
                                    loading={isSaving}
                                >
                                    Create Engagement Draft
                                </PrimaryButton>
                            </Then>
                        </If>
                        <Else>
                            <PrimaryButton
                                data-testid="engagement-form/update-engagement-button"
                                sx={{ marginRight: 1 }}
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSaving}
                                loading={isSaving}
                            >
                                Update Engagement
                            </PrimaryButton>
                        </Else>

                        <SecondaryButton
                            data-testid="engagement-form/preview-engagement-button"
                            onClick={() => handlePreviewEngagement()}
                            disabled={isSaving}
                        >
                            {'Save & Preview Engagement'}
                        </SecondaryButton>
                    </Grid>
                </Grid>
            </FormProvider>
        </MetPaper>
    );
};

export default EngagementForm;
