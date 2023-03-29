export enum EngagementStatus {
    Draft = 1,
    Published = 2,
    Closed = 3,
    Scheduled = 4,
}

export type EngagementStatusType = 'Draft' | 'Published' | 'Closed' | 'Scheduled';

export const ENGAGEMENT_STATUS: { [status: string]: EngagementStatusType } = {
    DRAFT: 'Draft',
    PUBLISHED: 'Published',
    CLOSED: 'Closed',
    SCHEDULED: 'Scheduled',
};

export enum SubmissionStatus {
    Upcoming = 1,
    Open = 2,
    Closed = 3,
}

export enum EngagementDisplayStatus {
    Draft = 1,
    Published = 2,
    Closed = 3,
    Scheduled = 4,
    Upcoming = 5,
    Open = 6,
}

export type SubmissionStatusTypes = 'Upcoming' | 'Open' | 'Closed';

export const SUBMISSION_STATUS: { [status: string]: SubmissionStatusTypes } = {
    UPCOMING: 'Upcoming',
    OPEN: 'Open',
    CLOSED: 'Closed',
};
