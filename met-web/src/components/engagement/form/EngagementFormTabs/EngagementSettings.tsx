import React, { useState, useContext } from 'react';
import {
    Grid,
    InputAdornment,
    MenuItem,
    TextField,
    Select,
    Tooltip,
    SelectChangeEvent,
    FormControlLabel,
    Switch,
    Divider,
} from '@mui/material';
import {
    MetLabel,
    MetPaper,
    PrimaryButton,
    SecondaryButton,
    MetHeader4,
    MetDescription,
    MetBody,
} from '../../../common';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { ActionContext } from '../ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { EngagementTabsContext } from './EngagementTabsContext';
import { AppConfig } from 'config';
import { INTERNAL_EMAIL_DOMAIN } from 'constants/emailVerification';

const EngagementSettings = () => {
    const { handleUpdateEngagementMetadataRequest, isSaving, savedEngagement, engagementId } =
        useContext(ActionContext);
    const { engagementFormData, setEngagementFormData } = useContext(EngagementTabsContext);
    const { project_id, project_metadata, is_internal } = engagementFormData;
    const { engagementProjectTypes } = AppConfig.constants;
    const dispatch = useAppDispatch();

    const newEngagement = !savedEngagement.id || isNaN(Number(savedEngagement.id));
    const engagementUrl = newEngagement
        ? 'Link will appear when the engagement is saved'
        : `${window.location.origin}/engagements/${savedEngagement.id}/view`;

    const [copyTooltip, setCopyTooltip] = useState(false);

    const handleTooltipClose = () => {
        setCopyTooltip(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setEngagementFormData({
            ...engagementFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handleChangeIsInternal = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setEngagementFormData({
            ...engagementFormData,
            is_internal: checked,
        });
    };

    const handleChangeMetadata = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent) => {
        setEngagementFormData({
            ...engagementFormData,
            project_metadata: {
                ...project_metadata,
                [e.target.name]: e.target.value,
            },
        });
    };

    const handleCopyUrl = () => {
        if (newEngagement) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Engagement link can only be copied after the engagement is saved',
                }),
            );
            return;
        }
        setCopyTooltip(true);
        navigator.clipboard.writeText(engagementUrl);
    };

    const handleUpdateEngagementSettings = async () => {
        await handleUpdateEngagementMetadataRequest({
            ...engagementFormData,
            engagement_id: Number(engagementId),
        });

        return savedEngagement;
    };

    return (
        <MetPaper elevation={1}>
            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={1}
                sx={{ padding: '2em' }}
            >
                <Grid item xs={12} mb={1}>
                    <MetHeader4 bold>Engagement Information</MetHeader4>
                </Grid>
                <Grid item xs={12} lg={6} p={1}>
                    <MetLabel>Project Name</MetLabel>
                    <TextField
                        id="project-name"
                        name="project_name"
                        label=" "
                        InputLabelProps={{
                            shrink: false,
                        }}
                        value={project_metadata.project_name}
                        variant="outlined"
                        fullWidth
                        onChange={handleChangeMetadata}
                    />
                </Grid>
                <Grid item xs={12} lg={6} p={1}>
                    <MetLabel>Client/Proponent</MetLabel>
                    <TextField
                        id="client-name"
                        name="client_name"
                        value={project_metadata.client_name}
                        variant="outlined"
                        fullWidth
                        onChange={handleChangeMetadata}
                    />
                </Grid>
                <Grid item xs={12} lg={6} p={1}>
                    <MetLabel>Project #</MetLabel>
                    <TextField
                        id="project-id"
                        name="project_id"
                        value={project_id}
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} lg={6} p={1}>
                    <MetLabel>Project Type</MetLabel>
                    <Select
                        id="project-type"
                        name="type"
                        variant="outlined"
                        label=" "
                        defaultValue=""
                        value={project_metadata.type}
                        fullWidth
                        size="small"
                        onChange={handleChangeMetadata}
                    >
                        <MenuItem value={''} sx={{ fontStyle: 'italic', height: '2em' }}>
                            none
                        </MenuItem>
                        {engagementProjectTypes.map((type: string) => {
                            return (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </Grid>
                <Grid item xs={6} lg={6} p={1}>
                    <MetLabel>Application #</MetLabel>
                    <TextField
                        id="application-number"
                        name="application_number"
                        value={project_metadata.application_number}
                        variant="outlined"
                        fullWidth
                        onChange={handleChangeMetadata}
                    />
                </Grid>
                <Grid item xs={12} mt={5} mb={1}>
                    <MetHeader4 bold>Engagement Settings</MetHeader4>
                </Grid>
                <Grid item xs={12}>
                    <MetBody>
                        This will make the engagement only available to people requesting access from a{' '}
                        {INTERNAL_EMAIL_DOMAIN} email address and will not show on the engagement home page.
                    </MetBody>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={<Switch name="is_internal" checked={is_internal} onChange={handleChangeIsInternal} />}
                        label={<MetLabel>Set-up as Internal Engagement</MetLabel>}
                    />
                </Grid>
                <Grid item xs={12} mt={1}>
                    <MetLabel>Engagement Link</MetLabel>
                    <MetDescription>
                        This is the link to the public engagement and will only be accessible once the engagement is
                        published.
                    </MetDescription>
                    <ClickAwayListener onClickAway={handleTooltipClose}>
                        <Tooltip
                            title="Link copied!"
                            PopperProps={{
                                disablePortal: true,
                            }}
                            onClose={handleTooltipClose}
                            open={copyTooltip}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            placement="right"
                        >
                            <TextField
                                id="engagement-name"
                                variant="outlined"
                                label=" "
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                fullWidth
                                value={engagementUrl}
                                disabled
                                sx={{
                                    '.MuiInputBase-input': {
                                        marginRight: 0,
                                        padding: '0 0 0 1em',
                                    },
                                    '.MuiInputBase-root': {
                                        padding: 0,
                                    },
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" sx={{ height: '100%', maxHeight: '100%' }}>
                                            <SecondaryButton
                                                variant="contained"
                                                disableElevation
                                                onClick={handleCopyUrl}
                                            >
                                                <ContentCopyIcon />
                                            </SecondaryButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Tooltip>
                    </ClickAwayListener>
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ mt: '1em', mb: '1em' }} />
                    <PrimaryButton
                        data-testid="update-engagement-button"
                        sx={{ marginRight: 1 }}
                        onClick={() => handleUpdateEngagementSettings()}
                        disabled={isSaving}
                        loading={isSaving}
                    >
                        Save
                    </PrimaryButton>
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default EngagementSettings;
