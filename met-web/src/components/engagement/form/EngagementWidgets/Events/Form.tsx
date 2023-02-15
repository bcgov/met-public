import React, { useContext } from 'react';
import { Grid, Divider } from '@mui/material';
import { PrimaryButton, MetHeader3, WidgetButton } from 'components/common';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { EventsContext } from './EventsContext';
import EventsInfoBlock from './EventsInfoBlock';

const Form = () => {
    const { handleWidgetDrawerOpen } = useContext(WidgetDrawerContext);
    const { setInPersonFormTabOpen } = useContext(EventsContext);

    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid item xs={12}>
                <MetHeader3 bold>Events</MetHeader3>
                <Divider sx={{ marginTop: '1em' }} />
            </Grid>
            <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="2em">
                <Grid item>
                    <WidgetButton
                        onClick={() => {
                            setInPersonFormTabOpen(true);
                        }}
                    >
                        Add In-Person Event
                    </WidgetButton>
                </Grid>
                <Grid item>
                    <WidgetButton>Add Virtual Event</WidgetButton>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <EventsInfoBlock />
            </Grid>
            <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="8em">
                <Grid item>
                    <PrimaryButton
                        onClick={() => {
                            handleWidgetDrawerOpen(false);
                        }}
                    >
                        Close
                    </PrimaryButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Form;
