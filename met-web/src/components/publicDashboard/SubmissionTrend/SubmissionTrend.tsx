import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Stack, useMediaQuery, Theme, Grid, ToggleButtonGroup, ToggleButton, CircularProgress } from '@mui/material';
import { MetPaper, MetLabel } from 'components/common';
import { Unless } from 'react-if';
import { DASHBOARD } from '../constants';
import { ErrorBox } from '../ErrorBox';
import {
    getUserResponseDetailByMonth,
    getUserResponseDetailByWeek,
} from 'services/analytics/userResponseDetailService';
import { createDefaultByMonthData } from '../../../models/analytics/userResponseDetail';
import { Engagement } from 'models/engagement';
import { Palette } from 'styles/Theme';

const HEIGHT = 320;

interface SubmissionTrendProps {
    engagement: Engagement;
    engagementIsLoading: boolean;
}

const SubmissionTrend = ({ engagement, engagementIsLoading }: SubmissionTrendProps) => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const [data, setData] = useState(createDefaultByMonthData());
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [chartBy, setChartBy] = React.useState('monthly');

    const fetchData = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            if (chartBy == 'monthly') {
                const response = await getUserResponseDetailByMonth(Number(engagement.id));
                setData(response);
            } else if (chartBy == 'weekly') {
                const response = await getUserResponseDetailByWeek(Number(engagement.id));
                setData(response);
            }
            setIsLoading(false);
        } catch (error) {
            setIsError(true);
        }
    };

    useEffect(() => {
        if (Number(engagement.id)) {
            fetchData();
        }
    }, [engagement.id, chartBy]);

    const handleToggleChange = (event: React.MouseEvent<HTMLElement>, chartByValue: string) => {
        setChartBy(chartByValue);
    };

    if (isError) {
        return (
            <ErrorBox
                sx={{ height: HEIGHT }}
                onClick={() => {
                    fetchData();
                }}
            />
        );
    }

    if (isLoading || engagementIsLoading) {
        return (
            <>
                <MetLabel mb={2}>Live Activity - Engagement</MetLabel>
                <MetPaper sx={{ p: 2 }}>
                    <Stack direction="column" alignItems="center" gap={1}>
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="center"
                            direction="row"
                            width={'100%'}
                            height={HEIGHT}
                        >
                            <CircularProgress color="inherit" />
                        </Grid>
                    </Stack>
                </MetPaper>
            </>
        );
    }
    return (
        <>
            <MetLabel mb={2}>Live Activity - Engagement</MetLabel>
            <MetPaper sx={{ p: 2 }}>
                <Grid item container xs={12} direction="row" justifyContent="center">
                    <Stack direction={{ xs: 'column', sm: 'row' }} width="100%" justifyContent="flex-end">
                        <ToggleButtonGroup value={chartBy} exclusive onChange={handleToggleChange}>
                            <ToggleButton
                                value="monthly"
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: Palette.primary.main,
                                        color: 'white',
                                    },
                                }}
                            >
                                Monthly
                            </ToggleButton>
                            <ToggleButton
                                value="weekly"
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: Palette.primary.main,
                                        color: 'white',
                                    },
                                }}
                            >
                                Weekly
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Stack>
                </Grid>
                <ResponsiveContainer width="100%" height={isSmallScreen ? 200 : 250}>
                    <BarChart
                        data={data}
                        margin={
                            !isSmallScreen
                                ? { top: 10, right: 30, left: 0, bottom: 0 }
                                : { top: 5, right: 0, left: -20, bottom: 0 }
                        }
                    >
                        <XAxis dataKey="showdataby" />
                        <YAxis />
                        <Unless condition={isSmallScreen}>
                            <Tooltip />
                        </Unless>
                        <Bar dataKey="responses" fill={DASHBOARD.BAR_CHART.FILL_COLOR} minPointSize={2} barSize={50}>
                            <LabelList dataKey="responses" position="insideTop" style={{ fill: 'white' }} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </MetPaper>
        </>
    );
};

export default SubmissionTrend;
