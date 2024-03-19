import React from 'react';
import { PollResultResponse } from 'models/pollWidget';
import { Box, Typography, LinearProgress, Stack } from '@mui/material';
import { Widget } from 'models/widget';
import { Grid } from '@mui/material';
import { MetHeader4 } from '../../../../../common';
import Divider from '@mui/material/Divider';

interface PollResultViewProps {
    widget: Widget;
    pollResult: PollResultResponse;
}

interface PollOptionProps {
    label: string;
    votes: number;
    percentage: number;
}

function PollOption({ label, votes, percentage }: PollOptionProps) {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{label}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LinearProgress variant="determinate" value={percentage} sx={{ flexGrow: 1, mr: 1 }} />
                <Typography variant="subtitle1">{`${percentage}%`}</Typography>
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                {votes > 1 ? `${votes} votes` : `${votes} vote`}
            </Typography>
            <Divider />
        </Box>
    );
}

const ResultView: React.FC<PollResultViewProps> = ({ pollResult, widget }) => {
    if (!pollResult) {
        return <p>No Poll Result</p>;
    }

    return (
        <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start" spacing={2}>
            <Grid item xs={12}>
                <MetHeader4 bold>{widget.title} - Results</MetHeader4>
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ width: '100%', p: 2, boxShadow: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {pollResult.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        {pollResult.description}
                    </Typography>

                    <Stack>
                        {pollResult.answers.map((answer, index) => (
                            <PollOption
                                key={index}
                                label={answer.answer_text}
                                votes={answer.total_response}
                                percentage={answer.percentage}
                            />
                        ))}
                    </Stack>
                    <Typography variant="caption" sx={{ display: 'block', mt: 2 }}>
                        Total Votes: {pollResult.total_response}
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    );
};

export default ResultView;
