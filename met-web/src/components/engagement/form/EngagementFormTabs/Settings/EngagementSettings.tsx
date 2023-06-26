import React, { useContext } from 'react';
import { Grid, MenuItem, TextField, Select, SelectChangeEvent, FormControlLabel, Switch, Divider } from '@mui/material';
import { MetLabel, MetPaper, PrimaryButton, MetHeader4, MetBody } from '../../../../common';
import { ActionContext } from '../../ActionContext';
import { EngagementTabsContext } from '../EngagementTabsContext';
import { AppConfig } from 'config';
import { INTERNAL_EMAIL_DOMAIN } from 'constants/emailVerification';
import { EngagementSlug } from './EngagementSlug';

const EngagementSettings = () => {
    const { handleUpdateEngagementMetadataRequest, isSaving, savedEngagement, engagementId } =
        useContext(ActionContext);
    const { engagementFormData, setEngagementFormData } = useContext(EngagementTabsContext);
    const { project_id, project_metadata, is_internal } = engagementFormData;
    const { engagementProjectTypes } = AppConfig.constants;

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
                <Grid item xs={12}>
                    <PrimaryButton
                        data-testid="update-engagement-button"
                        sx={{ marginRight: 1 }}
                        onClick={() => handleUpdateEngagementSettings()}
                        disabled={isSaving}
                        loading={isSaving}
                    >
                        Save
                    </PrimaryButton>
                    <Divider sx={{ mt: '1em' }} />
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
                    <EngagementSlug />
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default EngagementSettings;
