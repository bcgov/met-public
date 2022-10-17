import React, { useContext } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import WidgetOptionCards from './WidgetOptionCards';
import WhoIsListeningForm from './WhoIsListeningForm';
import { WidgetDrawerContext } from './WidgetDrawerContext';

const WidgetDrawerTabs = () => {
    const { widgetDrawerTabValue } = useContext(WidgetDrawerContext);
    return (
        <>
            <TabContext value={widgetDrawerTabValue}>
                <TabPanel sx={{ width: '100%' }} value="widgetOptions">
                    <WidgetOptionCards />
                </TabPanel>
                <TabPanel sx={{ width: '100%' }} value="whoIsListeningForm">
                    <WhoIsListeningForm />
                </TabPanel>
            </TabContext>
        </>
    );
};

export default WidgetDrawerTabs;
