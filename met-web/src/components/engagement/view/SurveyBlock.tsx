import React, { useContext } from 'react';
import { Grid, Skeleton } from '@mui/material';
import { MetPaper, PrimaryButton } from '../../common';
import { ActionContext } from './ActionContext';
import { SubmissionStatus } from 'constants/engagementStatus';
import { SurveyBlockProps } from './types';
import { useAppSelector } from 'hooks';
import { submissionStatusArray } from 'constants/submissionStatusText';
import { Editor } from 'react-draft-wysiwyg';
import { getEditorStateFromHtml, getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { Case, Switch } from 'react-if';
import { useNavigate } from 'react-router-dom';
import { useAppTranslation } from 'hooks';

const SurveyBlock = ({ startSurvey }: SurveyBlockProps) => {
    const { t: translate } = useAppTranslation();
    const { savedEngagement, isEngagementLoading, mockStatus } = useContext(ActionContext);
    const navigate = useNavigate();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isPreview = isLoggedIn;
    const currentStatus = isPreview ? mockStatus : savedEngagement.submission_status;
    const surveyId = savedEngagement.surveys[0]?.id || '';
    const status_block = savedEngagement.status_block;
    const status_text = status_block.find(
        (status) => status.survey_status === SubmissionStatus[currentStatus],
    )?.block_text;
    if (isEngagementLoading) {
        return <Skeleton variant="rectangular" height={'15em'} />;
    }
    const languagePath = `/${sessionStorage.getItem('languageId')}`;

    return (
        <MetPaper elevation={1} sx={{ padding: '2em', pt: '0px' }}>
            <Grid container direction="row" alignItems="flex-end" justifyContent="flex-end" spacing={2}>
                <Grid item xs={12}>
                    <Editor
                        editorState={
                            status_text
                                ? getEditorStateFromRaw(status_text)
                                : getEditorStateFromHtml(submissionStatusArray[currentStatus - 1])
                        }
                        readOnly={true}
                        toolbarHidden
                    />
                </Grid>
                <Switch>
                    <Case condition={currentStatus === SubmissionStatus.Open}>
                        <Grid item container direction={{ xs: 'column', sm: 'row' }} xs={12} justifyContent="flex-end">
                            <PrimaryButton
                                data-testid="SurveyBlock/take-me-to-survey-button"
                                disabled={!surveyId}
                                onClick={startSurvey}
                            >
                                {translate('buttonText.shareYourThoughts')}
                            </PrimaryButton>
                        </Grid>
                    </Case>
                    <Case condition={currentStatus === SubmissionStatus.Closed}>
                        <Grid item container direction={{ xs: 'column', sm: 'row' }} xs={12} justifyContent="flex-end">
                            <PrimaryButton
                                data-testid="SurveyBlock/view-feedback-button"
                                disabled={!surveyId}
                                onClick={() => {
                                    isLoggedIn
                                        ? navigate(`/engagements/${savedEngagement.id}/dashboard/public`)
                                        : navigate(
                                              `${languagePath}/engagements/${savedEngagement.id}/dashboard/public`,
                                          );
                                }}
                            >
                                {translate('buttonText.viewFeedback')}
                            </PrimaryButton>
                        </Grid>
                    </Case>
                </Switch>
            </Grid>
        </MetPaper>
    );
};

export default SurveyBlock;
