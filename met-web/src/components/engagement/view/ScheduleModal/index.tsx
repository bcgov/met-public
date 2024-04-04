import React, { useContext, useState } from 'react';
import { Grid, Stack, TextField, Modal } from '@mui/material';
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
import { formatToUTC } from 'components/common/dateHelper';
import { openNotificationModal } from 'services/notificationModalService/notificationModalSlice';

interface ScheduleModalProps {
    reschedule: boolean;
    open: boolean;
    updateModal: (open: boolean) => void;
}

const ScheduleModal = ({ reschedule, open, updateModal }: ScheduleModalProps) => {
    const [scheduledDate, setScheduledDate] = useState<Dayjs | null>(dayjs(Date.now()));
    const { content, savedEngagement, scheduleEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();

    const isEngagementReady = () => {
        return content && savedEngagement.description && savedEngagement.banner_url;
    };

    const handleChange = (newDate: Dayjs | null) => {
        if (newDate != null) {
            setScheduledDate(newDate);
        }
    };

    const validateDate = () => {
        if (scheduledDate && scheduledDate >= dayjs(savedEngagement.end_date)) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Please make the scheduled date before the engagement end date',
                }),
            );
            return false;
        } else {
            return true;
        }
    };

    const confirmNoSurvey = () => {
        dispatch(
            openNotificationModal({
                open: true,
                data: {
                    header: 'No survey',
                    subText: [
                        {
                            text: 'There is no survey attached to this engagement.',
                        },
                        {
                            text: ' Are you sure you want to schedule it for publish?',
                        },
                    ],
                    handleConfirm: () => {
                        proceedToScheduling();
                    },
                },
                type: 'confirm',
            }),
        );
    };

    const handleSchedule = () => {
        if (!isEngagementReady()) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Please complete engagement before scheduling it',
                }),
            );
            return;
        }
        if (savedEngagement.surveys.length < 1) {
            confirmNoSurvey();
        } else {
            proceedToScheduling();
        }
    };

    const proceedToScheduling = async () => {
        if (validateDate())
            await scheduleEngagement({
                id: savedEngagement.id,
                scheduled_date: scheduledDate !== null ? formatToUTC(scheduledDate) : '',
                status_id: EngagementStatus.Scheduled,
            });
        updateModal(false);
    };

    return (
        <Modal aria-labelledby="modal-title" open={open} onClose={() => updateModal(false)}>
            <Grid
                data-testid={'schedule-modal'}
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="space-between"
                sx={{ ...modalStyle }}
                rowSpacing={2}
            >
                <Grid container direction="row" item xs={12}>
                    <Grid item xs={12}>
                        <MetHeader1 bold sx={{ mb: 2 }}>
                            {reschedule ? 'Reschedule Engagement' : 'Schedule Engagement'}
                        </MetHeader1>
                    </Grid>
                </Grid>
                <Grid container direction="row" item xs={12}>
                    <Grid item xs={12}>
                        <MetBody sx={{ mb: 1 }}>
                            The Engagement page will be visible on the date selected below but the public won’t be able
                            to provide feedback until the public comment period opens.
                        </MetBody>
                    </Grid>
                    <Grid item xs={12}>
                        <MetBody sx={{ mb: 1, fontWeight: 'bold' }}>
                            Enter the date & time you want the Engagement page to go live.
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
                            <Grid data-testid={'desktop-datepicker'} item xs={6}>
                                <MetLabel>Date</MetLabel>
                                <DesktopDatePicker
                                    inputFormat="MM/DD/YYYY"
                                    value={scheduledDate}
                                    onChange={handleChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Grid>
                            <Grid data-testid={'time-picker'} item xs={6}>
                                <MetLabel>Time (PT)</MetLabel>
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
                        xs={12}
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1}
                        sx={{ mt: '1em' }}
                    >
                        <Stack
                            direction={{ md: 'column-reverse', lg: 'row' }}
                            spacing={1}
                            width="100%"
                            justifyContent="flex-end"
                        >
                            <SecondaryButton data-testid={'cancel-button'} onClick={() => updateModal(false)}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton
                                data-testid={'schedule-button'}
                                onClick={handleSchedule}
                                type="submit"
                                variant={'contained'}
                            >
                                Submit
                            </PrimaryButton>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default ScheduleModal;
