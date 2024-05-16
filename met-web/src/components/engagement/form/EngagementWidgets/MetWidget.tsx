import React from 'react';
import { MetLabel, MetWidgetPaper } from 'components/common';
import { Grid, CircularProgress, Stack, IconButton, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/pro-regular-svg-icons/faPen';
import { faThumbtack } from '@fortawesome/pro-solid-svg-icons/faThumbtack';
import { faGripDotsVertical } from '@fortawesome/pro-solid-svg-icons/faGripDotsVertical';
import { faCircleXmark } from '@fortawesome/pro-regular-svg-icons/faCircleXmark';
import { If, Then, Else } from 'react-if';

interface MetWidgetProps {
    testId?: string;
    title: string;
    children?: React.ReactNode;
    [prop: string]: unknown;
    onEdit?: () => void;
    onDelete: () => void;
    deleting?: boolean;
    sortable?: boolean;
}

const MetWidget = ({
    testId,
    children,
    title,
    onEdit,
    onDelete,
    deleting,
    sortable = true,
    ...rest
}: MetWidgetProps) => {
    return (
        <MetWidgetPaper elevation={1} {...rest}>
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                <Grid item xs={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                    <If condition={sortable}>
                        <Then>
                            <IconButton sx={{ margin: 0, padding: 0 }} color="inherit" aria-label="drag-indicator">
                                <FontAwesomeIcon
                                    icon={faGripDotsVertical}
                                    style={{ fontSize: '24px', margin: '0px 4px' }}
                                />
                            </IconButton>
                        </Then>
                        <Else>
                            <Tooltip title="This widget has a fixed position.">
                                <FontAwesomeIcon icon={faThumbtack} style={{ fontSize: '24px', margin: '8px 4px' }} />
                            </Tooltip>
                        </Else>
                    </If>
                </Grid>
                <Grid item container direction="row" alignItems="center" justifyContent="flex-start" xs={8}>
                    <MetLabel>{title}</MetLabel>
                </Grid>
                <Grid item xs={2} container direction="row" alignItems="flex-start" justifyContent="center">
                    <Stack direction="row" spacing={1}>
                        <If condition={!!onEdit}>
                            <Then>
                                <IconButton
                                    sx={{ margin: 0, padding: 0 }}
                                    color="inherit"
                                    onClick={onEdit}
                                    data-testid="widget/edit"
                                >
                                    <FontAwesomeIcon icon={faPen} style={{ fontSize: '22px' }} />
                                </IconButton>
                            </Then>
                            <Else>
                                <IconButton
                                    sx={{ p: 1.5 }}
                                    color="inherit"
                                    onClick={onEdit}
                                    data-testid="widget/edit"
                                ></IconButton>
                            </Else>
                        </If>
                        <IconButton
                            sx={{ margin: 0, padding: 0 }}
                            color="inherit"
                            onClick={onDelete}
                            data-testid={`widget/remove-${testId}`}
                        >
                            {deleting ? (
                                <CircularProgress size="1em" color="inherit" />
                            ) : (
                                <FontAwesomeIcon icon={faCircleXmark} style={{ fontSize: '22px' }} />
                            )}
                        </IconButton>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    {children}
                </Grid>
            </Grid>
        </MetWidgetPaper>
    );
};

export default MetWidget;
