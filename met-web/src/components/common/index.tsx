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
import { styled } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Palette } from 'styles/Theme';
import LoadingButton from '@mui/lab/LoadingButton';

export const RoundedButton = styled(MuiButton)(() => ({
    borderRadius: '23px',
}));

export const StyledPrimaryButton = styled(LoadingButton)(() => ({
    backgroundColor: Palette.primary.main,
    color: '#fff',
    '&:hover': {
        opacity: '0.8',
        backgroundColor: Palette.primary.main,
        color: '#fff',
        textDecoration: 'underline',
    },
}));

export const StyledSecondaryButton = styled(MuiButton)(() => ({
    backgroundColor: 'transparent',
    color: Palette.primary.main,
    border: `2px solid ${Palette.primary.main}`,
    '&:hover': {
        opacity: '0.8',
        textDecoration: 'underline',
        backgroundColor: Palette.primary.main,
        color: '#FFFFFF',
        border: `2px solid ${Palette.primary.main}`,
    },
}));

export const SecondaryButton = ({ children, ...rest }: { children: React.ReactNode; [prop: string]: unknown }) => (
    <StyledSecondaryButton {...rest} variant="outlined">
        {children}
    </StyledSecondaryButton>
);

export const PrimaryButton = ({ children, ...rest }: { children: React.ReactNode; [prop: string]: unknown }) => (
    <StyledPrimaryButton
        {...rest}
        variant="contained"
        loadingIndicator={<CircularProgress color="primary" size={'1.8em'} />}
    >
        {children}
    </StyledPrimaryButton>
);

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
    deleting?: boolean;
}

export const MetWidget = ({ children, title, onEditClick, onDeleteClick, deleting, ...rest }: MetWidgetProps) => {
    return (
        <MetWidgetPaper elevation={3} {...rest}>
            <Grid container alignItems={'flex-start'} justifyContent="flex-start" direction="row">
                <Grid item xs={6}>
                    <MetHeader3 sx={{ fontWeight: 'bold' }}>{title}</MetHeader3>
                </Grid>
                <Grid item xs={6} container direction="row" justifyContent="flex-end">
                    <Stack direction="row" spacing={1}>
                        <ConditionalComponent condition={!!onEditClick}>
                            <IconButton color="inherit" onClick={onEditClick} data-testid="survey-widget/edit">
                                <EditIcon />
                            </IconButton>
                        </ConditionalComponent>
                        <ConditionalComponent condition={!!onDeleteClick}>
                            <IconButton color="inherit" onClick={onDeleteClick} data-testid="survey-widget/remove">
                                {deleting ? <CircularProgress size="1em" color="inherit" /> : <HighlightOffIcon />}
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
            <CircularProgress data-testid="loader" />
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

export const MetLabelBody = styled(Typography)(() => ({
    fontSize: '16px',
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

export const MetHeader1 = styled(Typography)(() => ({
    fontSize: '2.3rem',
    fontWeight: 500,
    fontFamily: "'BCSans', 'Noto Sans', Verdana, Arial, sans-serif",
}));

export const MetHeader2 = styled(Typography)(() => ({
    fontSize: '1.9rem',
    fontWeight: 500,
    fontFamily: "'BCSans', 'Noto Sans', Verdana, Arial, sans-serif",
}));

export const MetHeader3 = styled(Typography)(() => ({
    fontSize: '1.5rem',
    fontWeight: 500,
    fontFamily: "'BCSans', 'Noto Sans', Verdana, Arial, sans-serif",
}));

export const MetHeader4 = styled(Typography)(() => ({
    fontSize: '1.3rem',
    fontWeight: 500,
    fontFamily: "'BCSans', 'Noto Sans', Verdana, Arial, sans-serif",
}));

export const MetBody = styled(Typography)(() => ({
    fontSize: '16px',
    fontWeight: 500,
    fontFamily: "'BCSans', 'Noto Sans', Verdana, Arial, sans-serif",
}));

export const ModalSubtitle = ({
    children,
    ...rest
}: {
    children: JSX.Element[] | JSX.Element | string;
    [prop: string]: unknown;
}) => {
    return <Typography variant={'subtitle1'}>{children}</Typography>;
};
