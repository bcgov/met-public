import React, { Suspense, useState } from 'react';
import { Await, useAsyncValue, useNavigate, useRouteLoaderData } from 'react-router-dom';
import { ClickAwayListener, Grid, Stack, InputAdornment, Tooltip, Skeleton } from '@mui/material';
import { MetHeader3, MetLabel, MetPageGridContainer, MetPaper } from 'components/common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/pro-regular-svg-icons/faCopy';
import SettingsTable from './SettingsTable';
import SearchBar from './SearchBar';
import { getBaseUrl } from 'helper';
import { Button, FormField, TextInput } from 'components/common/Input';
import { Survey } from 'models/survey';
import { SurveyReportSetting } from 'models/surveyReportSetting';
import MetTable from 'components/common/Table';
import { Engagement } from 'models/engagement';
import { updateSurveyReportSettings } from 'services/surveyService/reportSettingsService';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { updatedDiff } from 'deep-object-diff';

const SettingsFormPage = () => {
    const { survey, slug, engagement } = useRouteLoaderData('survey') as {
        survey: Promise<Survey>;
        slug: Promise<{ slug: string }>;
        engagement: Promise<Engagement>;
    };

    return (
        <MetPageGridContainer container spacing={1}>
            <Grid item xs={12}>
                <MetHeader3 bold>Report Settings</MetHeader3>
            </Grid>
            <Grid item xs={12}>
                <MetPaper sx={{ padding: '3rem' }}>
                    <Suspense fallback={SettingsFormSkeleton}>
                        <Await resolve={Promise.all([survey, slug, engagement])}>
                            <SettingsForm />
                        </Await>
                    </Suspense>
                </MetPaper>
            </Grid>
        </MetPageGridContainer>
    );
};

const SettingsForm = () => {
    const [survey, slug] = useAsyncValue() as [Survey, { slug: string }, SurveyReportSetting[]];
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { reportSettings } = useRouteLoaderData('survey') as { reportSettings: Promise<SurveyReportSetting[]> };

    const engagementSlug = slug?.slug;

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [displayedSettings, setDisplayedSettings] = useState<{ [key: number]: boolean }>({});
    const [copyTooltip, setCopyTooltip] = useState(false);

    const handleNavigateOnSave = () => {
        if (survey?.engagement_id) {
            navigate(`/engagements/${survey.engagement_id}/form`);
            return;
        }
        navigate(`/surveys`);
    };

    const handleSaveSettings = async () => {
        const surveyReportSettings = await reportSettings; // Should resolve immediately
        const currentSettings = surveyReportSettings.map((setting) => {
            return {
                ...setting,
                display: displayedSettings[setting.id],
            };
        });
        const diff = updatedDiff(surveyReportSettings, currentSettings);
        const diffKeys = Object.keys(diff);
        const updatedSettings = diffKeys.map((key) => currentSettings[Number(key)]);

        if (!surveyReportSettings.length) {
            handleNavigateOnSave();
            return;
        }

        try {
            await updateSurveyReportSettings(survey.id.toString(), updatedSettings);
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Settings saved successfully.',
                }),
            );
            handleNavigateOnSave();
        } catch {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while saving settings. Please try again.',
                }),
            );
        }
    };

    const baseUrl = getBaseUrl();
    const engagementUrl = !engagementSlug
        ? 'Link will appear when the survey is linked to an engagement'
        : `${baseUrl}/${engagementSlug}/dashboard/public`;

    const handleTooltipClose = () => {
        setCopyTooltip(false);
    };

    const handleCopyUrl = () => {
        if (!engagementSlug) return;
        setCopyTooltip(true);
        navigator.clipboard.writeText(engagementUrl);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <FormField title="Link to Public Dashboard Report">
                    <Tooltip
                        title="Link copied!"
                        PopperProps={{
                            disablePortal: true,
                            sx: {
                                pointerEvents: 'none',
                                '.MuiTooltip-tooltip': { backgroundColor: 'primary.main' },
                            },
                        }}
                        onClose={handleTooltipClose}
                        open={copyTooltip}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        placement="top-end"
                    >
                        <div style={{ width: '100%' }}>
                            <TextInput
                                fullWidth
                                id="engagement-name"
                                disabled
                                value={engagementUrl}
                                sx={{
                                    '.MuiInputBase-input': {
                                        marginRight: 0,
                                    },
                                    '.MuiInputBase-root': {
                                        padding: 0,
                                    },
                                }}
                                endAdornment={
                                    engagementSlug && (
                                        <ClickAwayListener onClickAway={handleTooltipClose}>
                                            <InputAdornment position="end" sx={{ height: '100%', maxHeight: '100%' }}>
                                                <Button
                                                    sx={{ borderRadius: '0 8px 8px 0px', marginRight: '-1rem' }}
                                                    variant="secondary"
                                                    disableElevation
                                                    onClick={handleCopyUrl}
                                                >
                                                    <FontAwesomeIcon icon={faCopy} style={{ fontSize: '20px' }} />
                                                </Button>
                                            </InputAdornment>
                                        </ClickAwayListener>
                                    )
                                }
                            />
                        </div>
                    </Tooltip>
                </FormField>
            </Grid>
            <Grid item xs={6}>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </Grid>
            <Grid item xs={12}>
                <MetLabel>Select the questions you would like to display on the public report</MetLabel>
            </Grid>
            <Grid item xs={12}>
                <Suspense fallback={<Skeleton variant="rectangular" height="10em" width="100%" />}>
                    <Await resolve={reportSettings}>
                        <SettingsTable
                            displayedMap={displayedSettings}
                            setDisplayedMap={setDisplayedSettings}
                            searchTerm={searchTerm}
                        />
                    </Await>
                </Suspense>
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <Button variant="primary" onClick={handleSaveSettings} data-testid="survey/report/save-button">
                        Save
                    </Button>
                    <Button variant="secondary" onClick={() => navigate(`/surveys/${survey?.id}/build`)}>
                        Back
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
};

const SettingsFormSkeleton = (
    <Grid container spacing={2}>
        <Grid item xs={6}>
            <FormField title="Link to Public Dashboard Report">
                <Skeleton variant="rectangular" style={{ width: '100%', borderRadius: '8px' }} height={48} />
            </FormField>
        </Grid>
        <Grid item xs={6}>
            <FormField title="Search by Name">
                <Skeleton variant="rectangular" style={{ width: '100%', borderRadius: '8px' }} height={48} />
            </FormField>
        </Grid>
        <Grid item xs={12}>
            <MetLabel>Select the questions you would like to display on the public report</MetLabel>
        </Grid>
        <Grid item xs={12}>
            <MetTable
                headCells={[
                    { label: 'Include in report', disablePadding: false, key: 1, numeric: false, allowSort: false },
                    { label: 'Question', disablePadding: false, key: 2, numeric: false, allowSort: false },
                    { label: 'Question Type', disablePadding: false, key: 3, numeric: false, allowSort: false },
                ]}
                rows={[]}
                loading
            ></MetTable>
        </Grid>
    </Grid>
);

export default SettingsFormPage;
