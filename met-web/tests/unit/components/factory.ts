import '@testing-library/jest-dom';
import { createDefaultSurvey, Survey } from 'models/survey';
import { createDefaultEngagement, createDefaultEngagementMetadata, Engagement, EngagementMetadata } from 'models/engagement';
import { EngagementStatus } from 'constants/engagementStatus';
import { WidgetType, Widget, WidgetItem } from 'models/widget';
import { Event, EventItem } from 'models/event';

const survey: Survey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: 1,
};

const surveys = [survey];

const draftEngagement: Engagement = {
    ...createDefaultEngagement(),
    id: 1,
    name: 'Test Engagement',
    created_date: '2022-09-14 20:16:29.846877',
    rich_content:
        '{"blocks":[{"key":"29p4m","text":"Test content","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    content: 'Test content',
    rich_description:
        '{"blocks":[{"key":"bqupg","text":"Test description","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    description: 'Test description',
    start_date: '2022-09-01',
    end_date: '2022-09-30',
    surveys: surveys,
    engagement_status: {
        id: EngagementStatus.Draft,
        status_name: 'Draft',
    },
};

const openEngagement = {
    ...draftEngagement,
    id: 2,
    name: 'Open Engagement',
    engagement_status: {
        id: EngagementStatus.Published,
        status_name: 'Open',
    },
    start_date: '2022-09-01',
    end_date: '2025-09-30',
    created_date: '2022-09-15 10:00:00',
    published_date: '2022-09-19 10:00:00',
    surveys: surveys,
    submissions_meta_data: {
        total: 1,
        pending: 0,
        needs_further_review: 0,
        rejected: 0,
        approved: 1,
    },
};

const mockEventItem: EventItem = {
    id: 1,
    description: 'description',
    location_name: 'location name',
    location_address: 'location address',
    start_date: 'start date',
    end_date: 'end date',
    url: 'link',
    url_label: 'link label',
    sort_index: 1,
    widget_events_id: 0,
    created_by: 'test',
    updated_by: 'test',
    created_date: 'test date',
    updated_date: 'test date',
};

const mockEvent: Event = {
    id: 1,
    title: 'Jace',
    type: 'OPENHOUSE',
    sort_index: 1,
    widget_id: 1,
    created_by: 'test',
    updated_by: 'test',
    event_items: [mockEventItem],
};

const eventWidgetItem: WidgetItem = {
    id: 1,
    widget_id: 1,
    widget_data_id: 1,
    sort_index: 1,
};

const eventWidget: Widget = {
    id: 1,
    widget_type_id: WidgetType.Events,
    engagement_id: 1,
    items: [eventWidgetItem],
};

const engagementMetadata: EngagementMetadata = {
    ...createDefaultEngagementMetadata(),
    engagement_id: 1,
};

export { draftEngagement, openEngagement, surveys, mockEvent, mockEventItem, eventWidgetItem, eventWidget, engagementMetadata };
