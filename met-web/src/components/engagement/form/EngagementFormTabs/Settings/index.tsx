import React from 'react';
import { EngagementSettingsContextProvider } from './EngagementSettingsContext';
import EngagementSettingsForm from './EngagementSettingsForm';
const EngagementSettings = () => {
    return (
        <EngagementSettingsContextProvider>
            <EngagementSettingsForm />
        </EngagementSettingsContextProvider>
    );
};

export default EngagementSettings;
