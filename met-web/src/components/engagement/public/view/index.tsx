import React from 'react';
import { EngagementHero } from './EngagementHero';
import { EngagementDescription } from './EngagementDescription';
import { EngagementContentTabs } from './EngagementContentTabs';
import { EngagementSurveyBlock } from './EngagementSurveyBlock';
import { SuggestedEngagements } from './SuggestedEngagements';

export const PublicEngagementView = () => {
    return (
        <main>
            <EngagementHero />
            <EngagementDescription />
            <EngagementContentTabs />
            <EngagementSurveyBlock />
            <SuggestedEngagements />
        </main>
    );
};

export default PublicEngagementView;

export { engagementLoader } from './EngagementLoader';
export type { EngagementLoaderData } from './EngagementLoader';
export { engagementListLoader } from './EngagementListLoader';
