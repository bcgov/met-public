import React, { useContext } from 'react';
import { Grid, Skeleton } from '@mui/material';
import { MetPaper, PrimaryButton } from '../../common';
import { ActionContext } from './ActionContext';
import { SubmissionStatus } from 'constants/engagementStatus';
import { SurveyBlockProps } from './types';
import { useAppSelector } from 'hooks';
import { If, Then, Else } from 'react-if';
import { submissionStatusArray } from 'constants/submissionStatusText';
import { Editor } from 'react-draft-wysiwyg';
import { getEditorState } from 'utils';

const statusMap = {
    1: 'Upcoming',
    2: 'Open',
    3: 'Closed',
};

const SurveyBlock = ({ startSurvey }: SurveyBlockProps) => {
    const { savedEngagement, isEngagementLoading, mockStatus } = useContext(ActionContext);
    const isOpen = savedEngagement.submission_status === SubmissionStatus.Open;
    const surveyId = savedEngagement.surveys[0]?.id || '';
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isPreview = isLoggedIn;
    const status_block = savedEngagement.status_block;
    const status_text = status_block.find((status) => status.survey_status === statusMap[mockStatus])?.block_text;
    const isMockStatusClosed = SubmissionStatus.Closed === mockStatus;
    if (isEngagementLoading) {
        return <Skeleton variant="rectangular" height={'15em'} />;
    }

    return (
        <MetPaper elevation={1} sx={{ padding: '2em', pt: '25px' }}>
            <Grid container direction="row" alignItems="flex-end" justifyContent="flex-end" spacing={2}>
                <Grid item xs={12}>
                    <>
                        <If condition={!!status_text}>
                            <Then>
                                <Editor
                                    editorState={getEditorState(status_text ? status_text : '')}
                                    readOnly={true}
                                    toolbarHidden
                                />
                            </Then>
                            <Else>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: submissionStatusArray[mockStatus - 1],
                                    }}
                                />
                            </Else>
                        </If>
                    </>
                </Grid>
                <Grid item container direction={{ xs: 'column', sm: 'row' }} xs={12} justifyContent="flex-end">
                    <PrimaryButton
                        data-testid="SurveyBlock/take-me-to-survey-button"
                        disabled={!surveyId || (!isOpen && !isPreview) || (isPreview && isMockStatusClosed)}
                        onClick={startSurvey}
                    >
                        Take me to the survey
                    </PrimaryButton>
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default SurveyBlock;
