import React, { useContext } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import WidgetOptionCards from './WidgetOptionCards';
import WhoIsListeningForm from './WhoIsListeningForm';
import { WidgetDrawerContext } from './WidgetDrawerContext';
import { WidgetTabValues } from './type';
import WhoIsListeningCreate from './WhoIsListeningCreate';

const WidgetDrawerTabs = () => {
    const { widgetDrawerTabValue } = useContext(WidgetDrawerContext);
    return (
        <>
            <TabContext value={widgetDrawerTabValue}>
                <TabPanel sx={{ width: '100%' }} value={WidgetTabValues.WIDGET_OPTIONS}>
                    <WidgetOptionCards />
                </TabPanel>
                <TabPanel sx={{ width: '100%' }} value={WidgetTabValues.WHO_IS_LISTENING_FORM}>
                    <WhoIsListeningForm />
                </TabPanel>
            </TabContext>
        </>
    );
};

export default WidgetDrawerTabs;
