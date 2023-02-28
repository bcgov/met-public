import React, { useContext, useState } from 'react';
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
        location_name: yup
            .string()
            .max(50, 'Location name cannot exceed 50 characters')
            .required('Location name cannot be empty'),
        location_address: yup
            .string()
            .max(100, 'Location address cannot exceed 100 characters')
            .required('Address cannot be empty'),
        date: yup.string().defined().required('Date cannot be empty'),
        time_from: yup.string().required('Time from cannot be empty'),
        time_to: yup.string().required('Time to cannot be empty'),
    })
    .required();

type InPersonEventForm = yup.TypeOf<typeof schema>;

const InPersonEventFormDrawer = () => {
    const dispatch = useAppDispatch();
    const { inPersonFormTabOpen, setInPersonFormTabOpen, widget, loadEvents, setEvents } = useContext(EventsContext);
    const [isCreating, setIsCreating] = useState(false);

    const methods = useForm<InPersonEventForm>({
        resolver: yupResolver(schema),
    });

    const { handleSubmit, reset } = methods;

    const onSubmit: SubmitHandler<InPersonEventForm> = async (data: InPersonEventForm) => {
        if (!widget) {
            return;
        }
        const validatedData = await schema.validate(data);
        try {
            setIsCreating(true);
            const { description, location_address, location_name, date, time_from, time_to } = validatedData;
            const { dateFrom, dateTo } = formEventDates(date, time_from, time_to);

            const createdWidgetEvent = await postEvent(widget.id, {
                widget_id: widget.id,
                type: EVENT_TYPE.OPENHOUSE,
                items: [
                    {
                        description: description,
                        location_name: location_name,
                        location_address: location_address,
                        start_date: formatToUTC(dateFrom),
                        end_date: formatToUTC(dateTo),
                    },
                ],
            });
            setEvents((prevWidgetEvents: Event[]) => [...prevWidgetEvents, createdWidgetEvent]);
            dispatch(openNotification({ severity: 'success', text: 'The event was successfully added' }));
            setIsCreating(false);
            reset({});
            setInPersonFormTabOpen(false);
            loadEvents();
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'An error occurred while trying to add event' }));
            setIsCreating(false);
        }
    };

    return (
        <Drawer
            anchor="right"
            open={inPersonFormTabOpen}
            onClose={() => {
                setInPersonFormTabOpen(false);
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
                                <MetHeader3 bold>Add In-Person Event</MetHeader3>
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
                                <MetLabel sx={{ marginBottom: '2px' }}>Location Name</MetLabel>
                                <ControlledTextField
                                    name="location_name"
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
                                <MetLabel sx={{ marginBottom: '2px' }}>Location Address</MetLabel>
                                <ControlledTextField
                                    name="location_address"
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
                                    <SecondaryButton onClick={() => setInPersonFormTabOpen(false)}>
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

export default InPersonEventFormDrawer;
