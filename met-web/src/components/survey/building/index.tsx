import React, { useEffect, useRef, useState } from 'react';
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
import { USER_ROLES } from 'services/userService/constants';
import axios from 'axios';
import { AutoSaveSnackBar } from './AutoSaveSnackBar';
import { debounce } from 'lodash';

interface SurveyForm {
    id: string;
    form_json: unknown;
    name: string;
    is_hidden: boolean;
    is_template: boolean;
}

const SurveyFormBuilder = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { surveyId } = useParams<SurveyParams>();

    const [savedSurvey, setSavedSurvey] = useState<Survey | null>(null);
    const [formData, setFormData] = useState<(unknown & { components: unknown[] }) | null>(null);

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
    const [isTemplateSurvey, setIsTemplateSurvey] = useState(savedSurvey ? savedSurvey.is_template : false);

    const [autoSaveNotificationOpen, setAutoSaveNotificationOpen] = useState(false);
    const AUTO_SAVE_INTERVAL = 5000;

    useEffect(() => {
        loadSurvey();
    }, []);

    useEffect(() => {
        if (savedEngagement && hasPublishedEngagement) {
            dispatch(
                openNotification({
                    severity: 'warning',
                    text: 'Engagement already published. Please be careful while editing the survey.',
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
            setIsTemplateSurvey(loadedSurvey.is_template);
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

    const debounceAutoSaveForm = useRef(
        debounce((newChanges: SurveyForm) => {
            autoSaveForm(newChanges);
        }, AUTO_SAVE_INTERVAL),
    ).current;

    const doDebounceSaveForm = (form: FormBuilderData) => {
        debounceAutoSaveForm({
            id: String(surveyId),
            form_json: form,
            name: name,
            is_hidden: isHiddenSurvey,
            is_template: isTemplateSurvey,
        });
    };

    const handleFormChange = (form: FormBuilderData) => {
        if (!form.components) {
            return;
        }
        setFormData(form);
        doDebounceSaveForm(form);
    };

    const autoSaveForm = async (newForm: SurveyForm) => {
        try {
            await putSurvey(newForm);
            setAutoSaveNotificationOpen(true);
        } catch (error) {
            return;
        }
    };

    const doSaveForm = async () => {
        await putSurvey({
            id: String(surveyId),
            form_json: formData,
            name: name,
            is_hidden: isHiddenSurvey,
            is_template: isTemplateSurvey,
        });
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
            await doSaveForm();
            dispatch(
                openNotification({
                    severity: 'success',
                    text: savedSurvey.engagement?.id
                        ? `Survey was successfully added to engagement`
                        : 'The survey was successfully built',
                }),
            );

            navigate(`/surveys/${savedSurvey.id}/report`);
        } catch (error) {
            setIsSaving(false);
            if (axios.isAxiosError(error)) {
                dispatch(
                    openNotification({
                        severity: 'error',
                        text: error.response?.data.message,
                    }),
                );
            } else {
                dispatch(
                    openNotification({
                        severity: 'error',
                        text: 'Error occurred while saving survey',
                    }),
                );
            }
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
                <Stack direction="row">
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <PermissionsGate scopes={[USER_ROLES.CREATE_SURVEY]} errorProps={{ disabled: true }}>
                                    <Switch
                                        checked={isTemplateSurvey}
                                        disabled={Boolean(savedSurvey?.engagement_id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setIsTemplateSurvey(true);
                                                return;
                                            }
                                            setIsTemplateSurvey(false);
                                        }}
                                    />
                                </PermissionsGate>
                            }
                            label="Save as a Template"
                        />
                    </FormGroup>
                    <Tooltip
                        title="When you toggle ON this option and save your Survey, your Survey will become a Template. As long as this option is on, the Template can be cloned (and then edited) but can't be attached directly to an Engagement."
                        placement="top"
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    bgcolor: '#003366',
                                    color: 'white',
                                },
                            },
                        }}
                    >
                        <IconButton>
                            <HelpIcon sx={{ fontSize: 20, color: `${Palette.primary.main}` }} />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Stack direction="row">
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <PermissionsGate scopes={[USER_ROLES.CREATE_SURVEY]} errorProps={{ disabled: true }}>
                                    <Switch
                                        checked={isHiddenSurvey}
                                        disabled={Boolean(savedSurvey?.engagement_id)}
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
                    <Tooltip
                        title="When you toggle ON this option and save your Survey, your Survey will be 'Hidden'. When the toggle is ON and as long as the survey is not attached to an engagement, the Survey will only be visible to Administrators. When you are ready to make it available and able to be cloned or attached to an engagement, change the toggle to OFF and click the Save button."
                        placement="top"
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    bgcolor: '#003366',
                                    color: 'white',
                                },
                            },
                        }}
                    >
                        <IconButton>
                            <HelpIcon sx={{ fontSize: 20, color: `${Palette.primary.main}` }} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <PrimaryButton disabled={!formData} loading={isSaving} onClick={handleSaveForm}>
                        {'Report Settings'}
                    </PrimaryButton>
                    <SecondaryButton onClick={() => navigate('/surveys')}>Cancel</SecondaryButton>
                </Stack>
            </Grid>
            <AutoSaveSnackBar
                open={autoSaveNotificationOpen}
                handleClose={() => {
                    setAutoSaveNotificationOpen(false);
                }}
            />
        </MetPageGridContainer>
    );
};

export default SurveyFormBuilder;
