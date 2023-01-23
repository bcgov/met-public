import React, { useContext, useState, useEffect } from 'react';
import { Typography, Grid, TextField, Stack } from '@mui/material';
import { MetPaper, MetLabel, PrimaryButton, SecondaryButton, MetHeader4 } from '../../common';
import RichTextEditor from './RichTextEditor';
import { ActionContext } from './ActionContext';
import ImageUpload from 'components/imageUpload';
import { useNavigate } from 'react-router-dom';
import { AddSurveyBlock } from './AddSurveyBlock';
import { If, Then, Else } from 'react-if';
import DayCalculatorModal from 'components/common/Modals/DayCalculator';
const EngagementForm = () => {
    const {
        handleCreateEngagementRequest,
        handleUpdateEngagementRequest,
        isSaving,
        savedEngagement,
        engagementId,
        handleAddBannerImage,
        handleStatusBlockChange,
    } = useContext(ActionContext);

    const navigate = useNavigate();

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
    const { name, start_date, end_date } = engagementFormData;
    const [engagementFormError, setEngagementFormError] = useState({
        name: false,
        start_date: false,
        end_date: false,
    });

    const getErrorMessage = () => {
        if (name.length > 50) {
            return 'Name must not exceed 50 characters';
        } else if (engagementFormError.name) {
            return 'Name must be specified';
        }
        return '';
    };

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
    };

    const handleContentChange = (rawText: string) => {
        setEngagementFormData({
            ...engagementFormData,
            content: rawText,
        });
    };

    const handleRichDescriptionChange = (newState: string) => {
        setRichDescription(newState);
    };

    const handleRichContentChange = (newState: string) => {
        setRichContent(newState);
    };

    const validateForm = () => {
        const errors = {
            name: !(name && name.length < 50),
            start_date: !start_date,
            end_date: !end_date,
        };
        setEngagementFormError(errors);

        return Object.values(errors).some((isError: unknown) => isError);
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

    const [isOpen, setIsOpen] = useState(false);

    return (
        <MetPaper elevation={1}>
            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                rowSpacing={2}
                sx={{ padding: '2em' }}
            >
                <DayCalculatorModal open={isOpen} updateModal={setIsOpen} />
                <Grid item xs={12}>
                    <ImageUpload
                        margin={4}
                        data-testid="engagement-form/image-upload"
                        handleAddFile={handleAddBannerImage}
                        savedImageUrl={savedEngagement.banner_url}
                    />
                </Grid>
                <Grid item xs={12} lg={8} md={6}>
                    <MetLabel sx={{ marginBottom: '2px' }}>Engagement Name </MetLabel>
                    <TextField
                        id="engagement-name"
                        data-testid="engagement-form/name"
                        variant="outlined"
                        label=" "
                        InputLabelProps={{
                            shrink: false,
                        }}
                        fullWidth
                        name="name"
                        value={name}
                        onChange={handleChange}
                        error={engagementFormError.name || name.length > 50}
                        helperText={getErrorMessage()}
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="baseline"
                    rowSpacing={{ xs: 1, sm: 0 }}
                    columnSpacing={2}
                >
                    <Grid item xs={12}>
                        <MetLabel>Engagement Date </MetLabel>
                    </Grid>

                    <Grid item md={4} xs={12}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography minWidth={{ xs: '2.5em', md: 'auto' }} align="center">
                                From
                            </Typography>

                            <TextField
                                id="from-date"
                                type="date"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                InputProps={{ inputProps: { max: end_date || null } }}
                                fullWidth
                                name="start_date"
                                value={start_date}
                                onChange={handleChange}
                                error={engagementFormError.start_date}
                                helperText={engagementFormError.start_date ? 'From Date must be specified' : ''}
                            />
                        </Stack>
                    </Grid>

                    <Grid item md={4} xs={12}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography minWidth={{ xs: '2.5em', md: 'auto' }}>To</Typography>
                            <TextField
                                id="from-date"
                                type="date"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                InputProps={{ inputProps: { min: start_date || null } }}
                                fullWidth
                                name="end_date"
                                value={end_date}
                                onChange={handleChange}
                                error={engagementFormError.end_date}
                                helperText={engagementFormError.end_date ? 'To Date must be specified' : ''}
                            />
                        </Stack>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Stack direction="row" alignItems="center">
                            <SecondaryButton sx={{ marginLeft: '1em' }} onClick={() => setIsOpen(true)}>
                                Day Calculator
                            </SecondaryButton>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <MetLabel sx={{ marginBottom: '2px' }}>Engagement Description</MetLabel>
                    <RichTextEditor
                        setRawText={handleDescriptionChange}
                        handleEditorStateChange={handleRichDescriptionChange}
                        initialRawEditorState={savedEngagement.rich_description || ''}
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
                                />
                            </Grid>
                        </Grid>
                    </MetPaper>
                </Grid>

                <Grid item xs={12}>
                    <AddSurveyBlock handleStatusBlockChange={handleStatusBlockChange} />
                </Grid>

                <Grid item xs={12}>
                    <If condition={isNewEngagement}>
                        <Then>
                            <PrimaryButton
                                sx={{ marginRight: 1 }}
                                data-testid="engagement-form/create-engagement-button"
                                onClick={() => handleCreateEngagement()}
                                loading={isSaving}
                            >
                                Create Engagement Draft
                            </PrimaryButton>
                        </Then>
                        <Else>
                            <PrimaryButton
                                data-testid="engagement-form/update-engagement-button"
                                sx={{ marginRight: 1 }}
                                onClick={() => handleUpdateEngagement()}
                                disabled={isSaving}
                                loading={isSaving}
                            >
                                Update Engagement
                            </PrimaryButton>
                        </Else>
                    </If>
                    <SecondaryButton
                        data-testid="engagement-form/preview-engagement-button"
                        onClick={() => handlePreviewEngagement()}
                        disabled={isSaving}
                    >
                        {'Save & Preview Engagement'}
                    </SecondaryButton>
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default EngagementForm;
