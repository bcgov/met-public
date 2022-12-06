import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { DocumentTreeProps } from 'components/common';
import { If, Then, Else } from 'react-if';
<<<<<<< HEAD
import { DocumentItem, DOCUMENT_TYPE } from 'models/document';
=======
import { DocumentItem } from 'models/document';
>>>>>>> main
import { StyledTreeItem } from './StyledTreeItem';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

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
                        labelIcon={FolderOutlinedIcon}
                    >
                        {documentItem.children?.map((document: DocumentItem) => {
                            return (
                                <StyledTreeItem
                                    nodeId={`${document.id}`}
                                    labelText={document.title}
                                    labelIcon={
<<<<<<< HEAD
                                        document.type === DOCUMENT_TYPE.FOLDER
                                            ? FolderOutlinedIcon
                                            : DescriptionOutlinedIcon
=======
                                        document.type === 'folder' ? FolderOutlinedIcon : DescriptionOutlinedIcon
>>>>>>> main
                                    }
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
                        labelIcon={DescriptionOutlinedIcon}
                        labelUrl={documentItem.url}
                    />
                </Else>
            </If>
        </TreeView>
    );
}
