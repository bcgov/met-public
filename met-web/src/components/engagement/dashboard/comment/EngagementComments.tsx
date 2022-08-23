import React from 'react';
import { Grid } from '@mui/material';
import { CommentBanner } from './CommentBanner';
import CommentsBlock from './CommentsBlock';

export const EngagementComments = () => {
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
                <CommentsBlock />
            </Grid>
        </Grid>
    );
};

export default EngagementComments;
