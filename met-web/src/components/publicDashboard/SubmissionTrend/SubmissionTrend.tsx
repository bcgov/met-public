import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Grid, Stack, useMediaQuery, Theme } from '@mui/material';
import { MetPaper, MetHeader3 } from 'components/common';
import { Unless } from 'react-if';

const data = [
    {
        Month: 'Jan',
        Responses: 20,
    },
    {
        Month: 'Feb',
        Responses: 15,
    },
    {
        Month: 'Mar',
        Responses: 10,
    },
    {
        Month: 'Apr',
        Responses: 30,
    },
    {
        Month: 'May',
        Responses: 10,
    },
];

const SubmissionTrend = () => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    return (
        <MetPaper sx={{ p: 2 }}>
            <Stack direction="column" alignItems="center" gap={1}>
                <MetHeader3 mb={5} color="#003366">
                    Submission Trend
                </MetHeader3>
                <ResponsiveContainer width="100%" height={isSmallScreen ? 200 : 250}>
                    <AreaChart
                        data={data}
                        margin={
                            !isSmallScreen
                                ? { top: 10, right: 30, left: 0, bottom: 0 }
                                : { top: 5, right: 0, left: -20, bottom: 0 }
                        }
                    >
                        <XAxis dataKey="Month" />
                        <YAxis />
                        <Unless condition={isSmallScreen}>
                            <Tooltip />
                        </Unless>
                        <Area type="monotone" dataKey="Responses" stroke="#4A6447" fill="#4E7780" />
                    </AreaChart>
                </ResponsiveContainer>
            </Stack>
        </MetPaper>
    );
};

export default SubmissionTrend;
