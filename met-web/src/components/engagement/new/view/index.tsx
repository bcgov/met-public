import React from 'react';
import { EngagementHero } from './EngagementHero';
import { EngagementDescription } from './EngagementDescription';
import { EngagementContentTabs } from './EngagementContentTabs';
import { EngagementSurveyBlock } from './EngagementSurveyBlock';

export const ViewEngagement = () => {
    return (
        <main>
            <EngagementHero />
            <EngagementDescription />
            <EngagementContentTabs />
            <EngagementSurveyBlock />
        </main>
    );
};

export default ViewEngagement;

export { engagementLoader } from './EngagementLoader';
