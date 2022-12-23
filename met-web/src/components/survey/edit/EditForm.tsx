import React, { useContext } from 'react';
import { Grid, Stack, TextField } from '@mui/material';
import { ActionContext } from './ActionContext';
import { MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { SurveyFormProps } from '../types';
import { cloneDeep } from 'lodash';

export const EditForm = ({ handleClose }: SurveyFormProps) => {
    const { handleSubmit, isSubmitting, submission, setSubmission } = useContext(ActionContext);

    const handleChange = (value: string, commentIndex: number) => {
        if (!submission) {
            return;
        }

        const updatedSubmission = cloneDeep(submission);
        updatedSubmission.comments[commentIndex].text = value;
        setSubmission(updatedSubmission);
    };

    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={2}
            padding={'2em 2em 1em 2em'}
        >
            {submission?.comments.map((comment, index) => {
                return (
                    <Grid item xs={12} key={index}>
                        <MetLabel>{comment.label}</MetLabel>
                        <TextField
                            defaultValue={comment.text}
                            sx={{ width: '100%' }}
                            multiline={true}
                            rows={3}
                            onChange={(e) => {
                                handleChange(e.target.value, index);
                            }}
                        />
                    </Grid>
                );
            })}
            <Grid item container xs={12} direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: '1em' }}>
                <Stack
                    direction={{ md: 'column-reverse', lg: 'row' }}
                    spacing={1}
                    width="100%"
                    justifyContent="flex-end"
                >
                    <SecondaryButton onClick={() => handleClose()}>Cancel</SecondaryButton>
                    <PrimaryButton
                        disabled={isSubmitting}
                        onClick={() => {
                            if (submission) handleSubmit();
                        }}
                        loading={isSubmitting}
                    >
                        Submit Changes
                    </PrimaryButton>
                </Stack>
            </Grid>
        </Grid>
    );
};
