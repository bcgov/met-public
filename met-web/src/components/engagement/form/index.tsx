import React from 'react';
import { ActionProvider } from './ActionContext';
import EngagementFormWrapper from './EngagementFormWrapper';

/**
 * @deprecated Use ‹EngagementForm› from engagement/admin/config/wizard
 */
const Engagement = () => {
    return (
        <ActionProvider>
            <EngagementFormWrapper />
        </ActionProvider>
    );
};

export default Engagement;
