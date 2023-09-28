import React from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import { CommentBanner } from './CommentBanner';
import CommentsBlock from './CommentsBlock';

export const EngagementComments = () => {
    const { dashboardType } = useParams<{ dashboardType: string }>();
    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid item xs={12}>
                <CommentBanner />
            </Grid>
            <Grid
                container
                item
                xs={12}
                direction="row"
                justifyContent={'flex-end'}
                alignItems="flex-end"
                m={{ lg: '1em 8em 2em 3em', xs: '1em' }}
            >
                <CommentsBlock dashboardType={dashboardType ? dashboardType : 'public'} />
            </Grid>
        </Grid>
    );
};

export default EngagementComments;
