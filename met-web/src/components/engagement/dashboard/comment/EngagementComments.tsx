import React, { useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { ActionContext } from '../../view/ActionContext';
import { PrimaryButton, MetPaper } from 'components/common';
import { CommentBanner } from './CommentBanner';
import CommentTable from './CommentTable';

export const EngagementComments = () => {
    const { savedEngagement } = useContext(ActionContext);

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid item xs={12}>
                <CommentBanner />
            </Grid>
            <Grid
                container
                item
                direction="row"
                justifyContent={'flex-end'}
                alignItems="flex-end"
                m={{ lg: '1em 8em 2em 3em', xs: '1em' }}
            >
                <Grid item xs={12} container justifyContent="flex-end">
                    <Link to={'/engagement/view/' + savedEngagement.id} style={{ color: '#1A5A96' }}>
                        {'<<Return to ' + savedEngagement.name + ' Engagement'}
                    </Link>
                </Grid>
                <Grid item xs={12}>
                    <MetPaper elevation={1} sx={{ padding: '2em 2em 0 2em' }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            rowSpacing={2}
                        >
                            <Grid item xs={12} sm={6}>
                                <Typography variant={'h4'}>Comments</Typography>
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
                                    to={`/engagement/${savedEngagement.id}/dashboard`}
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
            </Grid>
        </Grid>
    );
};

export default EngagementComments;
