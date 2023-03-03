export type EventTypeLabel = 'OPENHOUSE' | 'MEETUP' | 'VIRTUAL';

export const EVENT_TYPE: { [x: string]: EventTypeLabel } = {
    OPENHOUSE: 'OPENHOUSE',
    MEETUP: 'MEETUP',
    VIRTUAL: 'VIRTUAL',
};

export interface EventItem {
    id: number;
    description: string;
    location_name: string;
    location_address: string;
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
}

export interface Event {
    id: number;
    title: string;
    type: EventTypeLabel;
    sort_index: number;
    widget_id: number;
    created_by: string;
    updated_by: string;
    event_items: EventItem[];
}
