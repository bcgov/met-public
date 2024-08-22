import React from 'react';
import WidgetDrawer from 'components/engagement/form/EngagementWidgets/WidgetDrawer';
import { WidgetDrawerProvider } from 'components/engagement/form/EngagementWidgets/WidgetDrawerContext';
import { WidgetPickerButton } from './WidgetPickerButton';
import { WidgetLocation } from 'models/widget';
import { ActionProvider } from 'components/engagement/form/ActionContext';

export const WidgetPicker = ({ location }: { location: WidgetLocation }) => {
    return (
        <ActionProvider>
            <WidgetDrawerProvider>
                <WidgetPickerButton location={location} />
                <WidgetDrawer />
            </WidgetDrawerProvider>
        </ActionProvider>
    );
};

export default WidgetPicker;
