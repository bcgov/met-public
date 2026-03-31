import React from 'react';
import { Grid2 as Grid, TextField, Divider } from '@mui/material';
import { PollAnswer } from 'models/pollWidget';
import { BodyText } from 'components/common/Typography/Body';
import { Button } from 'components/common/Input/Button';

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
                <Grid size={12}>
                    <BodyText bold>{'Answer Text ' + (index + 1)}</BodyText>
                    <TextField
                        data-testid={'answerText' + (index + 1)}
                        name={'answerText' + (index + 1)}
                        id={'answerText' + (index + 1)}
                        variant="outlined"
                        value={answer.answer_text}
                        fullWidth
                        onChange={(e) => onTextChange(e.target.value, index)}
                    />
                </Grid>
                {canRemove && (
                    <Grid size={12} sx={{ marginTop: '8px' }}>
                        <Button onClick={() => onRemove(index)}>Remove Answer</Button>
                    </Grid>
                )}
                <Grid size={12}>
                    <Divider sx={{ marginTop: '1em' }} />
                </Grid>
            </>
        );
    },
);

export default PollAnswerItemForm;
