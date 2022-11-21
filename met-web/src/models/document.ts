export interface DocumentItem {
    id: number;
    name: string;
    folder: boolean;
    document_url?: string;
    items?: DocumentItem[];
}
