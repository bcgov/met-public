import React, { useState, useContext } from 'react';
import { Grid, InputAdornment, TextField, Tooltip } from '@mui/material';
import { MetLabel, MetPaper, PrimaryButton, MetBody, MetHeader4 } from '../../../common';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { ActionContext } from '../ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { EngagementTabsContext } from './EngagementTabsContext';

const EngagementSettings = () => {
    const { savedEngagement } = useContext(ActionContext);
    const { engagementFormData, setEngagementFormData } = useContext(EngagementTabsContext);
    const { projectName, projectNumber, projectType, clientName, applicationNumber } = engagementFormData;

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
                    <MetHeader4>Engagement Details</MetHeader4>
                </Grid>
                <Grid item xs={12} lg={6} p={1}>
                    <MetLabel>Project/Mine Name</MetLabel>
                    <TextField
                        id="project-name"
                        name="projectName"
                        value={projectName}
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} lg={6} p={1}>
                    <MetLabel>Client/Proponent</MetLabel>
                    <TextField
                        id="client-name"
                        name="clientName"
                        value={clientName}
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} lg={6} p={1}>
                    <MetLabel>Project/Mine #</MetLabel>
                    <TextField
                        id="project-number"
                        name="projectNumber"
                        value={projectNumber}
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} lg={6} p={1}>
                    <MetLabel>Project/Mine Type</MetLabel>
                    <TextField
                        id="project-type"
                        name="projectType"
                        value={projectType}
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6} lg={6} p={1}>
                    <MetLabel>Application #</MetLabel>
                    <TextField
                        id="application-number"
                        name="applicationNumber"
                        value={applicationNumber}
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} mt={5}>
                    <MetLabel>Engagement Link</MetLabel>
                </Grid>
                <Grid item xs={12}>
                    <MetBody>
                        This is the link to the public engagement and will only be accessible once the engagement is
                        published.
                    </MetBody>
                </Grid>
                <Grid item xs={12} lg={9}>
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
                                            <PrimaryButton variant="contained" disableElevation onClick={handleCopyUrl}>
                                                <ContentCopyIcon />
                                            </PrimaryButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Tooltip>
                    </ClickAwayListener>
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default EngagementSettings;
