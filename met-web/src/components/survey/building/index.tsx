import React, { useEffect, useState } from 'react';
import {
    Grid,
    Stack,
    Divider,
    TextField,
    IconButton,
    Switch,
    FormGroup,
    FormControlLabel,
    Tooltip,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { useNavigate, useParams } from 'react-router-dom';
import FormBuilder from 'components/Form/FormBuilder';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ClearIcon from '@mui/icons-material/Clear';
import { SurveyParams } from '../types';
import { getSurvey, putSurvey } from 'services/surveyService';
import { Survey } from 'models/survey';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { MetHeader3, MetPageGridContainer, PrimaryButton, SecondaryButton } from 'components/common';
import FormBuilderSkeleton from './FormBuilderSkeleton';
import { FormBuilderData } from 'components/Form/types';
import { EngagementStatus } from 'constants/engagementStatus';
import { getEngagement } from 'services/engagementService';
import { Engagement } from 'models/engagement';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { Palette } from 'styles/Theme';
import { PermissionsGate } from 'components/permissionsGate';
import { SCOPES } from 'components/permissionsGate/PermissionMaps';

const SurveyFormBuilder = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { surveyId } = useParams<SurveyParams>();

    const [savedSurvey, setSavedSurvey] = useState<Survey | null>(null);
    const [formData, setFormData] = useState<unknown>(null);

    const [loading, setLoading] = useState(true);
    const [isNameFocused, setIsNamedFocused] = useState(false);
    const [name, setName] = useState(savedSurvey ? savedSurvey.name : '');
    const [isSaving, setIsSaving] = useState(false);
    const [savedEngagement, setSavedEngagement] = useState<Engagement | null>(null);

    const [formDefinition, setFormDefinition] = useState<FormBuilderData>({ display: 'form', components: [] });
    const isMultiPage = formDefinition.display === 'wizard';
    const hasEngagement = Boolean(savedSurvey?.engagement_id);
    const isEngagementDraft = savedEngagement?.status_id === EngagementStatus.Draft;
    const hasPublishedEngagement = hasEngagement && !isEngagementDraft;
    const [isHiddenSurvey, setIsHiddenSurvey] = useState(savedSurvey ? savedSurvey.is_hidden : false);

    useEffect(() => {
        loadSurvey();
    }, []);

    useEffect(() => {
        if (savedEngagement && hasPublishedEngagement) {
            dispatch(
                openNotification({
                    severity: 'warning',
                    text: 'Engagement already published. Saving is disabled.',
                }),
            );
        }
    }, [savedEngagement]);

    const loadSurvey = async () => {
        if (isNaN(Number(surveyId))) {
            navigate('/surveys');
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'The survey id passed was erroneous',
                }),
            );
            return;
        }
        try {
            const loadedSurvey = await getSurvey(Number(surveyId));
            setSavedSurvey(loadedSurvey);
            setFormDefinition(loadedSurvey?.form_json || { display: 'form', components: [] });
            setName(loadedSurvey.name);
            setIsHiddenSurvey(loadedSurvey.is_hidden);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while loading saved survey',
                }),
            );
            navigate('/surveys');
        }
    };

    useEffect(() => {
        if (savedSurvey) {
            loadEngagement();
        }
    }, [savedSurvey]);

    const loadEngagement = async () => {
        if (!savedSurvey?.engagement_id) {
            setLoading(false);
            return;
        }

        try {
            const loadedEngagement = await getEngagement(Number(savedSurvey.engagement_id));
            setSavedEngagement(loadedEngagement);
            setLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while loading saved engagement data',
                }),
            );
            navigate('/survey/listing');
        }
    };

    const handleFormChange = (form: FormBuilderData) => {
        if (!form.components) {
            return;
        }
        setFormData(form);
    };

    const handleSaveForm = async () => {
        if (!savedSurvey) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Unable to build survey, please reload',
                }),
            );
            return;
        }

        try {
            setIsSaving(true);
            await putSurvey({
                id: String(surveyId),
                form_json: formData,
                name: name,
                is_hidden: isHiddenSurvey,
            });
            dispatch(
                openNotification({
                    severity: 'success',
                    text: savedSurvey.engagement?.id
                        ? `Survey was successfully added to engagement`
                        : 'The survey was successfully built',
                }),
            );
            if (savedSurvey.engagement?.id) {
                navigate(`/engagements/${savedSurvey.engagement.id}/form`);
                return;
            }

            navigate('/surveys');
        } catch (error) {
            setIsSaving(false);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while saving survey',
                }),
            );
        }
    };

    if (loading) {
        return <FormBuilderSkeleton />;
    }

    return (
        <MetPageGridContainer
            container
            direction="row"
            alignItems="flex-start"
            justifyContent="flex-start"
            item
            xs={12}
            spacing={4}
        >
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-start" alignItems="center">
                    {!isNameFocused ? (
                        <>
                            <MetHeader3
                                sx={{ p: 0.5 }}
                                onClick={() => {
                                    setIsNamedFocused(true);
                                }}
                            >
                                {name}
                            </MetHeader3>
                            <IconButton
                                size="small"
                                onClick={() => {
                                    setIsNamedFocused(!isNameFocused);
                                }}
                                color="inherit"
                            >
                                <BorderColorIcon sx={{ fontSize: '1rem' }} />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <TextField
                                autoFocus
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                onBlur={(event) => setIsNamedFocused(false)}
                            />
                            <IconButton
                                onClick={() => {
                                    setIsNamedFocused(!isNameFocused);
                                }}
                                color="inherit"
                            >
                                <ClearIcon />
                            </IconButton>
                        </>
                    )}
                </Stack>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isMultiPage}
                                onChange={(e) => {
                                    dispatch(
                                        openNotificationModal({
                                            open: true,
                                            data: {
                                                header: 'Change Survey Type',
                                                subText: [
                                                    {
                                                        text: `You will be changing the survey type from ${
                                                            isMultiPage
                                                                ? 'multi page to single page'
                                                                : 'single page to multi page'
                                                        }.`,
                                                    },
                                                    {
                                                        text: 'You will lose all current progress if you do.',
                                                        bold: true,
                                                    },
                                                    {
                                                        text: 'Do you want to change this survey type?',
                                                    },
                                                ],
                                                handleConfirm: () => {
                                                    setFormDefinition({
                                                        display: isMultiPage ? 'form' : 'wizard',
                                                        components: [],
                                                    });
                                                },
                                            },
                                            type: 'confirm',
                                        }),
                                    );
                                }}
                            />
                        }
                        label="Multi-page"
                    />
                </FormGroup>
            </Grid>
            <Grid item xs={12}>
                <FormBuilder handleFormChange={handleFormChange} savedForm={formDefinition} />
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={0}>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <PermissionsGate scopes={[SCOPES.createSurvey]} errorProps={{ disabled: true }}>
                                    <Switch
                                        checked={isHiddenSurvey}
                                        disabled={savedSurvey?.engagement_id ? true : false}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setIsHiddenSurvey(true);
                                                return;
                                            }
                                            setIsHiddenSurvey(false);
                                        }}
                                    />
                                </PermissionsGate>
                            }
                            label="Hide Survey"
                        />
                    </FormGroup>
                    <Tooltip title="When you toggle ON this option and save your Survey, your Survey will be 'Hidden'. As long as this option is on, the Survey will only be visible to Superusers. When you are ready to make it available, change the toggle to OFF and click the Save button.">
                        <IconButton>
                            <HelpIcon sx={{ fontSize: 20, color: `${Palette.primary.main}` }} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <PrimaryButton
                        disabled={!formData || hasPublishedEngagement}
                        loading={isSaving}
                        onClick={handleSaveForm}
                    >
                        {'Save & Continue'}
                    </PrimaryButton>
                    <SecondaryButton onClick={() => navigate('/surveys')}>Cancel</SecondaryButton>
                </Stack>
            </Grid>
        </MetPageGridContainer>
    );
};

export default SurveyFormBuilder;
