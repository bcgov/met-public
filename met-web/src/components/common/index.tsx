import React from 'react';
import {
    Button as MuiButton,
    Grid,
    Paper as MuiPaper,
    CircularProgress,
    Typography,
    Stack,
    IconButton,
} from '@mui/material';
import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Palette } from 'styles/Theme';

export const RoundedButton = styled(MuiButton)(() => ({
    borderRadius: '23px',
}));

export const StyledPaper = styled(MuiPaper)(() => ({
    border: `1px solid #606060`,
    borderRadius: '4px',
}));

export const MetPaper = ({ children, ...rest }: { children: JSX.Element[] | JSX.Element; [prop: string]: unknown }) => {
    return (
        <StyledPaper elevation={0} {...rest}>
            {children}
        </StyledPaper>
    );
};

export const MetWidgetPaper = styled(MuiPaper)(() => ({
    backgroundColor: '#F2F2F2',
    padding: '1em',
}));

interface MetWidgetProps {
    title: string;
    children?: React.ReactNode;
    [prop: string]: unknown;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
}

export const MetWidget = ({ children, title, onEditClick, onDeleteClick, ...rest }: MetWidgetProps) => {
    return (
        <MetWidgetPaper elevation={3} {...rest}>
            <Grid container alignItems={'flex-start'} justifyContent="flex-start" direction="row">
                <Grid item xs={6}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {title}
                    </Typography>
                </Grid>
                <Grid item xs={6} container direction="row" justifyContent="flex-end">
                    <Stack direction="row" spacing={1}>
                        <ConditionalComponent condition={!!onEditClick}>
                            <IconButton color="inherit" onClick={onEditClick}>
                                <EditIcon />
                            </IconButton>
                        </ConditionalComponent>
                        <ConditionalComponent condition={!!onDeleteClick}>
                            <IconButton color="inherit" onClick={onDeleteClick}>
                                <DeleteIcon />
                            </IconButton>
                        </ConditionalComponent>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    {children}
                </Grid>
            </Grid>
        </MetWidgetPaper>
    );
};

export const MidScreenLoader = () => (
    <Grid container direction="row" justifyContent="center" alignItems="center" sx={{ minHeight: '90vh' }}>
        <Grid item>
            <CircularProgress />
        </Grid>
    </Grid>
);

export const MetPageGridContainer = styled(Grid)(() => ({
    padding: '3em',
}));

export const ConditionalComponent = ({ condition, children }: { condition: boolean; children: React.ReactNode }) => {
    if (!condition) {
        return null;
    }

    return <>{children}</>;
};

export const MetLabel = styled(Typography)(() => ({
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: "'BCSans', 'Noto Sans', Verdana, Arial, sans-serif",
}));

interface RepeatedGridProps {
    times: number;
    children: React.ReactNode;
    [prop: string]: unknown;
}
export const RepeatedGrid = ({ times = 1, children, ...rest }: RepeatedGridProps) => {
    return (
        <>
            {[...Array(times)].map((_element, index) => (
                <Grid key={`repeated-grid-${index}`} {...rest}>
                    {children}
                </Grid>
            ))}
        </>
    );
};

export const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '48%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 'min(95vw, 700px)',
    maxHeight: '95vh',
    bgcolor: 'background.paper',
    boxShadow: 10,
    pt: 2,
    px: 4,
    pb: 3,
    m: 1,
    overflowY: 'scroll',
    color: Palette.text.primary,
};
