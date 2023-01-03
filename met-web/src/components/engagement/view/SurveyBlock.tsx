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

const SurveyBlock = ({ startSurvey }: SurveyBlockProps) => {
    const { savedEngagement, isEngagementLoading, mockStatus } = useContext(ActionContext);
    const isOpen = savedEngagement.submission_status === SubmissionStatus.Open;
    const surveyId = savedEngagement.surveys[0]?.id || '';
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isPreview = isLoggedIn;
    const status_block = savedEngagement.status_block;
    if (isEngagementLoading) {
        return <Skeleton variant="rectangular" height={'15em'} />;
    }

    return (
        <MetPaper elevation={1} sx={{ padding: '2em' }}>
            <Grid container direction="row" alignItems="flex-end" justifyContent="flex-end" spacing={2}>
                <Grid item xs={12}>
                    <If condition={status_block.length > 0}>
                        <Then>
                            <Editor
                                editorState={getEditorState(savedEngagement.status_block[mockStatus - 1].block_text)}
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
                </Grid>
                <Grid item container direction={{ xs: 'column', sm: 'row' }} xs={12} justifyContent="flex-end">
                    <PrimaryButton
                        data-testid="SurveyBlock/take-me-to-survey-button"
                        disabled={!surveyId || (!isOpen && !isPreview)}
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
