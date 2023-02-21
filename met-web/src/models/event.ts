export type EventType = 0 | 1 | 2;

export type EventTypeLabel = 'OPENHOUSE' | 'MEETUP' | 'VIRTUAL';

export const EVENT_TYPE: { [x: string]: { value: EventType; label: EventTypeLabel } } = {
    OPENHOUSE: {
        value: 0,
        label: 'OPENHOUSE',
    },
    MEETUP: {
        value: 1,
        label: 'MEETUP',
    },
    VIRTUAL: {
        value: 2,
        label: 'VIRTUAL',
    },
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
    type: EventType | EventTypeLabel;
    sort_index: number;
    widget_id: number;
    created_by: string;
    updated_by: string;
    event_items: EventItem[];
}
