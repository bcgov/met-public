import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { Box, Grid, CircularProgress } from '@mui/material';
import { DASHBOARD } from '../constants';
import { getAggregatorData } from 'services/analytics/aggregatorService';
import { AggregatorData, createAggregatorData } from '../../../models/analytics/aggregator';
import { Engagement } from 'models/engagement';
import { RadialBarChart, PolarAngleAxis, RadialBar } from 'recharts';
import { MetLabel, MetPaper } from 'components/common';
import { ErrorBox } from '../ErrorBox';

interface SurveyEmailsSentProps {
    engagement: Engagement;
    engagementIsLoading: boolean;
}

const SurveyEmailsSent = ({ engagement, engagementIsLoading }: SurveyEmailsSentProps) => {
    const [data, setData] = useState<AggregatorData>(createAggregatorData());
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const circleSize = 250;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await getAggregatorData({
                engagement_id: Number(engagement.id),
                count_for: 'email_verification',
            });
            setData(response);
            setIsLoading(false);
            setIsError(false);
        } catch (error) {
            console.log(error);
            setIsError(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, [engagement.id]);

    if (isLoading || engagementIsLoading) {
        return (
            <>
                <MetLabel mb={2} color="primary">
                    Survey Emails Sent
                </MetLabel>
                <MetPaper sx={{ p: 2, textAlign: 'center' }}>
                    <Box
                        sx={{
                            width: '100%',
                            height: '280px',
                        }}
                    >
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="center"
                            direction="row"
                            width={'100%'}
                            height={circleSize}
                        >
                            <CircularProgress color="inherit" />
                        </Grid>
                    </Box>
                </MetPaper>
            </>
        );
    }

    if (isError) {
        return <ErrorBox sx={{ height: '100%', minHeight: '213px' }} onClick={fetchData} />;
    }

    return (
        <>
            <MetLabel mb={2} color="primary">
                Survey Emails Sent
            </MetLabel>
            <MetPaper sx={{ p: 2, textAlign: 'center' }}>
                <Stack alignItems="center" gap={1}>
                    <RadialBarChart
                        width={circleSize}
                        height={circleSize}
                        cx={circleSize / 2}
                        cy={circleSize / 2}
                        innerRadius={120}
                        outerRadius={90}
                        barSize={30}
                        data={[data]}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar
                            background={{ fill: DASHBOARD.KPI.RADIALBAR.BACKGROUND_COLOR }}
                            dataKey="value"
                            fill={DASHBOARD.KPI.SURVEYEMAILSSENTRADIALBAR.FILL_COLOR}
                            cornerRadius={30}
                        />
                        <text
                            x={circleSize / 2}
                            y={circleSize / 2}
                            textAnchor="middle"
                            fontSize="50"
                            dominantBaseline="middle"
                            className="progress-label"
                        >
                            {data.value}
                        </text>
                    </RadialBarChart>
                </Stack>
            </MetPaper>
        </>
    );
};

export default SurveyEmailsSent;
