import React, { useContext } from 'react';
import { MetPageGridContainer, MidScreenLoader } from 'components/common';
import EngagementFormTabs from './EngagementFormTabs';
import EngagementFormModal from './EngagementFormModal';
import { ActionContext } from './ActionContext';

const EngagementFormWrapper = () => {
    const { loadingSavedEngagement } = useContext(ActionContext);

    if (loadingSavedEngagement) {
        return <MidScreenLoader />;
    }

    return (
        <MetPageGridContainer container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
            <EngagementFormTabs />
            <EngagementFormModal />
        </MetPageGridContainer>
    );
};

export default EngagementFormWrapper;
