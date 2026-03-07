import React from 'react';
import { PreviewProvider } from './PreviewContext';
import { EngagementHero } from '../public/view/EngagementHero';
import { EngagementDescription } from '../public/view/EngagementDescription';
import { EngagementDetailsTabs } from '../public/view/EngagementDetailsTabs';
import { EngagementSurveyBlock } from '../public/view/EngagementSurveyBlock';
import { EngagementSubscribeBlock } from '../public/view/EngagementSubscribeBlock';
// import { SuggestedEngagements } from 'engagements/public/view/SuggestedEngagements';
import { SubmissionStatusTypes } from 'constants/engagementStatus';

interface PreviewContentProps {
    previewStateType: SubmissionStatusTypes;
}

/**
 * Wrapper component that renders the public engagement view in preview mode.
 * Wraps the view with PreviewContext to enable placeholder rendering for missing content.
 */
export const PreviewContent: React.FC<PreviewContentProps> = ({ previewStateType }) => {
    return (
        <PreviewProvider isPreviewMode={true} showPlaceholders={true} previewStateType={previewStateType}>
            <main>
                <EngagementHero />
                <EngagementDescription />
                <EngagementDetailsTabs />
                <EngagementSurveyBlock />
                <EngagementSubscribeBlock />
                {/* SuggestedEngagements are omitted in preview mode for now */}
                {/* <SuggestedEngagements /> */}
            </main>
        </PreviewProvider>
    );
};

export default PreviewContent;
