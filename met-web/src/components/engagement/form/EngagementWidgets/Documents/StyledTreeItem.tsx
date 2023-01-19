import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import { MetHeader4 } from 'components/common';
import { DocumentTreeItemProps, StyledTreeItemProps } from 'models/document';
import { If, Then, Else } from 'react-if';
import { Link } from '@mui/material';
import OpenInNew from '@mui/icons-material/OpenInNew';

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
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
    const { labelUrl, labelIcon: LabelIcon, labelText, ...other } = props;

    return (
        <StyledTreeItemRoot
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
                    <If condition={labelUrl}>
                        <Then>
                            <Box component={LabelIcon} color="inherit" sx={{ p: 0.3, mr: 1 }} />
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
                            <MetHeader4 bold={true}>{labelText}</MetHeader4>
                        </Else>
                    </If>
                </Box>
            }
            {...other}
        />
    );
}
