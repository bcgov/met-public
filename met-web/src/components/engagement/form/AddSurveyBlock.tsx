import React, { useContext, useState } from 'react';
import { ActionContext } from './ActionContext';
import { Grid } from '@mui/material';
import { MetHeader4, MetPaper, MetWidget, SecondaryButton } from 'components/common';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { EngagementStatus } from 'constants/engagementStatus';
import { unlinkSurvey } from 'services/surveyService/form';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';

export const AddSurveyBlock = () => {
    const { savedEngagement, fetchEngagement } = useContext(ActionContext);
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
            pathname: '/surveys/create',
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
        dispatch(
            openNotificationModal({
                open: true,
                data: {
                    header: 'Remove Survey',
                    subText: [
                        'You will be removing this survey from the engagement. This survey will not be deleted and will be available to add to any engagement.',
                        'Do you want to remove this survey?',
                    ],
                    handleConfirm: () => {
                        handleRemoveSurvey(surveyId, surveyName);
                    },
                },
                type: 'confirm',
            }),
        );
    };

    return (
        <>
            <MetHeader4 bold={true} sx={{ marginBottom: '2px' }}>
                Survey Block
            </MetHeader4>
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
                                    testId={`survey-${survey.id}`}
                                    key={survey.id}
                                    title={survey.name}
                                    onEditClick={() => navigate(`/surveys/${survey.id}/build`)}
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
