import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { Box, Grid, CircularProgress, useMediaQuery, Theme } from '@mui/material';
import { DASHBOARD } from '../constants';
import { getAggregatorData } from 'services/analytics/aggregatorService';
import { AggregatorData } from '../../../models/analytics/aggregator';
import { Engagement } from 'models/engagement';
import { RadialBarChart, PolarAngleAxis, RadialBar } from 'recharts';
import { MetLabel, MetPaper } from 'components/common';
import { ErrorBox } from '../ErrorBox';
import { NoData } from '../NoData';
import axios, { AxiosError } from 'axios';
import { HTTP_STATUS_CODES } from 'constants/httpResponseCodes';
import { useAppTranslation } from 'hooks';

interface SurveysCompletedProps {
    engagement: Engagement;
    engagementIsLoading: boolean;
}

const SurveysCompleted = ({ engagement, engagementIsLoading }: SurveysCompletedProps) => {
    const { t: translate } = useAppTranslation();
    const [data, setData] = useState<AggregatorData | null>(null);
    const [emailVerificationData, setEmailVerificationData] = useState<AggregatorData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    const circleSize = isTablet ? 100 : 250;

    const setErrors = (error: AxiosError) => {
        if (error.response?.status !== HTTP_STATUS_CODES.NOT_FOUND) {
            setIsError(true);
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await getAggregatorData({
                engagement_id: Number(engagement.id),
                count_for: 'survey_completed',
            });
            setData(response);
            const emailVerification = await getAggregatorData({
                engagement_id: Number(engagement.id),
                count_for: 'email_verification',
            });
            setEmailVerificationData(emailVerification);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrors(error);
            } else {
                setIsError(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (Number(engagement.id)) {
            fetchData();
        }
    }, [engagement.id]);

    if (isLoading || engagementIsLoading) {
        return (
            <>
                <MetLabel mb={2}>{translate('dashboard.surveysCompleted')}</MetLabel>
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

    if (!data) {
        return <NoData sx={{ height: '100%' }} />;
    }

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

    return (
        <>
            <MetLabel mb={{ md: 0.5, lg: 2 }}>{translate('dashboard.surveysCompleted')}</MetLabel>
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
                        endAngle={-225}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, emailVerificationData?.value]}
                            angleAxisId={0}
                            tick={false}
                        />
                        <RadialBar
                            background={{ fill: DASHBOARD.KPI.RADIALBAR.BACKGROUND_COLOR }}
                            dataKey="value"
                            fill={DASHBOARD.KPI.SURVEYCOMPLETEDRADIALBAR.FILL_COLOR}
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
                            {data?.value}
                        </text>
                    </RadialBarChart>
                </Stack>
            </MetPaper>
        </>
    );
};

export default SurveysCompleted;
