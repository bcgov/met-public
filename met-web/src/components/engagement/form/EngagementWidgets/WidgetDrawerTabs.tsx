import React, { useContext } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import WidgetOptionCards from './WidgetOptionCards';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { WidgetTabValues } from './type';
import WhoIsListening from './WhoIsListening';
import Documents from './Documents';
import Phases from './Phases';
import EventsForm from './Events';

const WidgetDrawerTabs = () => {
    const { widgetDrawerTabValue } = useContext(WidgetDrawerContext);
    return (
        <>
            <TabContext value={widgetDrawerTabValue}>
                <TabPanel sx={{ width: '100%' }} value={WidgetTabValues.WIDGET_OPTIONS}>
                    <WidgetOptionCards />
                </TabPanel>
                <TabPanel sx={{ width: '100%' }} value={WidgetTabValues.WHO_IS_LISTENING_FORM}>
                    <WhoIsListening />
                </TabPanel>
                <TabPanel sx={{ width: '100%' }} value={WidgetTabValues.DOCUMENT_FORM}>
                    <Documents />
                </TabPanel>
                <TabPanel sx={{ width: '100%' }} value={WidgetTabValues.PHASES_FORM}>
                    <Phases />
                </TabPanel>
                <TabPanel sx={{ width: '100%' }} value={WidgetTabValues.EVENTS_FORM}>
                    <EventsForm />
                </TabPanel>
            </TabContext>
        </>
    );
};

export default WidgetDrawerTabs;
