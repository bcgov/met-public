import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Stack, useMediaQuery, Theme, Grid, ToggleButtonGroup, ToggleButton, CircularProgress } from '@mui/material';
import { MetPaper, MetLabel, PrimaryButton } from 'components/common';
import { DASHBOARD } from '../constants';
import { ErrorBox } from '../ErrorBox';
import {
    getUserResponseDetailByMonth,
    getUserResponseDetailByWeek,
} from 'services/analytics/userResponseDetailService';
import { createDefaultByMonthData } from '../../../models/analytics/userResponseDetail';
import { Engagement } from 'models/engagement';
import { Palette } from 'styles/Theme';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'dayjs';
import { Then, If, Else, Unless } from 'react-if';
import { formatDate } from 'components/common/dateHelper';

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
    const [fromDate, setFromDate] = React.useState<Dayjs | null>(null);
    const [toDate, setToDate] = React.useState<Dayjs | null>(null);
    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (chartBy == 'monthly') {
                const response = await getUserResponseDetailByMonth(
                    Number(engagement.id),
                    fromDate ? formatDate(fromDate) : '',
                    toDate ? formatDate(toDate) : '',
                );
                setData(response);
            } else if (chartBy == 'weekly') {
                const response = await getUserResponseDetailByWeek(
                    Number(engagement.id),
                    fromDate ? formatDate(fromDate) : '',
                    toDate ? formatDate(toDate) : '',
                );
                setData(response);
            }
            setIsLoading(false);
            setIsError(false);
        } catch (error) {
            console.log(error);
            setIsError(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, [engagement.id, chartBy]);

    useEffect(() => {
        if (fromDate && toDate) await fetchData();
    }, [fromDate, toDate]);

    const handleToggleChange = (event: React.MouseEvent<HTMLElement>, chartByValue: string) => {
        setChartBy(chartByValue);
    };

    const clearDates = () => {
        setFromDate(null);
        setToDate(null);
        await fetchData();
    };

    if (engagementIsLoading) {
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

    if (isError) {
        return <ErrorBox sx={{ height: HEIGHT }} onClick={fetchData} />;
    }
    return (
        <>
            <MetLabel mb={2}>Live Activity - Engagement</MetLabel>
            <MetPaper sx={{ p: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container>
                        <Grid
                            alignItems={'center'}
                            justifyContent={'center'}
                            direction="row"
                            container
                            item
                            rowSpacing={0.5}
                            lg={2}
                            md={3}
                        >
                            <Grid item xs={8}>
                                <DatePicker
                                    value={fromDate}
                                    label="From Date"
                                    onChange={(newDate: Dayjs | null) => setFromDate(newDate)}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <DatePicker
                                    label="To Date"
                                    value={toDate}
                                    onChange={(newDate: Dayjs | null) => setToDate(newDate)}
                                />
                            </Grid>

                            <Grid item xs={8}>
                                <PrimaryButton sx={{ width: '100%' }} onClick={clearDates}>
                                    Clear
                                </PrimaryButton>
                            </Grid>
                        </Grid>
                        <Grid item xs={8}>
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
                            <If condition={!isLoading}>
                                <Then>
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
                                            <Bar
                                                dataKey="responses"
                                                fill={DASHBOARD.BAR_CHART.FILL_COLOR}
                                                minPointSize={2}
                                                barSize={50}
                                            >
                                                <LabelList
                                                    dataKey="responses"
                                                    position="insideTop"
                                                    style={{ fill: 'white' }}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Then>
                                <Else>
                                    <Grid
                                        container
                                        alignItems="center"
                                        justifyContent="center"
                                        direction="row"
                                        width={'100%'}
                                        height={isSmallScreen ? 200 : 250}
                                    >
                                        <CircularProgress color="inherit" />
                                    </Grid>
                                </Else>
                            </If>
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </MetPaper>
        </>
    );
};

export default SubmissionTrend;
