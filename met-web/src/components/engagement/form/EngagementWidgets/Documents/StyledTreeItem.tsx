import * as React from 'react';
import { styled } from '@mui/material/styles';
import TreeItem, { treeItemClasses, TreeItemProps } from '@mui/lab/TreeItem';
import { BodyText } from 'components/common/Typography';
import { If, Then, Else } from 'react-if';
import { Box } from '@mui/material';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/pro-regular-svg-icons/faArrowUpRightFromSquare';
import { Link } from 'components/common/Navigation';

type DocumentTreeItemProps = TreeItemProps & {
    labelIcon?: IconProp;
    labelUrl?: string;
    nodeId: string;
};

type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    color?: string;
    labelIcon?: IconProp;
    labelInfo?: string;
    labelText: string;
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
    const { labelUrl, labelIcon: LabelIcon, labelText, ...other } = props;

    return (
        <StyledTreeItemRoot
            label={
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 0.5,
                        pr: 0,
                        pl: 0,
                    }}
                >
                    <If condition={labelUrl}>
                        <Then>
                            {LabelIcon && (
                                <FontAwesomeIcon icon={LabelIcon} style={{ fontSize: '20px', paddingRight: '8px' }} />
                            )}
                            <Link target="_blank" href={`${labelUrl}`}>
                                {labelText}
                            </Link>
                            <Link target="_blank" href={`${labelUrl}`}>
                                <FontAwesomeIcon
                                    icon={faArrowUpRightFromSquare}
                                    style={{ fontSize: '14px', padding: '5px' }}
                                />
                            </Link>
                        </Then>
                        <Else>
                            {LabelIcon && (
                                <FontAwesomeIcon icon={LabelIcon} style={{ fontSize: '20px', paddingRight: '8px' }} />
                            )}
                            <BodyText bold>{labelText}</BodyText>
                        </Else>
                    </If>
                </Box>
            }
            {...other}
        />
    );
}
