import React, { useEffect } from 'react';
import { Button } from 'components/common/Input';
import { StaticDatePicker } from '@mui/x-date-pickers';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid } from '@mui/material';
import { BodyText } from 'components/common/Typography';
import dayjs, { Dayjs } from 'dayjs';
import { When } from 'react-if';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/pro-regular-svg-icons';
import { PickersDayProps } from '@mui/lab';
import { colors } from 'styles/Theme';
import { Link } from 'components/common/Navigation';
import { EngagementStatusChip } from 'components/common/Indicators';
import { SubmissionStatus } from 'constants/engagementStatus';

export const DatesCalculator = () => {
    const engagementForm = useFormContext();
    const { control, reset, watch, getValues, trigger } = engagementForm;
    const [isPickingDate, setIsPickingDate] = React.useState(false);
    const [numberOfDays, setNumberOfDays] = React.useState(0);
    const [disableDatesBefore, setDisableDatesBefore] = React.useState<Dayjs | undefined>(dayjs());
    const [startDate, endDate] = watch(['start_date', 'end_date']);

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === 'start_date') {
                setDisableDatesBefore(value.start_date.clone().add(1, 'day'));
                if (value.start_date.isAfter(value.end_date) || !value.end_date) {
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
            if (!value?.end_date) return;
            setNumberOfDays(value.end_date.clone().add(1, 'second').diff(value.start_date, 'days'));
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const getDayStyle = (props: PickersDayProps<Dayjs | null>) => {
        const standardStyle = {
            margin: 0,
            width: '40px',
            height: '40px',
        };
        if (
            getValues().start_date &&
            dayjs(props.day).isSame(getValues().start_date, 'day') &&
            (dayjs(props.day).isSame(getValues().end_date, 'day') || !getValues().end_date)
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
        if (dayjs(props.day).isSame(getValues().start_date, 'day')) {
            // First day of the range - rounded left side
            return {
                ...standardStyle,
                backgroundColor: colors.surface.blue[80],
                color: colors.type.inverted.primary,
                borderRadius: '50% 0 0 50%',
                border: `1px solid ${colors.surface.blue[80]}`,
                borderRight: 'none',
            };
        }
        if (!getValues().end_date) return standardStyle;
        if (dayjs(props.day).isSame(getValues().end_date, 'day')) {
            // Last day of the range - rounded right side
            return {
                ...standardStyle,
                backgroundColor: colors.surface.blue[80],
                color: colors.type.inverted.primary,
                borderRadius: '0 50% 50% 0',
                border: `1px solid ${colors.surface.blue[80]}`,
                borderLeft: 'none',
            };
        }
        if (dayjs(props.day).isAfter(getValues().start_date) && dayjs(props.day).isBefore(getValues().end_date)) {
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
        <Grid container mt={2} direction="column" spacing={2}>
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
                                        day: (props: PickersDayProps<Dayjs | null>) => {
                                            return {
                                                ...props,
                                                sx: getDayStyle(props),
                                            };
                                        },
                                    }}
                                    showDaysOutsideCurrentMonth
                                    disablePast
                                    displayStaticWrapperAs="desktop"
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
                                        day: (props: PickersDayProps<Dayjs | null>) => {
                                            return {
                                                ...props,
                                                sx: getDayStyle(props),
                                            };
                                        },
                                    }}
                                    disableHighlightToday
                                    showDaysOutsideCurrentMonth
                                    disablePast
                                    displayStaticWrapperAs="desktop"
                                    minDate={disableDatesBefore}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Grid item container direction="row" alignItems={'center'} spacing={2}>
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
                    <Grid item container direction="column" xs={12} spacing={2}>
                        <Grid item>
                            <BodyText bold sx={{ color: colors.surface.blue.bc }}>
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
                        <Grid item>
                            <BodyText bold size="large" sx={{ color: colors.surface.blue[80], lineHeight: 1 }}>
                                <span style={{ fontSize: '72px' }}>{numberOfDays}</span> days
                            </BodyText>
                        </Grid>
                    </Grid>
                )}
                <Grid item>
                    <Button onClick={() => setIsPickingDate(true)} icon={<FontAwesomeIcon icon={faCalendar} />}>
                        {Boolean(numberOfDays) ? 'Change Dates' : 'Select Dates'}
                    </Button>
                </Grid>
            </When>
        </Grid>
    );
};
