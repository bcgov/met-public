import React, { useState, useContext, useEffect } from 'react';
import { InputAdornment, TextField, Tooltip, Grid, Divider } from '@mui/material';
import { SecondaryButton, MetDescription, PrimaryButton, MetHeader4 } from 'components/common';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { ActionContext } from 'components/engagement/form/ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { getSlugByEngagementId, patchEngagementSlug } from 'services/engagementSlugService';
import axios from 'axios';

export const EngagementSlug = () => {
    const dispatch = useAppDispatch();

    const { savedEngagement } = useContext(ActionContext);

    const [savedSlug, setSavedSlug] = useState('');
    const [slug, setSlug] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [copyTooltip, setCopyTooltip] = useState(false);

    const handleTooltipClose = () => {
        setCopyTooltip(false);
    };
    const newEngagement = !savedEngagement.id || isNaN(Number(savedEngagement.id));
    const baseUrl = sessionStorage.getItem('appBaseUrl') || window.location.origin;

    const engagementUrl = !savedSlug ? 'Link will appear when the engagement is saved' : `${baseUrl}/${slug}`;

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

    const handleGetSlug = async () => {
        if (!savedEngagement.id) return;

        try {
            const response = await getSlugByEngagementId(savedEngagement.id);
            setSavedSlug(response.slug);
            setSlug(response.slug);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Failed to get slug',
                }),
            );
        }
    };

    useEffect(() => {
        handleGetSlug();
    }, [savedEngagement.id]);

    const handleSaveSlug = async () => {
        if (!savedEngagement.id || savedSlug === slug) return;
        setIsSaving(true);
        try {
            const response = await patchEngagementSlug({
                engagement_id: savedEngagement.id,
                slug: slug,
            });
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Engagement link was successfully saved',
                }),
            );
            setSavedSlug(response.slug);
            setIsSaving(false);
        } catch (error) {
            setIsSaving(false);
            if (axios.isAxiosError(error)) {
                console.log(error.response);
                dispatch(
                    openNotification({
                        severity: 'error',
                        text: error.response?.data.message || 'Failed to update engagement link',
                    }),
                );
            } else {
                dispatch(
                    openNotification({
                        severity: 'error',
                        text: 'Failed to update engagement link',
                    }),
                );
            }
        }
    };

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={3}>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <MetHeader4 bold>Engagement Link</MetHeader4>
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
                            disabled={!savedSlug}
                            value={slug}
                            sx={{
                                '.MuiInputBase-input': {
                                    marginRight: 0,
                                },
                                '.MuiInputBase-root': {
                                    padding: 0,
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ height: '100%', maxHeight: '100%' }}>
                                        <SecondaryButton variant="contained" disableElevation disabled>
                                            {baseUrl}/
                                        </SecondaryButton>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end" sx={{ height: '100%', maxHeight: '100%' }}>
                                        <SecondaryButton variant="contained" disableElevation onClick={handleCopyUrl}>
                                            <ContentCopyIcon />
                                        </SecondaryButton>
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => {
                                setSlug(e.target.value);
                            }}
                        />
                    </Tooltip>
                </ClickAwayListener>
            </Grid>
            <Grid item xs={12}>
                <PrimaryButton
                    data-testid="update-engagement-button"
                    sx={{ marginRight: 1 }}
                    onClick={() => handleSaveSlug()}
                    disabled={isSaving}
                    loading={isSaving}
                >
                    Save
                </PrimaryButton>
                <Divider sx={{ mt: '1em' }} />
            </Grid>
        </Grid>
    );
};
