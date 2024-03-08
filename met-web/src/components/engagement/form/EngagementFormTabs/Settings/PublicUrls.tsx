import React, { useState, useContext, useEffect } from 'react';
import { InputAdornment, TextField, Tooltip, Grid, useTheme } from '@mui/material';
import { SecondaryButton, MetDescription, MetHeader4, MetSmallText, MetLabel } from 'components/common';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { ActionContext } from 'components/engagement/form/ActionContext';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { When } from 'react-if';
import { getBaseUrl } from 'helper';
import { EngagementTabsContext } from '../EngagementTabsContext';

export const PublicUrls = () => {
    const dispatch = useAppDispatch();
    const theme = useTheme();

    const { savedEngagement } = useContext(ActionContext);
    const { savedSlug, slug, setSlug } = useContext(EngagementTabsContext);

    const [copyTooltipEngagementLink, setCopyTooltipEngagementLink] = useState(false);
    const [copyTooltipDashboardLink, setCopyTooltipDashboardLink] = useState(false);
    const [backendError, setBackendError] = useState('');

    const newEngagement = !savedEngagement.id || isNaN(Number(savedEngagement.id));
    const baseUrl = getBaseUrl();
    const calculatedWidth = baseUrl ? `${baseUrl.length * 9}px` : '200px';
    const engagementUrl = !savedSlug ? 'Link will appear when the engagement is saved' : `${baseUrl}/${savedSlug}`;
    const dashboardUrl = !savedSlug
        ? 'Link will appear when the engagement is saved'
        : `${engagementUrl}/dashboard/public`;
    const [initialSlug, setInitialSlug] = useState('');

    useEffect(() => {
        setInitialSlug(slug.slug || savedSlug);
    }, [slug, savedSlug]);

    const handleCopyUrl = (url: string) => {
        if (newEngagement) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Link can only be copied after the engagement is saved',
                }),
            );
            return;
        }
        navigator.clipboard.writeText(url);
    };

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={3}>
            <Grid item xs={12}>
                <MetHeader4 bold>{'Public URLs (links)'}</MetHeader4>
            </Grid>
            <Grid item xs={12}>
                <MetLabel>Link to Public Engagement Page</MetLabel>
                <MetDescription>
                    This is the link to the engagement. You can edit the link anytime before the engagement is
                    published. The link will become active when the engagement is published.
                </MetDescription>
                <ClickAwayListener
                    onClickAway={() => {
                        setCopyTooltipEngagementLink(false);
                    }}
                >
                    <Tooltip
                        title="Link copied!"
                        PopperProps={{
                            disablePortal: true,
                        }}
                        open={copyTooltipEngagementLink}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        placement="right"
                    >
                        <TextField
                            id="engagement-link"
                            variant="outlined"
                            label=" "
                            InputLabelProps={{
                                shrink: false,
                            }}
                            fullWidth
                            disabled={!savedSlug}
                            value={initialSlug}
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
                                    <InputAdornment
                                        position="start"
                                        disablePointerEvents
                                        sx={{
                                            height: '100%',
                                            maxHeight: '100%',
                                        }}
                                    >
                                        <TextField
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                            variant={'outlined'}
                                            value={`${baseUrl}/`}
                                            fullWidth
                                            disabled
                                            sx={{
                                                width: 'auto',
                                                '.MuiInputBase-input': {
                                                    marginRight: 0,
                                                },
                                                '.MuiInputBase-root': {
                                                    padding: 0,
                                                    minWidth: calculatedWidth,
                                                },
                                            }}
                                            label=" "
                                        />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end" sx={{ height: '100%', maxHeight: '100%' }}>
                                        <SecondaryButton
                                            variant="contained"
                                            disableElevation
                                            onClick={() => {
                                                handleCopyUrl(engagementUrl);
                                                setCopyTooltipEngagementLink(true);
                                            }}
                                        >
                                            <ContentCopyIcon />
                                        </SecondaryButton>
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => {
                                setSlug({ slug: e.target.value });
                                if (backendError) {
                                    setBackendError('');
                                }
                            }}
                        />
                    </Tooltip>
                </ClickAwayListener>
                <When condition={backendError}>
                    <Grid item xs={12}>
                        <MetSmallText sx={{ color: theme.palette.error.main }}>{backendError}</MetSmallText>
                    </Grid>
                </When>
            </Grid>
            <Grid item xs={12}>
                <MetLabel>Link to Public Dashboard Report</MetLabel>
                <MetDescription>
                    This is the link to the public dashboard. This link will become active once the survey is open to
                    the public.
                </MetDescription>
                <ClickAwayListener
                    onClickAway={() => {
                        setCopyTooltipDashboardLink(false);
                    }}
                >
                    <Tooltip
                        title="Link copied!"
                        PopperProps={{
                            disablePortal: true,
                        }}
                        open={copyTooltipDashboardLink}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        placement="right"
                    >
                        <TextField
                            id="dashboard-link"
                            variant="outlined"
                            label=" "
                            InputLabelProps={{
                                shrink: false,
                            }}
                            fullWidth
                            value={dashboardUrl}
                            sx={{
                                '.MuiInputBase-input': {
                                    marginRight: 0,
                                },
                                '.MuiInputBase-root': {
                                    padding: 0,
                                },
                            }}
                            disabled
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" sx={{ height: '100%', maxHeight: '100%' }}>
                                        <SecondaryButton
                                            variant="contained"
                                            disableElevation
                                            onClick={() => {
                                                handleCopyUrl(dashboardUrl);
                                                setCopyTooltipDashboardLink(true);
                                            }}
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
        </Grid>
    );
};
