import { TreeItemProps } from '@mui/lab/TreeItem';
import { SvgIconProps } from '@mui/material';

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
    parent_document_id?: number;
    children?: DocumentItem[];
}

export type DocumentTreeItemProps = TreeItemProps & {
    labelIcon: React.ElementType<SvgIconProps>;
    labelUrl: string | undefined;
    nodeId: string;
};

export type DocumentTreeProps = TreeItemProps & {
    documentItem: DocumentItem;
};

export type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    color?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: string;
    labelText: string;
};
