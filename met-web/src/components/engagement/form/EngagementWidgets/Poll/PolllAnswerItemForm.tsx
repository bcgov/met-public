import React from 'react';
import { Grid, TextField, Divider } from '@mui/material';
import { SecondaryButton, MetLabel } from 'components/common';
import { PollAnswer } from 'models/pollWidget';

interface PollAnswerItemProps {
    index: number;
    answer: PollAnswer;
    onTextChange: (text: string, index: number) => void;
    onRemove: (index: number) => void;
    canRemove: boolean;
}

const PollAnswerItemForm: React.FC<PollAnswerItemProps> = React.memo(
    ({ index, answer, onTextChange, onRemove, canRemove }) => {
        return (
            <>
                <Grid item xs={12}>
                    <MetLabel>{'Answer Text ' + (index + 1)}</MetLabel>
                    <TextField
                        name={'answerText' + (index + 1)}
                        id={'answerText' + (index + 1)}
                        variant="outlined"
                        value={answer.answer_text}
                        fullWidth
                        onChange={(e) => onTextChange(e.target.value, index)}
                    />
                </Grid>
                {canRemove && (
                    <Grid item xs={12} sx={{ marginTop: '8px' }}>
                        <SecondaryButton onClick={() => onRemove(index)}>Remove Answer</SecondaryButton>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Divider sx={{ marginTop: '1em' }} />
                </Grid>
            </>
        );
    },
);

export default PollAnswerItemForm;
