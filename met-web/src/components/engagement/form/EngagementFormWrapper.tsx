import React, { useContext } from 'react';
import { MetPageGridContainer, MidScreenLoader } from 'components/common';
import EngagementFormTabs from './EngagementFormTabs';
import { ActionContext } from './ActionContext';
import WidgetDrawer from './WidgetDrawer';

const EngagementFormWrapper = () => {
    const { loadingSavedEngagement } = useContext(ActionContext);

    if (loadingSavedEngagement) {
        return <MidScreenLoader data-testid="loader" />;
    }

    return (
        <MetPageGridContainer container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
            <EngagementFormTabs />
            <WidgetDrawer />
        </MetPageGridContainer>
    );
};

export default EngagementFormWrapper;
