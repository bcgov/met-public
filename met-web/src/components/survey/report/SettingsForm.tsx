import React, { useContext } from 'react';
import { ClickAwayListener, FormControlLabel, Grid, InputAdornment, Switch, TextField, Tooltip } from '@mui/material';
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

const SettingsForm = () => {
    const { setSavingSettings, savingSettings } = useContext(ReportSettingsContext);

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
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch defaultChecked />}
                                label="Send report to all participants at the end of the engagement period"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <MetLabel>Link to Public Dashboard Report</MetLabel>

                            <ClickAwayListener
                                onClickAway={() => {
                                    /**/
                                }}
                            >
                                <Tooltip
                                    title="Link copied!"
                                    PopperProps={{
                                        disablePortal: true,
                                    }}
                                    // onClose={handleTooltipClose}
                                    // open={copyTooltip}
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
                                        // disabled={!savedSlug}
                                        // value={slug}
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
                                                        // onClick={handleCopyUrl}
                                                    >
                                                        <ContentCopyIcon />
                                                    </SecondaryButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        disabled
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
                            <PrimaryButton onClick={() => setSavingSettings(true)} loading={savingSettings}>
                                Save
                            </PrimaryButton>
                        </Grid>
                    </Grid>
                </MetPaper>
            </Grid>
        </MetPageGridContainer>
    );
};

export default SettingsForm;
