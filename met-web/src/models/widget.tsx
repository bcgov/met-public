import { Contact } from './contact';

export interface WidgetItem {
    id: number;
    widget_id: number;
    widget_data_id: number;
}

export interface Widget {
    id: number;
    widget_type_id: number;
    engagement_id: number;
    items: WidgetItem[];
}

export interface WhoIsListeningWidget extends Widget {
    contacts: Contact[];
}

export enum WidgetType {
    WhoIsListening = 1,
}
