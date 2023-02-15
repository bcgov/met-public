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
import { SxProps, styled } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Palette } from 'styles/Theme';
import LoadingButton from '@mui/lab/LoadingButton';
import { MET_Header_Font_Family, MET_Header_Font_Weight } from '../../styles/constants';
import { When } from 'react-if';

const StyledPrimaryButton = styled(LoadingButton)(() => ({
    backgroundColor: Palette.primary.main,
    color: '#fff',
    '&:hover': {
        opacity: '0.8',
        backgroundColor: Palette.primary.main,
        color: '#fff',
        textDecoration: 'underline',
    },
}));

const StyledSecondaryButton = styled(MuiButton)(() => ({
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

const StyledWidgetButton = styled(MuiButton)(() => ({
    backgroundColor: 'transparent',
    color: '#494949',
    border: `2px solid ${'#707070'}`,
    '&:hover': {
        opacity: '0.8',
        textDecoration: 'underline',
        backgroundColor: '#f2f2f2',
        color: '#494949',
        border: `2px solid ${'#f2f2f2'}`,
    },
}));

export const WidgetButton = ({ children, ...rest }: { children: React.ReactNode; [prop: string]: unknown }) => (
    <StyledWidgetButton {...rest} variant="outlined">
        {children}
    </StyledWidgetButton>
);

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

const StyledPaper = styled(MuiPaper)(() => ({
    border: `1px solid #606060`,
    borderRadius: '4px',
}));

export const MetPaper = ({ children, ...rest }: { children: React.ReactNode; [prop: string]: unknown }) => {
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

interface MetSurveyProps {
    testId?: number;
    title: string;
    children?: React.ReactNode;
    [prop: string]: unknown;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
    deleting?: boolean;
}

export const MetSurvey = ({
    testId,
    children,
    title,
    onEditClick,
    onDeleteClick,
    deleting,
    ...rest
}: MetSurveyProps) => {
    return (
        <MetWidgetPaper elevation={3} {...rest}>
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start">
                <Grid item xs={6}>
                    <MetHeader3 bold={true}>{title}</MetHeader3>
                </Grid>
                <Grid item xs={6} container direction="row" justifyContent="flex-end">
                    <Stack direction="row" spacing={1}>
                        <When condition={!!onEditClick}>
                            <IconButton color="inherit" onClick={onEditClick} data-testid="survey-widget/edit">
                                <EditIcon />
                            </IconButton>
                        </When>
                        <When condition={!!onDeleteClick}>
                            <IconButton
                                color="inherit"
                                onClick={onDeleteClick}
                                data-testid={`survey-widget/remove-${testId}`}
                            >
                                {deleting ? <CircularProgress size="1em" color="inherit" /> : <HighlightOffIcon />}
                            </IconButton>
                        </When>
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

export const MetLabel = styled(Typography)(() => ({
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: MET_Header_Font_Family,
}));

export const MetParagraph = styled(Typography)(() => ({
    fontSize: '16px',
    fontFamily: MET_Header_Font_Family,
}));

export const MetIconText = styled(Typography)(() => ({
    fontSize: '11px',
    fontFamily: MET_Header_Font_Family,
    lineHeight: '1.2',
}));

export const MetLabelDescription = styled(Typography)(() => ({
    fontSize: '13px',
    fontFamily: MET_Header_Font_Family,
    color: '#707070',
}));

export const MetSmallText = ({ bold, children, sx, ...rest }: HeaderProps) => {
    return (
        <Typography
            sx={{
                ...sx,
                fontSize: '13px',
                fontFamily: MET_Header_Font_Family,
                fontWeight: bold ? 'bold' : MET_Header_Font_Weight,
            }}
            variant="subtitle1"
            {...rest}
        >
            {children}
        </Typography>
    );
};

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
    overflowY: 'none',
    color: Palette.text.primary,
};

interface HeaderProps {
    sx?: SxProps;
    color?: string;
    bold?: boolean;
    children?: React.ReactNode | string;
    [prop: string]: unknown;
}

export const MetHeader1 = ({ bold, children, sx, ...rest }: HeaderProps) => {
    return (
        <Typography
            sx={{
                ...sx,
                fontSize: '2.3rem',
                fontWeight: bold ? 'bold' : MET_Header_Font_Weight,
                fontFamily: MET_Header_Font_Family,
            }}
            variant="h2"
            {...rest}
        >
            {children}
        </Typography>
    );
};
export const MetHeader2 = ({ bold, children, sx, ...rest }: HeaderProps) => {
    return (
        <Typography
            sx={{
                ...sx,
                fontSize: '1.9rem',
                fontWeight: bold ? 'bold' : MET_Header_Font_Weight,
                fontFamily: MET_Header_Font_Family,
            }}
            variant="h2"
            {...rest}
        >
            {children}
        </Typography>
    );
};
export const MetHeader3 = ({ bold, children, sx, ...rest }: HeaderProps) => {
    return (
        <Typography
            sx={{
                ...sx,
                fontSize: '1.5rem',
                fontWeight: bold ? 'bold' : MET_Header_Font_Weight,
                fontFamily: MET_Header_Font_Family,
            }}
            variant="h3"
            {...rest}
        >
            {children}
        </Typography>
    );
};
export const MetHeader4 = ({ bold, color, children, sx, ...rest }: HeaderProps) => {
    return (
        <Typography
            color={color}
            sx={{
                ...sx,
                fontSize: '1.3rem',
                fontWeight: bold ? 'bold' : MET_Header_Font_Weight,
                fontFamily: MET_Header_Font_Family,
            }}
            variant="h4"
            {...rest}
        >
            {children}
        </Typography>
    );
};

export const MetBody = ({ bold, children, sx, ...rest }: HeaderProps) => {
    return (
        <Typography
            sx={{
                ...sx,
                fontSize: '16px',
                fontFamily: MET_Header_Font_Family,
                fontWeight: bold ? 'bold' : MET_Header_Font_Weight,
            }}
            {...rest}
        >
            {children}
        </Typography>
    );
};

export const ModalSubtitle = ({
    children,
    ...rest
}: {
    children: JSX.Element[] | JSX.Element | string;
    [prop: string]: unknown;
}) => {
    return (
        <Typography variant={'subtitle1'} {...rest}>
            {children}
        </Typography>
    );
};
