import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { DocumentTreeProps } from 'components/common';
import { If, Then, Else } from 'react-if';
import { DocumentItem } from 'models/document';
import { StyledTreeItem } from './StyledTreeItem';

export default function DocumentTree({ documentItem }: DocumentTreeProps) {
    return (
        <TreeView
            aria-label="documentTree"
            defaultExpanded={['3']}
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            defaultEndIcon={<div style={{ width: 24 }} />}
            sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
            <If condition={documentItem.type === 'folder'}>
                <Then>
                    <StyledTreeItem
                        labelUrl={documentItem.url}
                        nodeId={`${documentItem.id}`}
                        labelText={documentItem.title}
                        labelIcon={FolderIcon}
                    >
                        {documentItem.children?.map((document: DocumentItem) => {
                            return (
                                <StyledTreeItem
                                    nodeId={`${document.id}`}
                                    labelText={document.title}
                                    labelIcon={document.type === 'folder' ? FolderIcon : InsertDriveFileIcon}
                                    labelUrl={document.url}
                                />
                            );
                        })}
                    </StyledTreeItem>
                </Then>
                <Else>
                    <StyledTreeItem
                        nodeId={`${documentItem.id}`}
                        labelText={documentItem.title}
                        labelIcon={InsertDriveFileIcon}
                        labelUrl={documentItem.url}
                    />
                </Else>
            </If>
        </TreeView>
    );
}
