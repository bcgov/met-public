import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Stack, useMediaQuery, Theme, Skeleton } from '@mui/material';
import { MetPaper, MetHeader3 } from 'components/common';
import { Unless } from 'react-if';
import { DASHBOARD } from '../constants';
import { ErrorBox } from '../ErrorBox';

const sampleData = [
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

const HEIGHT = 320;

const SubmissionTrend = () => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const [data, setData] = useState(sampleData);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // TODO: uncomment this when the API is ready
            // const result = await fetch('/api/engagement/1/complete-responses');
            setData(sampleData);
            setIsLoading(false);
            setIsError(false);
        } catch (error) {
            console.log(error);
            setIsError(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return <Skeleton variant="rectangular" width={'100%'} height={HEIGHT} />;
    }

    if (isError) {
        return <ErrorBox sx={{ height: HEIGHT }} onClick={fetchData} />;
    }
    return (
        <MetPaper sx={{ p: 2 }}>
            <Stack direction="column" alignItems="center" gap={1}>
                <MetHeader3 mb={5} color="primary">
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
                        <Area
                            type="monotone"
                            dataKey="Responses"
                            stroke={DASHBOARD.LINE_CHART.STROKE_COLOR}
                            fill={DASHBOARD.LINE_CHART.FILL_COLOR}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Stack>
        </MetPaper>
    );
};

export default SubmissionTrend;
