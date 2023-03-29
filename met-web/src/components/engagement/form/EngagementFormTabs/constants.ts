export type EngagementFormTabValues = 'details' | 'settings' | 'User Management';

export const ENGAGEMENT_FORM_TABS: { [x: string]: EngagementFormTabValues } = {
    DETAILS: 'details',
    SETTINGS: 'settings',
    USER_MANAGEMENT: 'User Management',
};

export const ENGAGMENET_UPLOADER_HEIGHT = '360px';
export const ENGAGEMENT_CROPPER_ASPECT_RATIO = 1920 / 700;

export const ENGAGEMENT_PROJECT_TYPES: string[] = [
    'Energy-Electricity',
    'Energy - Petroleum & Natural Gas',
    'Food Processing',
    'Industrial',
    'Mines',
    'Other',
    'Tourist Destination Resorts',
    'Transportation',
    'Waste disposal',
    'Water Management',
];
