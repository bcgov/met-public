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

const SurveyBlock = ({ startSurvey }: SurveyBlockProps) => {
    const { savedEngagement, isEngagementLoading, mockStatus } = useContext(ActionContext);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isPreview = isLoggedIn;
    const currentStatus = isPreview ? mockStatus : savedEngagement.submission_status;
    const isOpen = currentStatus === SubmissionStatus.Open;
    const surveyId = savedEngagement.surveys[0]?.id || '';
    const status_block = savedEngagement.status_block;
    const status_text = status_block.find(
        (status) => status.survey_status === SubmissionStatus[currentStatus],
    )?.block_text;
    if (isEngagementLoading) {
        return <Skeleton variant="rectangular" height={'15em'} />;
    }

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
                <Grid item container direction={{ xs: 'column', sm: 'row' }} xs={12} justifyContent="flex-end">
                    <PrimaryButton
                        data-testid="SurveyBlock/take-me-to-survey-button"
                        disabled={!surveyId || !isOpen}
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
