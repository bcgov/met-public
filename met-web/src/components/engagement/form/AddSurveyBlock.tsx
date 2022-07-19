import React, { useContext } from 'react';
import { ActionContext } from './ActionContext';
import { Button, Grid, Typography } from '@mui/material';
import { MetPaper, MetWidget } from 'components/common';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

export const AddSurveyBlock = () => {
    const { savedEngagement } = useContext(ActionContext);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleAddSurvey = () => {
        if (!savedEngagement.id) {
            dispatch(
                openNotification({ severity: 'error', text: 'Please save the engagement before adding a survey' }),
            );
            return;
        }
        navigate({
            pathname: '/survey/create',
            search: `?engagementId=${savedEngagement.id}`,
        });
    };

    return (
        <>
            <Typography variant="h6" sx={{ marginBottom: '2px', fontWeight: 'bold' }}>
                Survey Block
            </Typography>
            <MetPaper>
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={2}
                    sx={{ padding: '1em' }}
                >
                    <Grid item xs={12} container direction="row" justifyContent="flex-end">
                        <Button
                            variant="outlined"
                            onClick={handleAddSurvey}
                            disabled={savedEngagement.surveys.length > 0}
                        >
                            Add Survey
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        {savedEngagement.surveys.map((survey) => {
                            return (
                                <MetWidget
                                    title={survey.name}
                                    onEditClick={() => navigate(`/survey/build/${survey.id}`)}
                                />
                            );
                        })}
                    </Grid>
                </Grid>
            </MetPaper>
        </>
    );
};
