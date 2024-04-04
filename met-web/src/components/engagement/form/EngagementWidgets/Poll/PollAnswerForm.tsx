// PollAnswerForm.tsx
import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { PrimaryButton } from 'components/common';
import { PollAnswer } from 'models/pollWidget';
import Typography from '@mui/material/Typography';
import PollAnswerItemForm from './PolllAnswerItemForm';

interface PollAnswerFormProps {
    initialPollAnswers: PollAnswer[];
    onPollAnswersChange: (answers: PollAnswer[]) => void;
}

const PollAnswerForm: React.FC<PollAnswerFormProps> = ({ initialPollAnswers, onPollAnswersChange }) => {
    const [pollAnswers, setPollAnswers] = useState<PollAnswer[]>(initialPollAnswers);

    useEffect(() => {
        setPollAnswers(initialPollAnswers);
    }, [initialPollAnswers]);

    const handleAnswerTextChange = (answer_text: string, index: number) => {
        const updatedAnswers = [...pollAnswers];
        updatedAnswers[index].answer_text = answer_text;
        setPollAnswers(updatedAnswers);
        onPollAnswersChange(updatedAnswers);
    };

    const handleRemoveAnswer = (index: number) => {
        const updatedAnswers = pollAnswers.filter((_, i) => i !== index);
        setPollAnswers(updatedAnswers);
        onPollAnswersChange(updatedAnswers);
    };

    const handleAddAnswer = () => {
        const newAnswer = { id: 0, answer_text: '' };
        const updatedAnswers = [...pollAnswers, newAnswer];
        setPollAnswers(updatedAnswers);
        onPollAnswersChange(updatedAnswers);
    };

    return (
        <Grid item xs={12} container direction="column" alignItems={'stretch'} justifyContent="flex-start" spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Poll Answers
                </Typography>
            </Grid>
            {pollAnswers?.map((answer, index) => (
                <PollAnswerItemForm
                    key={'answer' + index}
                    index={index}
                    answer={answer}
                    onTextChange={handleAnswerTextChange}
                    onRemove={handleRemoveAnswer}
                    canRemove={pollAnswers.length > 1}
                />
            ))}
            <Grid item>
                <PrimaryButton onClick={() => handleAddAnswer()}>Add Answer</PrimaryButton>
            </Grid>
        </Grid>
    );
};

export default PollAnswerForm;
