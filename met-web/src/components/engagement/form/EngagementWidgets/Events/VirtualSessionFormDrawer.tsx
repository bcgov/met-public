import React, { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { Grid } from '@mui/material';
import { MetHeader3, MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch } from 'hooks';
import { EventsContext } from './EventsContext';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { openNotification } from 'services/notificationService/notificationSlice';
import { postEvent } from 'services/widgetService/EventService';
import { Event, EVENT_TYPE } from 'models/event';
import { formatToUTC } from 'components/common/dateHelper';
import { formEventDates } from './utils';

const schema = yup
    .object({
        description: yup.string().max(500, 'Description cannot exceed 500 characters'),
        session_link: yup.string().required('Session link cannot be empty'),
        session_link_text: yup.string().default('Click here to register').required('Session Link Text cannot be empty'),
        date: yup.string().defined().required('Date cannot be empty'),
        time_from: yup.string().required('Time from cannot be empty'),
        time_to: yup.string().required('Time to cannot be empty'),
    })
    .required();

type VirtualSessionForm = yup.TypeOf<typeof schema>;

const VirtualSessionFormDrawer = () => {
    const dispatch = useAppDispatch();
    const { virtualSessionFormTabOpen, setVirtualSessionFormTabOpen, widget, loadEvents, setEvents } =
        useContext(EventsContext);
    const [isCreating, setIsCreating] = useState(false);

    const methods = useForm<VirtualSessionForm>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        methods.setValue('session_link_text', 'Click here to register');
    }, []);

    const { handleSubmit, reset } = methods;

    const onSubmit: SubmitHandler<VirtualSessionForm> = async (data: VirtualSessionForm) => {
        if (!widget) {
            return;
        }
        const validatedData = await schema.validate(data);
        try {
            setIsCreating(true);
            const { description, session_link, session_link_text, date, time_from, time_to } = validatedData;
            const { dateFrom, dateTo } = formEventDates(date, time_from, time_to);
            const createdWidgetEvent = await postEvent(widget.id, {
                widget_id: widget.id,
                type: EVENT_TYPE.VIRTUAL.label,
                items: [
                    {
                        description: description,
                        url: session_link,
                        url_label: session_link_text,
                        start_date: formatToUTC(dateFrom),
                        end_date: formatToUTC(dateTo),
                    },
                ],
            });
            setEvents((prevWidgetEvents: Event[]) => [...prevWidgetEvents, createdWidgetEvent]);
            dispatch(openNotification({ severity: 'success', text: 'The event was successfully added' }));
            setIsCreating(false);
            reset({});
            setVirtualSessionFormTabOpen(false);
            loadEvents();
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'An error occurred while trying to add event' }));
            setIsCreating(false);
        }
    };

    return (
        <Drawer
            anchor="right"
            open={virtualSessionFormTabOpen}
            onClose={() => {
                setVirtualSessionFormTabOpen(false);
            }}
        >
            <Box sx={{ width: '40vw', paddingTop: '7em' }} role="presentation">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid
                            container
                            direction="row"
                            alignItems="baseline"
                            justifyContent="flex-start"
                            spacing={2}
                            padding="2em"
                        >
                            <Grid item xs={12}>
                                <MetHeader3 bold>Virtual Information Session</MetHeader3>
                                <Divider sx={{ marginTop: '1em' }} />
                            </Grid>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Description</MetLabel>
                                <ControlledTextField
                                    name="description"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    fullWidth
                                    size="small"
                                    multiline
                                    minRows={4}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Date</MetLabel>
                                <ControlledTextField
                                    name="date"
                                    type="date"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item>
                                <MetLabel sx={{ marginBottom: '2px' }}>Time - From</MetLabel>
                                <ControlledTextField
                                    name="time_from"
                                    type="time"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item>
                                <MetLabel sx={{ marginBottom: '2px' }}>Time - To</MetLabel>
                                <ControlledTextField
                                    name="time_to"
                                    type="time"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Virtual Session Link</MetLabel>
                                <ControlledTextField
                                    name="session_link"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Virtual Session Link - Text Displayed</MetLabel>
                                <ControlledTextField
                                    name="session_link_text"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                container
                                direction="row"
                                spacing={1}
                                justifyContent={'flex-start'}
                                marginTop="2em"
                            >
                                <Grid item>
                                    <PrimaryButton type="submit" loading={isCreating}>{`Save & Close`}</PrimaryButton>
                                </Grid>
                                <Grid item>
                                    <SecondaryButton onClick={() => setVirtualSessionFormTabOpen(false)}>
                                        Cancel
                                    </SecondaryButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </FormProvider>
            </Box>
        </Drawer>
    );
};

export default VirtualSessionFormDrawer;
