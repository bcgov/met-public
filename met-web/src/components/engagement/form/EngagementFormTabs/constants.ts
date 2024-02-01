export type EngagementFormTabValues = 'content' | 'settings' | 'User Management' | 'additional';

export const ENGAGEMENT_FORM_TABS: { [x: string]: EngagementFormTabValues } = {
    CONTENT: 'content',
    ADDITIONAL: 'additional',
    USER_MANAGEMENT: 'User Management',
    SETTINGS: 'settings',
};

export const ENGAGEMENT_UPLOADER_HEIGHT = '360px';
export const ENGAGEMENT_CROPPER_ASPECT_RATIO = 1920 / 700;
