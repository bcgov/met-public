export type DocumentType = 'file' | 'folder';

export const DOCUMENT_TYPE: { [x: string]: DocumentType } = {
    FOLDER: 'folder',
    FILE: 'file',
};

export interface DocumentItem {
    id: number;
    title: string;
    type: DocumentType;
    document_url?: string;
    children?: DocumentItem[];
}
