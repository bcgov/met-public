import React, { useContext } from 'react';
import { Grid, Skeleton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { CommentViewContext } from './CommentViewContext';
import { PrimaryButton, MetPaper, MetHeader4 } from 'components/common';
import CommentTable from './CommentTable';

export const CommentsBlock = () => {
    const { engagement, isEngagementLoading } = useContext(CommentViewContext);

    if (isEngagementLoading || !engagement) {
        return <Skeleton width="100%" height="40em" />;
    }

    return (
        <>
            <Grid item xs={12} container justifyContent="flex-end">
                <Link to={'/engagement/view/' + engagement.id} style={{ color: '#1A5A96' }}>
                    {'<<Return to ' + engagement.name + ' Engagement'}
                </Link>
            </Grid>
            <Grid item xs={12}>
                <MetPaper elevation={1} sx={{ padding: '2em 2em 0 2em' }}>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" rowSpacing={2}>
                        <Grid item xs={12} sm={6}>
                            <MetHeader4>Comments</MetHeader4>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            container
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="flex-end"
                        >
                            <PrimaryButton
                                data-testid="SurveyBlock/take-me-to-survey-button"
                                component={Link}
                                to={`/engagement/${engagement.id}/dashboard`}
                            >
                                View Report
                            </PrimaryButton>
                        </Grid>
                        <Grid item xs={12}>
                            <CommentTable />
                        </Grid>
                    </Grid>
                </MetPaper>
            </Grid>
        </>
    );
};

export default CommentsBlock;
