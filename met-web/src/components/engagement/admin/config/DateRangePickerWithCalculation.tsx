import React, { useEffect } from 'react';
import { Button } from 'components/common/Input';
import { PickerDayOwnerState, StaticDatePicker } from '@mui/x-date-pickers';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid } from '@mui/material';
import { BodyText } from 'components/common/Typography';
import dayjs, { Dayjs } from 'dayjs';
import { When } from 'react-if';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/pro-regular-svg-icons';
import { colors } from 'styles/Theme';
import { Link } from 'components/common/Navigation';
import { EngagementStatusChip } from 'components/common/Indicators';
import { SubmissionStatus } from 'constants/engagementStatus';
import { OutlineBox } from 'components/common/Layout';

export const DateRangePickerWithCalculation = () => {
    const engagementForm = useFormContext();
    const { control, reset, watch, setValue, getValues, trigger } = engagementForm;
    const [numberOfDays, setNumberOfDays] = React.useState(0);
    const [disableDatesBefore, setDisableDatesBefore] = React.useState<Dayjs | undefined>(dayjs());
    const [startDate, endDate] = watch(['start_date', 'end_date']);

    const isPickingDate = !watch('_dateConfirmed');

    const setIsPickingDate = (value: boolean) => {
        setValue('_dateConfirmed', !value);
    };

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === 'start_date') {
                setDisableDatesBefore(value.start_date.clone().add(1, 'day'));
                if (!value.end_date || value.start_date.isAfter(value.end_date.clone().subtract(1, 'day'))) {
                    reset({
                        ...value,
                        end_date: value.start_date.clone().add(1, 'day'),
                    });
                }
                trigger('start_date');
                trigger('end_date');
            }
            if (name === 'end_date') {
                trigger('end_date');
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        if (startDate && endDate) {
            setNumberOfDays(endDate.clone().add(1, 'second').diff(startDate, 'days'));
        }
    }, [startDate, endDate]);

    const getDayStyle = (ownerState: PickerDayOwnerState) => {
        const day = dayjs(ownerState.day as Dayjs);
        const standardStyle = {
            margin: 0,
            width: '40px',
            height: '40px',
            color: colors.type.regular.primary,
        };
        if (
            getValues().start_date &&
            day.isSame(getValues().start_date, 'day') &&
            (day.isSame(getValues().end_date, 'day') || !getValues().end_date)
        ) {
            // First and last day of the range - rounded corners
            return {
                ...standardStyle,
                backgroundColor: colors.surface.blue[80],
                color: colors.type.inverted.primary,
                border: `1px solid ${colors.surface.blue[80]}`,
            };
        }
        if (!getValues().start_date) return standardStyle;
        if (day.isSame(getValues().start_date, 'day')) {
            // First day of the range - rounded left side
            return {
                ...standardStyle,
                backgroundColor: colors.surface.blue[80],
                '&.MuiButtonBase-root:not(.Mui-selected)': {
                    color: colors.type.inverted.primary,
                },
                borderRadius: '50% 0 0 50%',
                border: `1px solid ${colors.surface.blue[80]}`,
                borderRight: 'none',
            };
        }
        if (!getValues().end_date) return standardStyle;
        if (day.isSame(getValues().end_date, 'day')) {
            // Last day of the range - rounded right side
            return {
                ...standardStyle,
                backgroundColor: colors.surface.blue[80],
                color: colors.type.inverted.primary,
                borderRadius: '0 50% 50% 0',
                border: `1px solid ${colors.surface.blue[80]}`,
                borderLeft: 'none',
                '&:hover': {
                    backgroundColor: colors.surface.blue[70],
                },
            };
        }
        if (day.isAfter(getValues().start_date) && day.isBefore(getValues().end_date)) {
            // Middle days of the range - no rounded corners
            return {
                ...standardStyle,
                backgroundColor: colors.surface.blue[10],
                borderRadius: 0,
                borderTop: `1px solid ${colors.surface.blue[80]}`,
                borderBottom: `1px solid ${colors.surface.blue[80]}`,
            };
        }
        return standardStyle;
    };

    return (
        <Grid container mt={2} direction="column" spacing={2} sx={{ mt: 0 }}>
            <When condition={isPickingDate}>
                <Grid item container direction="row">
                    <Grid item>
                        <BodyText bold>Start Date</BodyText>
                        <Controller
                            name="start_date"
                            rules={{ required: 'Start date is required' }}
                            control={control}
                            render={({ field }) => (
                                <StaticDatePicker
                                    {...field}
                                    slotProps={{
                                        day: (ownerState) => {
                                            return {
                                                ...ownerState,
                                                sx: getDayStyle(ownerState),
                                            };
                                        },
                                    }}
                                    showDaysOutsideCurrentMonth
                                    disablePast
                                    displayStaticWrapperAs="desktop"
                                    slots={{ actionBar: () => null }}
                                    fixedWeekNumber={6}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item>
                        <BodyText bold>End Date</BodyText>
                        <Controller
                            name="end_date"
                            rules={{ required: 'End date is required' }}
                            control={control}
                            render={({ field }) => (
                                <StaticDatePicker
                                    {...field}
                                    value={field.value || undefined}
                                    disabled={!startDate}
                                    slotProps={{
                                        day: (ownerState) => {
                                            return {
                                                ...ownerState,
                                                sx: getDayStyle(ownerState),
                                            };
                                        },
                                    }}
                                    disableHighlightToday
                                    showDaysOutsideCurrentMonth
                                    disablePast
                                    displayStaticWrapperAs="desktop"
                                    minDate={disableDatesBefore}
                                    slots={{ actionBar: () => null }}
                                    fixedWeekNumber={6}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Grid item container direction="row" alignItems="center" spacing={2}>
                    <Grid item>
                        <Button variant="primary" onClick={() => setIsPickingDate(false)}>
                            Select
                        </Button>
                    </Grid>
                    <Grid item>
                        <Link
                            sx={{ cursor: 'pointer', color: colors.type.regular.primary }}
                            onClick={() => {
                                reset({
                                    ...getValues(),
                                    start_date: undefined,
                                    end_date: undefined,
                                });
                                setNumberOfDays(0);
                                setIsPickingDate(false);
                            }}
                        >
                            Reset
                        </Link>
                    </Grid>
                </Grid>
            </When>
            <When condition={!isPickingDate}>
                {Boolean(numberOfDays) && (
                    <Grid item>
                        <OutlineBox sx={{ maxWidth: '400px' }}>
                            <Grid container direction="column" xs={12} spacing={2}>
                                <Grid item>
                                    <BodyText bold sx={{ color: 'primary.main' }}>
                                        Engagement Feedback Dates
                                    </BodyText>
                                </Grid>
                                <Grid item container direction="row" spacing={1}>
                                    <Grid item>
                                        <EngagementStatusChip statusId={SubmissionStatus.Open} />
                                    </Grid>
                                    <Grid item>
                                        <BodyText bold display="inline">
                                            {dayjs(startDate).format('MMM D, YYYY')}{' '}
                                        </BodyText>
                                    </Grid>
                                    <Grid item>
                                        <BodyText thin display="inline">
                                            (12:01 AM)
                                        </BodyText>
                                    </Grid>
                                </Grid>
                                <Grid item container direction="row" spacing={1}>
                                    <Grid item>
                                        <EngagementStatusChip statusId={SubmissionStatus.Closed} />
                                    </Grid>
                                    <Grid item>
                                        <BodyText bold display="inline">
                                            {dayjs(endDate).format('MMM D, YYYY')}{' '}
                                        </BodyText>
                                    </Grid>
                                    <Grid item>
                                        <BodyText thin display="inline">
                                            (11:59 PM)
                                        </BodyText>
                                    </Grid>
                                </Grid>
                                <Grid item sx={{ mb: 1 }}>
                                    <BodyText bold size="large" sx={{ color: 'primary.light', lineHeight: 1 }}>
                                        <span style={{ fontSize: '72px' }}>{numberOfDays}</span>
                                        <span style={{ position: 'relative', bottom: '32px', fontSize: '24px' }}>
                                            {' '}
                                            days
                                        </span>
                                    </BodyText>
                                </Grid>
                            </Grid>
                        </OutlineBox>
                    </Grid>
                )}
                <Grid item sx={{ '&.MuiGrid-root': { paddingTop: 0 } }}>
                    <Button onClick={() => setIsPickingDate(true)} icon={<FontAwesomeIcon icon={faCalendar} />}>
                        {numberOfDays ? 'Change Dates' : 'Select Dates'}
                    </Button>
                </Grid>
            </When>
        </Grid>
    );
};
