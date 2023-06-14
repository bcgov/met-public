import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import {
    Stack,
    useMediaQuery,
    Theme,
    Grid,
    ToggleButtonGroup,
    ToggleButton,
    CircularProgress,
    TextField,
} from '@mui/material';
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { Then, If, Else, Unless } from 'react-if';
import { formatToUTC } from 'components/common/dateHelper';

interface SubmissionTrendProps {
    engagement: Engagement;
    engagementIsLoading: boolean;
}

const SubmissionTrend = ({ engagement, engagementIsLoading }: SubmissionTrendProps) => {
    const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const isBetweenMdAndLg = useMediaQuery((theme: Theme) => theme.breakpoints.between('lg', 'xl'));
    const HEIGHT = isTablet ? 200 : 250;
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
                    fromDate ? formatToUTC(fromDate) : '',
                    toDate ? formatToUTC(toDate) : '',
                );
                setData(response);
            } else if (chartBy == 'weekly') {
                const response = await getUserResponseDetailByWeek(
                    Number(engagement.id),
                    fromDate ? formatToUTC(fromDate) : '',
                    toDate ? formatToUTC(toDate) : '',
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
        if (Number(engagement.id) && Boolean(fromDate) == Boolean(toDate)) {
            fetchData().catch((error) => {
                console.error(error);
            });
        }
    }, [engagement.id, chartBy, fromDate, toDate]);

    const clearDates = async () => {
        setFromDate(null);
        setToDate(null);
        await fetchData();
    };

    const handleToggleChange = (event: React.MouseEvent<HTMLElement>, chartByValue: string) => {
        setChartBy(chartByValue);
    };

    if (engagementIsLoading) {
        return (
            <>
                <MetLabel mb={0.5}>Live Activity - Engagement</MetLabel>
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
            <MetLabel mb={0.5} mt={1}>
                Live Activity - Engagement
            </MetLabel>
            <MetPaper sx={{ p: { md: 1, lg: 2 } }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid
                        container
                        direction={isTablet ? 'column' : 'row'}
                        justifyContent={'space-evenly'}
                        alignItems={'space-evenly'}
                    >
                        <Grid
                            alignItems={'center'}
                            justifyContent={'center'}
                            direction="row"
                            container
                            item
                            lg={3}
                            sx={{ mt: { xs: 2, sm: 2, md: 2, lg: 0 }, mb: { xs: 4, sm: 4, md: 4, lg: 0 } }}
                            rowSpacing={{ xs: 1, sm: 1, md: 1, lg: 0 }}
                            md={isBetweenMdAndLg ? 3 : 4}
                        >
                            <Grid container item alignItems={'center'} justifyContent={'center'} xs={12} sx={{ mb: 1 }}>
                                <MetLabel>Select Date Range </MetLabel>
                            </Grid>
                            <Grid container justifyContent={'center'} alignItems="center" sx={{ mb: 1 }}>
                                <Grid md={isBetweenMdAndLg ? 1 : 3} lg={3} item sx={{ mr: 1 }}>
                                    <MetLabel>From: </MetLabel>
                                </Grid>
                                <Grid lg={7} item>
                                    <DatePicker
                                        value={fromDate}
                                        onChange={(newDate: Dayjs | null) => setFromDate(newDate)}
                                        inputFormat="MM/DD/YYYY"
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                justifyContent={'center'}
                                alignItems="center"
                                xs={12}
                                sx={{ mb: 1, ml: { xs: 3, sm: 3, md: 0 } }}
                            >
                                <Grid md={isBetweenMdAndLg ? 1 : 3} lg={3} item sx={{ mr: 1 }}>
                                    <MetLabel>To: </MetLabel>
                                </Grid>
                                <Grid lg={7} item>
                                    <DatePicker
                                        value={toDate}
                                        onChange={(newDate: Dayjs | null) => setToDate(newDate)}
                                        inputFormat="MM/DD/YYYY"
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container item xs={8} justifyContent="center" alignItems="center">
                                <PrimaryButton sx={{ width: '100%', maxHeight: '34px' }} onClick={clearDates}>
                                    Clear
                                </PrimaryButton>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            lg={9}
                            md={isBetweenMdAndLg ? 9 : 8}
                            alignItems={'flex-end'}
                            justifyContent={'flex-end'}
                        >
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                width="100%"
                                justifyContent="flex-end"
                                alignItems={'flex-end'}
                            >
                                <ToggleButtonGroup
                                    value={chartBy}
                                    exclusive
                                    onChange={handleToggleChange}
                                    size={isTablet ? 'small' : 'medium'}
                                    sx={{ maxHeight: '34px', mb: { md: 2 } }}
                                >
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
                                </ToggleButtonGroup>
                            </Stack>
                            <If condition={!isLoading}>
                                <Then>
                                    <ResponsiveContainer width="100%" height={HEIGHT}>
                                        <BarChart
                                            data={data}
                                            margin={
                                                !isTablet
                                                    ? { top: 10, right: 30, left: 0, bottom: 0 }
                                                    : { top: 5, right: 0, left: -20, bottom: 0 }
                                            }
                                        >
                                            <XAxis dataKey="showdataby" />
                                            <YAxis />
                                            <Unless condition={isTablet}>
                                                <Tooltip />
                                            </Unless>
                                            <Bar
                                                dataKey="responses"
                                                fill={DASHBOARD.BAR_CHART.FILL_COLOR}
                                                minPointSize={2}
                                                barSize={isTablet ? 25 : 50}
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
                                        height={HEIGHT}
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
