import React from 'react';
import { MetHeader4, MetWidgetPaper } from 'components/common';
import { Grid, CircularProgress, Stack, IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';

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
                <Grid item xs={6}>
                    <MetHeader4 bold={true}>{title}</MetHeader4>
                </Grid>
                <Grid item xs={6} container direction="row" justifyContent="flex-end">
                    <Stack direction="row" spacing={1}>
                        <IconButton color="inherit" onClick={onEdit} data-testid="widget/edit">
                            <EditIcon />
                        </IconButton>
                        <IconButton color="inherit" onClick={onDelete} data-testid={`widget/remove-${testId}`}>
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
