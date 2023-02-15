export type EventType = 'OPENHOUSE' | 'MEETUP' | 'VIRTUAL';

export const EVENT_TYPE: { [x: string]: EventType } = {
    OPENHOUSE: 'OPENHOUSE',
    MEETUP: 'MEETUP',
    VIRTUAL: 'VIRTUAL',
};

export interface EventItem {
    id: number;
    title: string;
    venue: string;
    location: string;
    start_date: string;
    end_date: string;
    url: string;
    url_label: string;
    sort_index: number;
    widget_events_id: number;
    created_by: string;
    updated_by: string;
    created_date: string;
    updated_date: string;
    description?: string;
}

export interface Event {
    id: number;
    title: string;
    type: EventType;
    sort_index: number;
    widget_id: number;
    created_by: string;
    updated_by: string;
    event_items: EventItem[];
}
