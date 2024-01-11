import React from 'react';
import AdditionalTabContent from './AdditionalTabContent';
import { AdditionalDetailsContextProvider } from './AdditionalDetailsContext';

const EngagementAdditionalDetails = () => {
    return (
        <AdditionalDetailsContextProvider>
            <AdditionalTabContent />
        </AdditionalDetailsContextProvider>
    );
};

export default EngagementAdditionalDetails;
