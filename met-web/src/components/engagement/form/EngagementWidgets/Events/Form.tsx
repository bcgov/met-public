import React, { useContext } from 'react';
import { Grid2 as Grid, Divider } from '@mui/material';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { EventsContext } from './EventsContext';
import EventsInfoBlock from './EventsInfoBlock';
import { WidgetTitle } from '../WidgetTitle';
import { Button } from 'components/common/Input/Button';

const Form = () => {
    const { setWidgetDrawerOpen } = useContext(WidgetDrawerContext);
    const { setInPersonFormTabOpen, setVirtualSessionFormTabOpen, widget } = useContext(EventsContext);

    if (!widget) {
        return null;
    }

    return (
        <Grid size={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid size={12}>
                <WidgetTitle widget={widget} />
                <Divider sx={{ marginTop: '0.5em' }} />
            </Grid>
            <Grid size={12} container direction="row" spacing={1} justifyContent={'flex-start'}>
                <Grid>
                    <Button
                        size="small"
                        onClick={() => {
                            setInPersonFormTabOpen(true);
                        }}
                    >
                        Add In-Person Event
                    </Button>
                </Grid>
                <Grid>
                    <Button
                        size="small"
                        onClick={() => {
                            setVirtualSessionFormTabOpen(true);
                        }}
                    >
                        Add Virtual Session
                    </Button>
                </Grid>
            </Grid>
            <Grid size={12}>
                <EventsInfoBlock />
            </Grid>
            <Grid size={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="2em">
                <Grid>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setWidgetDrawerOpen(false);
                        }}
                    >
                        Close
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Form;
