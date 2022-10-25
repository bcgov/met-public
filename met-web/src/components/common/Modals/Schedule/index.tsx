import React, { useContext, useState } from 'react';
import { Grid, Stack, useMediaQuery, Theme, TextField, Modal } from '@mui/material';
import { modalStyle, PrimaryButton, SecondaryButton, MetHeader1, MetBody, MetLabel } from 'components/common';
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch } from 'hooks';
import { EngagementStatus } from 'constants/engagementStatus';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ActionContext } from 'components/engagement/view/ActionContext';
import { openNotification } from 'services/notificationService/notificationSlice';

interface ScheduleModalProps {
    reschedule: boolean;
    open: boolean;
    updateModal: (open: boolean) => void;
}

const ScheduleModal = ({ reschedule, open, updateModal }: ScheduleModalProps) => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const [scheduledDate, setScheduledDate] = useState<Dayjs | null>(dayjs(Date.now()));
    const { savedEngagement, scheduleEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();

    const handleChange = (newDate: Dayjs | null) => {
        if (newDate != null) {
            setScheduledDate(newDate);
        }
    };

    const handleSchedule = async () => {
        if (savedEngagement.surveys.length === 0) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Please add a survey to the engagement before scheduling it',
                }),
            );
            return;
        }
        if (scheduledDate)
            await scheduleEngagement({
                id: savedEngagement.id,
                scheduled_date: scheduledDate.format('YYYY-MM-DD HH:mm:ss'),
                status_id: EngagementStatus.Scheduled,
            });

        updateModal(false);
        console.log(savedEngagement);
    };

    return (
        <Modal aria-labelledby="modal-title" open={open} onClose={() => updateModal(false)}>
            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="space-between"
                sx={{ ...modalStyle }}
                rowSpacing={2}
            >
                <Grid container direction="row" item xs={12}>
                    <Grid item xs={12}>
                        <MetHeader1 bold={true} sx={{ mb: 2 }}>
                            {reschedule ? 'Reschedule Engagement' : 'Schedule Engagement'}
                        </MetHeader1>
                    </Grid>
                </Grid>
                <Grid container direction="row" item xs={12}>
                    <Grid item xs={12}>
                        <MetBody sx={{ mb: 1 }}>
                            (The Engagement page will be visible on the date selected but the survey won't be accessible
                            until the Engagement Date.)
                        </MetBody>
                    </Grid>
                    <Grid item xs={12}>
                        <MetBody sx={{ mb: 1, fontWeight: 'bold' }}>
                            Enter the date & time you want the Engagement to go live.
                        </MetBody>
                    </Grid>
                    <Grid
                        item
                        container
                        direction={{ xs: 'column', sm: 'row' }}
                        xs={12}
                        justifyContent="flex-start"
                        spacing={1}
                        sx={{ mt: '1em' }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid item xs={6}>
                                <MetLabel>Date</MetLabel>
                                <DesktopDatePicker
                                    inputFormat="MM/DD/YYYY"
                                    value={scheduledDate}
                                    onChange={handleChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <MetLabel>Time</MetLabel>
                                <TimePicker
                                    value={scheduledDate}
                                    onChange={handleChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Grid>
                        </LocalizationProvider>
                    </Grid>
                    <Grid
                        item
                        container
                        direction={{ xs: 'column', sm: 'row' }}
                        xs={12}
                        justifyContent="flex-end"
                        spacing={1}
                        sx={{ mt: '1em' }}
                    >
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                            width="100%"
                            justifyContent="flex-end"
                        >
                            {isSmallScreen ? (
                                <>
                                    <PrimaryButton onClick={handleSchedule} type="submit" variant={'contained'}>
                                        Submit
                                    </PrimaryButton>
                                    <SecondaryButton onClick={() => updateModal(false)}>Cancel</SecondaryButton>
                                </>
                            ) : (
                                <>
                                    <SecondaryButton onClick={() => updateModal(false)}>Cancel</SecondaryButton>
                                    <PrimaryButton onClick={handleSchedule} type="submit" variant={'contained'}>
                                        Submit
                                    </PrimaryButton>
                                </>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default ScheduleModal;
