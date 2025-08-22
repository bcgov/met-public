import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useNavigate, useAsyncValue, useRouteLoaderData, Await, useRevalidator } from 'react-router-dom';
import { Survey } from 'models/survey';
import FormBuilderSkeleton from './FormBuilderSkeleton';
import { Engagement } from 'models/engagement';
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
    Avatar,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormBuilder from 'components/Form/FormBuilder';
import { putSurvey } from 'services/surveyService';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { MetHeader3, MetPageGridContainer, MetTooltip } from 'components/common';
import { FormBuilderData } from 'components/Form/types';
import { EngagementStatus } from 'constants/engagementStatus';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';
import { Palette, colors } from 'styles/Theme';
import { PermissionsGate } from 'components/permissionsGate';
import { USER_ROLES } from 'services/userService/constants';
import axios from 'axios';
import { AutoSaveSnackBar } from './AutoSaveSnackBar';
import { debounce } from 'lodash';
import { Button } from 'components/common/Input';
import { Controller, useForm } from 'react-hook-form';
import {
    faCircleQuestion,
    faPen,
    faPenSlash,
    faCloudArrowUp,
    faCloudCheck,
    faCloudXmark,
} from '@fortawesome/pro-regular-svg-icons';
import { Else, If, Then } from 'react-if';
import UnsavedWorkConfirmation from 'components/common/Navigation/UnsavedWorkConfirmation';

interface SurveyForm {
    id: string;
    form_json: FormBuilderData;
    name: string;
    is_hidden?: boolean;
    is_template?: boolean;
}

export const FormBuilderPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const revalidator = useRevalidator();

    const [survey, engagement] = useAsyncValue() as [Survey, Engagement];
    const [formDefinition, setFormDefinition] = useState(survey.form_json);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);
    const [saveError, setSaveError] = useState(false);

    const {
        control,
        formState: { isSubmitting, isDirty },
        handleSubmit,
        reset,
        watch,
    } = useForm<Omit<SurveyForm, 'form_json'>>({
        defaultValues: {
            id: survey.id.toString(),
            name: survey.name,
            is_hidden: survey.is_hidden,
            is_template: survey.is_template,
        },
    });

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            // Auto save form when any field changes
            if (type === 'change') {
                setHasChanged(true);
                debounceAutoSaveForm(formDefinition);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const name = watch('name');
    const hasUnsavedWork = (isDirty || isFormDirty) && !isSubmitting;

    const isMultiPage = formDefinition?.display === 'wizard';

    const hasEngagement = Boolean(survey?.engagement_id);
    const isEngagementDraft = engagement?.status_id === EngagementStatus.Draft;
    const hasPublishedEngagement = hasEngagement && !isEngagementDraft;

    const [isEditingName, setIsEditingName] = useState(false);
    const [autoSaveNotificationOpen, setAutoSaveNotificationOpen] = useState(false);

    const AUTO_SAVE_INTERVAL = 5 * 1000;

    useEffect(() => {
        if (hasPublishedEngagement) {
            dispatch(
                openNotification({
                    severity: 'warning',
                    text: 'Engagement already published. Please be careful while editing the survey.',
                }),
            );
        }
    }, [hasPublishedEngagement, dispatch]);

    const debounceAutoSaveForm = useRef(debounce((data) => autoSaveForm(data), AUTO_SAVE_INTERVAL)).current;
    const autoSaveForm = async (formDef: FormBuilderData) => {
        try {
            await handleSubmit(async (data: Omit<SurveyForm, 'form_json'>) => {
                const result = await putSurvey({
                    ...data,
                    form_json: formDef,
                });
                reset(result as Omit<SurveyForm, 'form_json' | 'id'>);
                setAutoSaveNotificationOpen(true);
                setIsFormDirty(false);
            })();
            setSaveError(false);
        } catch {
            setSaveError(true);
        }
    };

    const hasMounted = useRef(false);

    const onEditorChange = (form: FormBuilderData) => {
        if (!hasMounted.current) {
            // Skip the first call to onEditorChange - it's the initial form load;
            // we don't want to send it back to the server right away
            hasMounted.current = true;
            return;
        }
        setIsFormDirty(true);
        setFormDefinition(form);

        if (!form.components) {
            return;
        }
        setHasChanged(true);
        debounceAutoSaveForm(form);
    };

    const formSubmitHandler = async (data: Omit<SurveyForm, 'form_json'>) => {
        try {
            if (hasUnsavedWork) {
                await putSurvey({
                    ...data,
                    id: survey.id.toString(),
                    form_json: formDefinition,
                });
                dispatch(
                    openNotification({
                        severity: 'success',
                        text: survey.engagement?.id
                            ? `Survey was successfully added to engagement`
                            : 'The survey was successfully built',
                    }),
                );
            }
            if (hasChanged) revalidator.revalidate();
            navigate(`/surveys/${survey.id}/report`);
        } catch (error) {
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
            <UnsavedWorkConfirmation blockNavigationWhen={hasUnsavedWork} />
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-start" alignItems="center">
                    <If condition={isEditingName}>
                        <Then>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        autoFocus
                                        onBlur={() => {
                                            setIsEditingName(false);
                                        }}
                                    />
                                )}
                            />
                            <IconButton
                                onClick={() => {
                                    setIsEditingName(!isEditingName);
                                }}
                                color="inherit"
                            >
                                <FontAwesomeIcon icon={faPenSlash} style={{ fontSize: '20px' }} />
                            </IconButton>
                        </Then>
                        <Else>
                            <MetHeader3
                                sx={{ p: 0.5, cursor: 'pointer' }}
                                onClick={() => {
                                    setIsEditingName(true);
                                }}
                            >
                                {name}
                            </MetHeader3>
                            <IconButton
                                size="small"
                                onClick={() => {
                                    setIsEditingName(!isEditingName);
                                }}
                                color="inherit"
                            >
                                <FontAwesomeIcon icon={faPen} style={{ fontSize: '1rem' }} />
                            </IconButton>
                        </Else>
                    </If>
                    <SaveStatusIndicator hasUnsavedWork={hasUnsavedWork} saveError={saveError} />
                </Stack>
                <Divider />
            </Grid>
            <Grid item>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isMultiPage}
                                onChange={() => {
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
                                                    onEditorChange({
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
                <FormBuilder handleFormChange={onEditorChange} savedForm={formDefinition} />
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row">
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <PermissionsGate scopes={[USER_ROLES.CREATE_SURVEY]} errorProps={{ disabled: true }}>
                                    <Controller
                                        name="is_template"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch disabled={hasEngagement} checked={field.value} {...field} />
                                        )}
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
                            <FontAwesomeIcon
                                icon={faCircleQuestion}
                                style={{ fontSize: '18px', color: `${Palette.primary.main}` }}
                            />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Stack direction="row">
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <PermissionsGate scopes={[USER_ROLES.CREATE_SURVEY]} errorProps={{ disabled: true }}>
                                    <Controller
                                        name="is_hidden"
                                        control={control}
                                        render={({ field }) => <Switch checked={field.value} {...field} />}
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
                            <FontAwesomeIcon
                                icon={faCircleQuestion}
                                style={{ fontSize: '18px', color: `${Palette.primary.main}` }}
                            />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <Button variant="primary" disabled={!formDefinition} onClick={handleSubmit(formSubmitHandler)}>
                        Report Settings
                    </Button>
                    <Button variant="secondary" href="/surveys">
                        Cancel
                    </Button>
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

const SaveStatusIndicator = ({ hasUnsavedWork, saveError }: { hasUnsavedWork: boolean; saveError: boolean }) => {
    const saveStatusData = () => {
        if (saveError)
            return {
                icon: faCloudXmark,
                color: colors.notification.error.icon,
                tint: colors.notification.error.tint,
                text: 'Error saving',
            };
        if (hasUnsavedWork)
            return {
                icon: faCloudArrowUp,
                color: colors.notification.warning.icon,
                tint: colors.notification.warning.tint,
                text: 'Saving...',
            };
        return {
            icon: faCloudCheck,
            color: colors.notification.success.icon,
            tint: colors.notification.success.tint,
            text: 'Saved',
        };
    };
    const { icon, color, tint, text } = saveStatusData();
    return (
        <MetTooltip title={text}>
            <Avatar
                sizes="small"
                sx={{
                    fontSize: '16px',
                    width: 24,
                    height: 24,
                    background: tint,
                    color: color,
                }}
            >
                <FontAwesomeIcon icon={icon} />
            </Avatar>
        </MetTooltip>
    );
};

const SurveyFormBuilder = () => {
    const { survey: surveyPromise, engagement: engagementPromise } = useRouteLoaderData('survey') as {
        survey: Promise<Survey>;
        engagement: Promise<Engagement>;
    };

    const surveyDataPromise = Promise.all([surveyPromise, engagementPromise]);

    return (
        <Suspense fallback={<FormBuilderSkeleton />}>
            <Await resolve={surveyDataPromise}>
                <FormBuilderPage />
            </Await>
        </Suspense>
    );
};

export default SurveyFormBuilder;
