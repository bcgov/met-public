import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Stack, useMediaQuery, Theme, Grid, ToggleButtonGroup, CircularProgress, TextField } from '@mui/material';
import { MetPaper, MetLabel, SecondaryButton, MetToggleButton } from 'components/common';
import { DASHBOARD } from '../constants';
import { ErrorBox } from '../ErrorBox';
import { NoData } from '../NoData';
import {
    getUserResponseDetailByMonth,
    getUserResponseDetailByWeek,
} from 'services/analytics/userResponseDetailService';
import { UserResponseDetailByMonth } from '../../../models/analytics/userResponseDetail';
import { Engagement } from 'models/engagement';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { Then, If, Else, Unless } from 'react-if';
import { formatToUTC } from 'components/common/dateHelper';
import axios, { AxiosError } from 'axios';
import { HTTP_STATUS_CODES } from 'constants/httpResponseCodes';
import { useAppTranslation } from 'hooks';

interface SubmissionTrendProps {
    engagement: Engagement;
    engagementIsLoading: boolean;
}

export const dashboardCustomStyles = {
    toggleGroup: {
        maxHeight: '34px',
        mb: { md: 2 },
    },
    primaryButton: {
        width: '100%',
        maxHeight: '34px',
    },
};

const SubmissionTrend = ({ engagement, engagementIsLoading }: SubmissionTrendProps) => {
    const { t: translate } = useAppTranslation();
    const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const isExtraSmall = useMediaQuery('(max-width:299px)');
    const isBetweenMdAndLg = useMediaQuery((theme: Theme) => theme.breakpoints.between('lg', 'xl'));
    const HEIGHT = isTablet ? 200 : 250;
    const [data, setData] = useState<UserResponseDetailByMonth | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [chartBy, setChartBy] = React.useState('monthly');
    const [fromDate, setFromDate] = React.useState<Dayjs | null>(null);
    const [toDate, setToDate] = React.useState<Dayjs | null>(null);
    const marginXStyling = { marginX: isTablet ? 1 : 0 };
    const extraSmallStyling = {
        fontSize: isExtraSmall ? '12px' : 'inherit',
        width: isExtraSmall ? '40%' : 'auto',
    };

    const setErrors = (error: AxiosError) => {
        if (error.response?.status !== HTTP_STATUS_CODES.NOT_FOUND) {
            setIsError(true);
        }
    };

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
            setIsError(false);
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

    if (isLoading || engagementIsLoading) {
        return (
            <>
                <MetLabel mb={0.5}>{translate('dashboard.submissionTrend.label')}</MetLabel>
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

    if (!data) {
        return <NoData sx={{ height: HEIGHT }} />;
    }

    if (isError) {
        return <ErrorBox sx={{ height: HEIGHT }} onClick={fetchData} />;
    }

    return (
        <>
            <MetLabel mb={0.5} mt={1}>
                {translate('dashboard.submissionTrend.label')}
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
                            sx={{ mt: isTablet ? 2 : 0, mb: isTablet ? 4 : 0 }}
                            rowSpacing={isTablet ? 1 : 0}
                            md={isBetweenMdAndLg ? 3 : 4}
                        >
                            <Grid
                                container
                                item
                                alignItems={'center'}
                                justifyContent={'center'}
                                xs={12}
                                sx={{ ...marginXStyling, mb: 1 }}
                            >
                                <MetLabel>{translate('dashboard.submissionTrend.filter.label')}</MetLabel>
                            </Grid>
                            <Grid
                                container
                                item
                                sx={{ mb: 1, ...marginXStyling }}
                                direction="column"
                                alignItems="center"
                            >
                                <Stack flexDirection={'column'} alignItems={'flex-start'}>
                                    <MetLabel>{translate('dashboard.submissionTrend.filter.from')}</MetLabel>
                                    <DatePicker
                                        value={fromDate}
                                        onChange={(newDate: Dayjs | null) => setFromDate(newDate)}
                                        label="mm/dd/yyyy"
                                        inputFormat="MM/DD/YYYY"
                                        renderInput={(params) => (isExtraSmall ? <></> : <TextField {...params} />)}
                                    />
                                </Stack>
                            </Grid>
                            <Grid
                                container
                                item
                                sx={{ mb: 1, ...marginXStyling }}
                                direction="column"
                                alignItems="center"
                            >
                                <Stack flexDirection={'column'} alignItems={'flex-start'}>
                                    <MetLabel>{translate('dashboard.submissionTrend.filter.to')}</MetLabel>
                                    <DatePicker
                                        value={fromDate}
                                        onChange={(newDate: Dayjs | null) => setToDate(newDate)}
                                        label="mm/dd/yyyy"
                                        inputFormat="MM/DD/YYYY"
                                        renderInput={(params) => (isExtraSmall ? <></> : <TextField {...params} />)}
                                    />
                                </Stack>
                            </Grid>
                            <Grid container item justifyContent="center" alignItems="center">
                                <SecondaryButton
                                    sx={{
                                        ...dashboardCustomStyles.primaryButton,
                                        ...extraSmallStyling,
                                        width: isExtraSmall ? '80%' : '100%',
                                    }}
                                    onClick={clearDates}
                                >
                                    {translate('dashboard.submissionTrend.filter.reset')}
                                </SecondaryButton>
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
                                mb={1}
                            >
                                <ToggleButtonGroup
                                    value={chartBy}
                                    exclusive
                                    onChange={handleToggleChange}
                                    size={isTablet ? 'small' : 'medium'}
                                    sx={{
                                        ...dashboardCustomStyles.toggleGroup,
                                        ...marginXStyling,
                                    }}
                                >
                                    <MetToggleButton value="weekly" sx={extraSmallStyling}>
                                        {translate('dashboard.submissionTrend.filter.toggleBy.0')}
                                    </MetToggleButton>
                                    <MetToggleButton value="monthly" sx={extraSmallStyling}>
                                        {translate('dashboard.submissionTrend.filter.toggleBy.1')}
                                    </MetToggleButton>
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
