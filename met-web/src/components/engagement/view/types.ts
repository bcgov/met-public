import { Engagement } from 'models/engagement';

export interface EngagementBannerProps {
    savedEngagement: Engagement;
    children?: JSX.Element;
}
