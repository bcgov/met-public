import React from 'react';
import WidgetDrawer from './WidgetDrawer';
import { WidgetDrawerProvider } from './WidgetDrawerContext';
import WidgetsBlock from './WidgetsBlock';

export const WidgetDrawerWrapper = () => {
    return (
        <WidgetDrawerProvider>
            <WidgetsBlock />
            <WidgetDrawer />
        </WidgetDrawerProvider>
    );
};

export default WidgetDrawerWrapper;
