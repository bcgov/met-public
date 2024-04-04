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
import MapForm from './Map';
import VideoForm from './Video';
import TimelineForm from './Timeline';
import SubscribeForm from './Subscribe';
import PollForm from './Poll';

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
                <TabPanel sx={{ width: '100%' }} value={WidgetTabValues.SUBSCRIBE_FORM}>
                    <SubscribeForm />
                </TabPanel>
                <TabPanel sx={{ width: '100%' }} value={WidgetTabValues.PHASES_FORM}>
                    <Phases />
                </TabPanel>
                <TabPanel sx={{ width: '100%' }} value={WidgetTabValues.EVENTS_FORM}>
                    <EventsForm />
                </TabPanel>
                <TabPanel sx={{ width: '100%' }} value={WidgetTabValues.MAP_FORM}>
                    <MapForm />
                </TabPanel>
                <TabPanel sx={{ width: '100%' }} value={WidgetTabValues.VIDEO_FORM}>
                    <VideoForm />
                </TabPanel>
                <TabPanel sx={{ width: '100%' }} value={WidgetTabValues.TIMELINE_FORM}>
                    <TimelineForm />
                </TabPanel>
                <TabPanel sx={{ width: '100%' }} value={WidgetTabValues.POLL_FORM}>
                    <PollForm />
                </TabPanel>
            </TabContext>
        </>
    );
};

export default WidgetDrawerTabs;
