import * as React from 'react';
import { Grid, Link, Stack, Icon } from '@mui/material';
import { TreeView } from '@mui/lab';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { When, If, Then, Else } from 'react-if';
import { DocumentItem } from 'models/document';
import OpenInNew from '@mui/icons-material/OpenInNew';
import { DocumentTreeItemRoot, DocumentTreeItemProps } from 'components/common';

function DocumentTreeItem({ labelIcon, document, nodeId }: DocumentTreeItemProps) {
    return (
        <DocumentTreeItemRoot
            nodeId={nodeId}
            label={
                <Grid item justifyContent="center" container xs={12}>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={11}>
                        <Stack direction="row">
                            <InsertDriveFileIcon color="info" sx={{ mr: 0.5 }} fontSize="small" />
                            <Link
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                                target="_blank"
                                href={`${document.url}`}
                            >
                                {document.title}
                            </Link>
                            <Link target="_blank" href={`${document.url}`}>
                                <Icon fontSize="small" sx={{ ml: 0.5 }}>
                                    <OpenInNew fontSize="small" />
                                </Icon>
                            </Link>
                        </Stack>
                    </Grid>
                </Grid>
            }
        />
    );
}

export default function DocumentTree(documentItem: DocumentItem) {
    return (
        <TreeView
            aria-label={documentItem.title}
            defaultExpanded={['3']}
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            defaultEndIcon={<div style={{ width: 24 }} />}
            sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
            <If condition={documentItem.type === 'folder'}>
                <Then>
                    <DocumentTreeItem nodeId={`${documentItem.id}`} document={documentItem} labelIcon={FolderIcon}>
                        <When condition={documentItem.children && documentItem.children.length > 0}>
                            {documentItem.children?.map((item: DocumentItem, index) => {
                                return (
                                    <DocumentTreeItem
                                        labelIcon={documentItem.type === 'folder' ? FolderIcon : InsertDriveFileIcon}
                                        document={item}
                                        nodeId={`${item.id}`}
                                    />
                                );
                            })}
                        </When>
                    </DocumentTreeItem>
                </Then>
            </If>
            <Else>
                <DocumentTreeItem
                    labelIcon={InsertDriveFileIcon}
                    nodeId={`${documentItem.id}`}
                    document={documentItem}
                />
            </Else>
        </TreeView>
    );
}
