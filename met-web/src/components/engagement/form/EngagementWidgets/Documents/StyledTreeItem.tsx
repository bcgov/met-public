import * as React from 'react';
import { styled } from '@mui/material/styles';
import TreeItem, { treeItemClasses, TreeItemProps } from '@mui/lab/TreeItem';
import { MetBody } from 'components/common';
import { If, Then, Else } from 'react-if';
import { Link, Box } from '@mui/material';
import OpenInNew from '@mui/icons-material/OpenInNew';
import { SvgIconProps } from '@mui/material';

type DocumentTreeItemProps = TreeItemProps & {
    labelIcon: React.ElementType<SvgIconProps>;
    labelUrl?: string;
    nodeId: string;
};

type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    color?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: string;
    labelText: string;
    innerDocument?: boolean;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.primary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.primary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:hover': {
            backgroundColor: 'transparent',
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: 'transparent',
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit',
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2),
        },
    },
}));

export function StyledTreeItem(props: StyledTreeItemProps & DocumentTreeItemProps) {
    const { labelUrl, labelIcon: LabelIcon, labelText, innerDocument, ...other } = props;

    return (
        <StyledTreeItemRoot
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
                    <If condition={labelUrl}>
                        <Then>
                            <Box
                                component={LabelIcon}
                                color="inherit"
                                sx={{ p: 0.3, ml: innerDocument ? 3 : 0, mr: 1 }}
                            />
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
                            <Link
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                                target="_blank"
                                href={`${labelUrl}`}
                            >
                                <Box component={OpenInNew} color="inherit" sx={{ p: 0.5, mr: 1 }} />
                            </Link>
                        </Then>
                        <Else>
                            <Box component={LabelIcon} color="inherit" sx={{ p: 0.3, mr: 1 }} />
                            <MetBody bold>{labelText}</MetBody>
                        </Else>
                    </If>
                </Box>
            }
            {...other}
        />
    );
}
