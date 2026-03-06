import React from 'react';
import { EngagementHero } from './EngagementHero';
import { EngagementDescription } from './EngagementDescription';
import { EngagementDetailsTabs } from './EngagementDetailsTabs';
import { EngagementSurveyBlock } from './EngagementSurveyBlock';
import { SuggestedEngagements } from './SuggestedEngagements';

export enum EngagementViewSections {
    HERO = 'hero',
    DESCRIPTION = 'description',
    DETAILS_TABS = 'detailsTabs',
    CONTENT_TABS = 'contentTabs',
    PROVIDE_FEEDBACK = 'provideFeedback',
}

export const PublicEngagementView = () => {
    return (
        <main>
            <EngagementHero />
            <EngagementDescription />
            <EngagementDetailsTabs />
            <EngagementSurveyBlock />
            <SuggestedEngagements />
        </main>
    );
};

export default PublicEngagementView;

export { engagementLoaderPublic } from './EngagementLoaderPublic';
export type { EngagementLoaderPublicData } from './EngagementLoaderPublic';
export { engagementListLoader } from './EngagementListLoader';
