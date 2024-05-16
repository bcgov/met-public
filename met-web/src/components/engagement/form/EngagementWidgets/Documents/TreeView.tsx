import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons/faChevronDown';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight';
import { faFolder } from '@fortawesome/pro-regular-svg-icons/faFolder';
import { faFileLines } from '@fortawesome/pro-regular-svg-icons/faFileLines';
import { If, Then, Else } from 'react-if';
import { DocumentItem, DOCUMENT_TYPE } from 'models/document';
import { StyledTreeItem } from './StyledTreeItem';
import { TreeItemProps } from '@mui/lab/TreeItem';

type DocumentTreeProps = TreeItemProps & {
    documentItem: DocumentItem;
};

export default function DocumentTree({ documentItem }: DocumentTreeProps) {
    return (
        <TreeView
            aria-label="documentTree"
            defaultExpanded={['3']}
            defaultCollapseIcon={<FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '18px' }} />}
            defaultExpandIcon={<FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '18px' }} />}
            defaultEndIcon={<div style={{ width: 24 }} />}
            sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
            <If condition={documentItem.type === 'folder'}>
                <Then>
                    <StyledTreeItem
                        labelUrl={documentItem.url}
                        nodeId={`${documentItem.id}`}
                        labelText={documentItem.title}
                        labelIcon={faFolder}
                    >
                        {documentItem.children?.map((document: DocumentItem) => {
                            return (
                                <StyledTreeItem
                                    nodeId={`${document.id}`}
                                    innerDocument
                                    labelText={document.title}
                                    labelIcon={document.type === DOCUMENT_TYPE.FOLDER ? faFolder : faFileLines}
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
                        labelIcon={faFileLines}
                        labelUrl={documentItem.url}
                    />
                </Else>
            </If>
        </TreeView>
    );
}
