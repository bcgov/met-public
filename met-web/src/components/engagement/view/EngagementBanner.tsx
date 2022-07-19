import React, { useContext, useState } from 'react';
import { ActionContext } from './ActionContext';
import { Button, Grid, Skeleton } from '@mui/material';
import { Banner } from '../banner/Banner';
import { useNavigate } from 'react-router-dom';
import { ConditionalComponent } from 'components/common';

export const EngagementBanner = () => {
    const { engagementLoading, savedEngagement } = useContext(ActionContext);
    const surveyId = savedEngagement.surveys[0]?.id || '';
    const [open, setOpen] = useState(true);

    const publishedStatus = savedEngagement.engagement_status.id === 2;
    if (engagementLoading) {
        return <Skeleton variant="rectangular" width="100%" height="35em" />;
    }

    return (
        <Banner savedEngagement={savedEngagement}>
            <ConditionalComponent condition={!!surveyId && publishedStatus}>
                <Grid item xs={12} container direction="row" justifyContent="flex-end">
                    {/* <Button variant="contained" onClick={() => setOpen(true)}>
                        Share your thoughts
                    </Button>
                    <EmailModal open={open} handleClose={() => setOpen(false)} /> */}
                </Grid>
            </ConditionalComponent>
        </Banner>
    );
};
