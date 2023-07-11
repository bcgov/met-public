import React from 'react';
import SettingsForm from './SettingsForm';
import { ReportSettingsContextProvider } from './ReportSettingsContext';

const ReportSettings = () => {
    return (
        <ReportSettingsContextProvider>
            <SettingsForm />
        </ReportSettingsContextProvider>
    );
};

export default ReportSettings;
