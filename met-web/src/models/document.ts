export type DocumentType = 'file' | 'folder';

export const DOCUMENT_TYPE: { [x: string]: DocumentType } = {
    FOLDER: 'folder',
    FILE: 'file',
};

export interface DocumentItem {
    id: number;
    title: string;
    type: DocumentType;
    url?: string;
    children?: DocumentItem[];
}
