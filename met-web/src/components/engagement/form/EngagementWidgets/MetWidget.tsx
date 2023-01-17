import React from 'react';
import { MetLabel, MetWidgetPaper } from 'components/common';
import { Grid, CircularProgress, Stack, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PushPinIcon from '@mui/icons-material/PushPin';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { When, If, Then, Else } from 'react-if';

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
                                <DragIndicatorIcon />
                            </IconButton>
                        </Then>
                        <Else>
                            <Tooltip title="This widget has a fixed position.">
                                <PushPinIcon />
                            </Tooltip>
                        </Else>
                    </If>
                </Grid>
                <Grid item container direction="row" alignItems="center" justifyContent="flex-start" xs={8}>
                    <MetLabel>{title}</MetLabel>
                </Grid>
                <Grid item xs={2} container direction="row" alignItems="flex-start" justifyContent="center">
                    <Stack direction="row" spacing={1}>
                        <When condition={!!onEdit}>
                            <IconButton
                                sx={{ margin: 0, padding: 0 }}
                                color="inherit"
                                onClick={onEdit}
                                data-testid="widget/edit"
                            >
                                <EditIcon />
                            </IconButton>
                        </When>
                        <IconButton
                            sx={{ margin: 0, padding: 0 }}
                            color="inherit"
                            onClick={onDelete}
                            data-testid={`widget/remove-${testId}`}
                        >
                            {deleting ? <CircularProgress size="1em" color="inherit" /> : <HighlightOffIcon />}
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
