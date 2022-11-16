import React from 'react';
import { MetLabel, MetWidgetPaper } from 'components/common';
import { Grid, CircularProgress, Stack, IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface MetWidgetProps {
    testId?: string;
    title: string;
    children?: React.ReactNode;
    [prop: string]: unknown;
    onEdit: () => void;
    onDelete: () => void;
    deleting?: boolean;
}

const MetWidget = ({ testId, children, title, onEdit, onDelete, deleting, ...rest }: MetWidgetProps) => {
    return (
        <MetWidgetPaper elevation={3} {...rest}>
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                <Grid item xs={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton sx={{ margin: 0, padding: 0 }} color="info" aria-label="drag-indicator">
                        <DragIndicatorIcon />
                    </IconButton>
                </Grid>
                <Grid item container direction="row" alignItems="center" justifyContent="flex-start" xs={8}>
                    <MetLabel>{title}</MetLabel>
                </Grid>
                <Grid item xs={2} container direction="row" alignItems="flex-start" justifyContent="center">
                    <Stack direction="row" spacing={1}>
                        <IconButton
                            sx={{ margin: 0, padding: 0 }}
                            color="inherit"
                            onClick={onEdit}
                            data-testid="widget/edit"
                        >
                            <EditIcon />
                        </IconButton>
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
