import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import Stack from '@mui/material/Stack';
import { MetPaper, MetHeader3 } from 'components/common';

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

class SubmissionTrend extends React.Component {
    render() {
        return (
            <MetPaper sx={{ p: 2 }}>
                <Stack direction="column" alignItems="center" gap={1}>
                    <MetHeader3 mb={5} color="#003366">
                        Submission Trend
                    </MetHeader3>
                    <AreaChart
                        width={1220}
                        height={250}
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <XAxis dataKey="Month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="Responses" stroke="#4A6447" fill="#4E7780" />
                    </AreaChart>
                </Stack>
            </MetPaper>
        );
    }
}

export default SubmissionTrend;
