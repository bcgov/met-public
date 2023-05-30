import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { Box, Grid, CircularProgress, useMediaQuery, Theme } from '@mui/material';
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
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const circleSize = isSmallScreen ? 100 : 250;

    const fetchData = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await getAggregatorData({
                engagement_id: Number(engagement.id),
                count_for: 'email_verification',
            });
            setData(response);
            setIsLoading(false);
        } catch (error) {
            setIsError(true);
        }
    };

    useEffect(() => {
        if (Number(engagement.id)) {
            fetchData();
        }
    }, [engagement.id]);

    if (isError) {
        return (
            <ErrorBox
                sx={{ height: '100%', minHeight: '213px' }}
                onClick={() => {
                    fetchData();
                }}
            />
        );
    }

    if (isLoading || engagementIsLoading) {
        return (
            <>
                <MetLabel mb={2}>Survey Emails Sent</MetLabel>
                <MetPaper sx={{ p: 2, textAlign: 'center' }}>
                    <Box
                        sx={{
                            width: '100%',
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

    return (
        <>
            <MetLabel mb={isSmallScreen ? 0.5 : 2}>Survey Emails Sent</MetLabel>
            <MetPaper sx={{ p: 2, textAlign: 'center' }}>
                <Stack alignItems="center" gap={1}>
                    <RadialBarChart
                        width={circleSize}
                        height={circleSize}
                        cx={circleSize / 2}
                        cy={circleSize / 2}
                        innerRadius={circleSize / 2}
                        outerRadius={circleSize / 3}
                        barSize={circleSize / 4}
                        data={[data]}
                        startAngle={225}
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
                            fontSize={`${circleSize / 5}`}
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
