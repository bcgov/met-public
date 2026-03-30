import React, { useState } from 'react';
import { AppBar, Box, Grid2 as Grid, ThemeProvider, Toolbar, Skeleton } from '@mui/material';
import { colors, AdminDarkTheme } from 'styles/Theme';
import { Heading2 } from 'components/common/Typography';
import { Button } from 'components/common/Input';
import PreviewStateTabs, { SubmissionStatusTypes } from './PreviewStateTabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/pro-regular-svg-icons';
import { Engagement } from 'models/engagement';
import { StatusLabel } from 'engagements/admin/create/authoring/StatusLabel';

interface PreviewControlBarProps {
    engagement?: Engagement;
    previewState: SubmissionStatusTypes;
    onStateChange: (state: SubmissionStatusTypes) => void;
    onReload: () => void;
    isReloading: boolean;
    isComplete: boolean;
}

/**
 * Control bar for the engagement preview page.
 * Shows engagement title, status, completeness, and state selector tabs.
 */
export const PreviewControlBar: React.FC<PreviewControlBarProps> = ({
    engagement,
    previewState,
    onStateChange,
    onReload,
    isReloading,
    isComplete,
}) => {
    const [spinTick, setSpinTick] = useState(0);

    const handleReloadClick = () => {
        setSpinTick((prev) => prev + 1);
        onReload();
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: colors.surface.gray[110],
                paddingTop: '2.5em',
                backgroundImage: 'none',
                boxShadow: 'none',
                minHeight: '80px',
                borderRadius: '0px',
            }}
        >
            <ThemeProvider theme={AdminDarkTheme}>
                <Grid
                    component={Toolbar}
                    container
                    direction="column"
                    justifyContent="space-between"
                    alignItems="center"
                    padding={{ xs: '0px 16px', md: '0px 5vw', lg: '0px 10em' }}
                    minHeight="80px !important"
                    gap={2}
                    flexWrap={{ xs: 'wrap', lg: 'nowrap' }}
                >
                    {/* Status Indicators */}
                    <Grid container gap={1} direction="row" size={12}>
                        <Grid container direction="column" alignSelf="flex-start" size="grow">
                            <Grid container direction="row" gap={1} alignSelf="flex-start">
                                {/* Status Chip */}
                                {engagement ? (
                                    <StatusLabel status={engagement.status_id} />
                                ) : (
                                    <Skeleton variant="rectangular" width={80} height={24} />
                                )}
                                {/* Completeness Indicator */}
                                <StatusLabel completed={!!isComplete} text={isComplete ? 'Complete' : 'Incomplete'} />
                            </Grid>
                            {/* Left Section: Title */}
                            <Grid component={Heading2} my={0} bold fontSize="2rem" lineHeight="2.5rem">
                                Engagement Preview
                            </Grid>
                        </Grid>
                        {/* Reload Button */}
                        <Grid
                            component={Button}
                            onClick={handleReloadClick}
                            variant="secondary"
                            size="auto"
                            width="fit-content"
                            icon={
                                <Box
                                    key={spinTick}
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        '@keyframes refreshSpinDecay': {
                                            '0%': {
                                                transform: 'rotate(0deg)',
                                            },
                                            '100%': {
                                                transform: 'rotate(360deg)',
                                            },
                                        },
                                        animation:
                                            spinTick > 0
                                                ? 'refreshSpinDecay 1200ms cubic-bezier(0.16, 1, 0.3, 1)'
                                                : 'none',
                                    }}
                                >
                                    <FontAwesomeIcon icon={faArrowsRotate} />
                                </Box>
                            }
                            iconPosition="left"
                            disabled={isReloading}
                            sx={{ borderRadius: '8px' }}
                        >
                            Refresh Content
                        </Grid>
                    </Grid>
                    <Grid container direction="column" alignContent="flex-end" size={12}>
                        {/* State Tabs */}
                        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
                            <PreviewStateTabs selectedState={previewState} onStateChange={onStateChange} />
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </AppBar>
    );
};

export default PreviewControlBar;
