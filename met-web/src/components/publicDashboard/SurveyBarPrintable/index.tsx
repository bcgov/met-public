import React, { useEffect, useState } from 'react';
import { Box, Grid, Skeleton, Divider } from '@mui/material';
import { MetHeader1, MetPaper, MetLabel } from 'components/common';
import { SurveyBarData } from '../types';
import { getSurveyResultData } from 'services/analytics/surveyResult';
import { Engagement } from 'models/engagement';
import { SurveyResultData, createSurveyResultData } from '../../../models/analytics/surveyResult';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { DASHBOARD } from '../constants';

const HEIGHT = 400;

interface SurveyQuestionProps {
    engagement: Engagement;
    engagementIsLoading: boolean;
}

export const SurveyBarPrintable = ({ engagement, engagementIsLoading }: SurveyQuestionProps) => {
    const [data, setData] = useState<SurveyResultData>(createSurveyResultData());
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await getSurveyResultData(Number(engagement.id));
            setData(response);
            setIsLoading(false);
            setIsError(false);
        } catch (error) {
            setIsError(true);
        }
    };

    useEffect(() => {
        if (Number(engagement.id)) {
            fetchData();
        }
    }, [engagement.id]);

    if (isLoading || engagementIsLoading) {
        return <Skeleton variant="rectangular" width={'100%'} height={HEIGHT} />;
    }

    if (isError) {
        <>
            <Grid item xs={12}>
                <MetLabel mb={2} color="primary">
                    Survey Results
                </MetLabel>
            </Grid>
        </>;
    }

    return (
        <>
            <Grid item xs={12} mb={2}>
                <MetHeader1>Survey Results</MetHeader1>
            </Grid>
            {Object.values(data).map((value) => {
                {
                    return value.map((result: SurveyBarData, i: number) => {
                        return (
                            <div id={'question' + i} key={i}>
                                <Grid key={result.postion} mb={2} item xs={12}>
                                    <MetPaper sx={{ p: 2 }}>
                                        <Grid item xs={12}>
                                            <MetLabel mb={2} color="primary">
                                                {result.label}
                                            </MetLabel>
                                            <Divider sx={{ marginTop: '1em' }} />
                                            <Box marginLeft={{ xs: 0, sm: '2em' }} marginTop={'3em'}>
                                                <ResponsiveContainer width={'100%'} height={400} key={result.postion}>
                                                    <BarChart
                                                        data={result.result}
                                                        layout="vertical"
                                                        key={result.postion}
                                                        margin={{ left: { md: 20, lg: 0 } }}
                                                    >
                                                        <XAxis hide axisLine={false} type="number" />
                                                        <YAxis
                                                            width={250}
                                                            dataKey="value"
                                                            type="category"
                                                            axisLine={true}
                                                            tickLine={true}
                                                            minTickGap={10}
                                                            tickMargin={10}
                                                        />
                                                        <Tooltip />
                                                        <Bar
                                                            dataKey="count"
                                                            stackId="a"
                                                            fill={DASHBOARD.BAR_CHART.FILL_COLOR}
                                                            minPointSize={2}
                                                            barSize={32}
                                                        >
                                                            <LabelList
                                                                dataKey="count"
                                                                position="insideRight"
                                                                style={{ fill: 'white' }}
                                                            />
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </Grid>
                                    </MetPaper>
                                </Grid>
                            </div>
                        );
                    });
                }
            })}
        </>
    );
};

export default SurveyBarPrintable;
