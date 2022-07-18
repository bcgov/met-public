import React, { useContext } from 'react';
import { ActionContext } from './ActionContext';
import { Box, Button, Grid, Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EngagementStatus } from 'constants/engagementStatus';
import { ConditionalComponent } from 'components/common';
import { useAppSelector } from 'hooks';

export const PreviewBanner = () => {
    const navigate = useNavigate();
    const { engagementLoading, savedEngagement, publishEngagement } = useContext(ActionContext);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);

    const engagementId = savedEngagement.id || '';
    if (engagementLoading) {
        return <Skeleton variant="rectangular" width="100%" height="10em" />;
    }
    const isDraft = savedEngagement.status_id === EngagementStatus.Draft;

    const validate = () => {
        const errors = {
            status: savedEngagement.status_id !== EngagementStatus.Draft,
        };

        return Object.values(errors).some((isError: unknown) => isError);
    };

    const handlePublishEngagement = async () => {
        const hasErrors = validate();

        if (!hasErrors) {
            const engagement = await publishEngagement({
                ...savedEngagement,
                status_id: EngagementStatus.Published,
                published_date: new Date().toUTCString(),
                surveys: [],
            });

            navigate(`/`);

            return engagement;
        }
    };

    return (
        <ConditionalComponent condition={isDraft && isLoggedIn}>
            <Box
                sx={{
                    backgroundColor: 'secondary.light',
                }}
            >
                <Grid
                    container
                    direction="column"
                    justifyContent="flex-end"
                    alignItems="flex-start"
                    padding="1em 3em 1em 3em"
                >
                    <Grid item xs={10}>
                        <Typography variant="h4">Preview Engagement</Typography>
                        <Typography variant="body2">
                            This engagement must be published. Please publish it when ready.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} container direction="row" justifyContent="flex-end">
                        <Box
                            sx={{
                                backgroundColor: 'background.paper',
                                borderRadius: '4px',
                            }}
                        >
                            <Button variant="outlined" onClick={() => navigate(`/engagement/form/${engagementId}`)}>
                                Edit Enagagement
                            </Button>
                        </Box>
                        <Button
                            variant="contained"
                            sx={{ marginLeft: '1em' }}
                            onClick={() => handlePublishEngagement()}
                        >
                            Publish
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </ConditionalComponent>
    );
};
