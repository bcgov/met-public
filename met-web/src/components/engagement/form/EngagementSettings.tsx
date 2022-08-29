import React, { useState, useContext } from 'react';
import { Grid, InputAdornment, TextField, Tooltip, Typography } from '@mui/material';
import { MetLabel, MetPaper, PrimaryButton, MetBody } from '../../common';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { ActionContext } from './ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

const EngagementSettings = () => {
    const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();

    const newEngagement = !savedEngagement.id || isNaN(Number(savedEngagement.id));
    const engagementUrl = newEngagement
        ? 'Link will appear when the engagement is saved'
        : `${window.location.origin}/engagement/view/${savedEngagement.id}`;

    const [copyTooltip, setCopyTooltip] = useState(false);

    const handleTooltipClose = () => {
        setCopyTooltip(false);
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
        <Grid item lg={8} xs={12}>
            <MetPaper elevation={1}>
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={1}
                    sx={{ padding: '2em' }}
                >
                    <Grid item xs={12}>
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
                                                <PrimaryButton
                                                    variant="contained"
                                                    disableElevation
                                                    onClick={handleCopyUrl}
                                                >
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
        </Grid>
    );
};

export default EngagementSettings;
