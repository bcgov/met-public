import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClickAwayListener, Grid, Stack, InputAdornment, TextField, Tooltip } from '@mui/material';
import {
    MetHeader3,
    MetLabel,
    MetPageGridContainer,
    MetPaper,
    PrimaryButton,
    SecondaryButton,
} from 'components/common';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ReportSettingsContext } from './ReportSettingsContext';
import SettingsTable from './SettingsTable';
import SearchBar from './SearchBar';
import { getBaseUrl } from 'helper';

const SettingsForm = () => {
    const { setSavingSettings, savingSettings, engagementSlug, loadingEngagementSlug, survey } =
        useContext(ReportSettingsContext);

    const navigate = useNavigate();

    const [copyTooltip, setCopyTooltip] = useState(false);

    const baseUrl = getBaseUrl();
    const engagementUrl = !survey?.engagement_id
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
        <MetPageGridContainer container spacing={1}>
            <Grid item xs={12}>
                <MetHeader3 bold>Report Settings</MetHeader3>
            </Grid>
            <Grid item xs={12}>
                <MetPaper
                    sx={{
                        padding: '3rem',
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <MetLabel>Link to Public Dashboard Report</MetLabel>

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
                                        disabled={true}
                                        value={loadingEngagementSlug ? 'Loading...' : engagementUrl}
                                        sx={{
                                            '.MuiInputBase-input': {
                                                marginRight: 0,
                                            },
                                            '.MuiInputBase-root': {
                                                padding: 0,
                                            },
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    sx={{ height: '100%', maxHeight: '100%' }}
                                                >
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
                            <MetLabel>Select the questions you would like to display on the public report</MetLabel>
                        </Grid>
                        <Grid item xs={6}>
                            <SearchBar />
                        </Grid>
                        <Grid item xs={12}>
                            <SettingsTable />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2}>
                                <PrimaryButton
                                    data-testid={'survey/report/save-button'}
                                    onClick={() => setSavingSettings(true)}
                                    loading={savingSettings}
                                >
                                    Save
                                </PrimaryButton>
                                <SecondaryButton onClick={() => navigate(`/surveys/${survey?.id}/build`)}>
                                    Back
                                </SecondaryButton>
                            </Stack>
                        </Grid>
                    </Grid>
                </MetPaper>
            </Grid>
        </MetPageGridContainer>
    );
};

export default SettingsForm;
