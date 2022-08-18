import React, { useContext, useState } from 'react';
import { ActionContext } from './ActionContext';
import { Grid, Typography } from '@mui/material';
import { MetPaper, MetWidget, SecondaryButton } from 'components/common';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { EngagementStatus } from 'constants/engagementStatus';
import { unlinkSurvey } from 'services/surveyService/form';

export const AddSurveyBlock = () => {
    const { savedEngagement, fetchEngagement, handleOpenModal, handleCloseModal } = useContext(ActionContext);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isDeletingSurvey, setIsDeletingSurvey] = useState(false);

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

    const handleRemoveSurvey = async (surveyId: number, surveyName: string) => {
        if (savedEngagement.engagement_status.id !== EngagementStatus.Draft) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: `Cannot remove survey from an engagement of status ${savedEngagement.engagement_status.status_name}`,
                }),
            );
            return;
        }

        try {
            setIsDeletingSurvey(true);
            await unlinkSurvey({ id: surveyId, engagement_id: savedEngagement.id });
            dispatch(
                openNotification({
                    severity: 'success',
                    text: `Survey "${surveyName}" successfuly removed from this engagement`,
                }),
            );
            fetchEngagement();
        } catch (error) {
            console.log(error);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: `Error occurred while trying to remove survey "${surveyName}"`,
                }),
            );
            setIsDeletingSurvey(false);
        }
    };

    const handleDeleteClick = (surveyId: number, surveyName: string) => {
        handleOpenModal({
            handleConfirm: () => {
                handleCloseModal();
                handleRemoveSurvey(surveyId, surveyName);
            },
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
                        <SecondaryButton onClick={handleAddSurvey} disabled={savedEngagement.surveys.length > 0}>
                            Add Survey
                        </SecondaryButton>
                    </Grid>

                    <Grid item xs={12}>
                        {savedEngagement.surveys.map((survey) => {
                            return (
                                <MetWidget
                                    key={survey.id}
                                    title={survey.name}
                                    onEditClick={() => navigate(`/survey/build/${survey.id}`)}
                                    onDeleteClick={() => handleDeleteClick(survey.id, survey.name)}
                                    deleting={isDeletingSurvey}
                                />
                            );
                        })}
                    </Grid>
                </Grid>
            </MetPaper>
        </>
    );
};
