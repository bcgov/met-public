import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SvgIconProps } from '@mui/material/SvgIcon';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { DocumentTreeItemProps, DocumentTreeProps } from 'components/common';
import { If, Then, Else } from 'react-if';
import { DocumentItem } from 'models/document';
import { Link, Icon } from '@mui/material';
import OpenInNew from '@mui/icons-material/OpenInNew';
import { MetHeader4 } from 'components/common';
import { StyledTreeItemProps, StyledTreeItemRoot } from 'components/common';

function StyledTreeItem(props: StyledTreeItemProps & DocumentTreeItemProps) {
    const { labelUrl, labelIcon: LabelIcon, labelText, ...other } = props;

    return (
        <StyledTreeItemRoot
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
                    <If condition={labelUrl}>
                        <Then>
                            <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                            <Link
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                                target="_blank"
                                href={`${labelUrl}`}
                            >
                                {labelText}
                            </Link>
                            <Link target="_blank" href={`${labelUrl}`}>
                                <Icon fontSize="small" sx={{ ml: 0.5 }}>
                                    <OpenInNew fontSize="small" />
                                </Icon>
                            </Link>
                        </Then>
                        <Else>
                            <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                            <MetHeader4>{labelText}</MetHeader4>
                        </Else>
                    </If>
                </Box>
            }
            {...other}
        />
    );
}

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
                                <>
                                    {console.log(document)}
                                    <StyledTreeItem
                                        nodeId={`${document.id}`}
                                        labelText={document.title}
                                        labelIcon={document.type === 'folder' ? FolderIcon : InsertDriveFileIcon}
                                        labelUrl={document.url}
                                    />
                                </>
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
