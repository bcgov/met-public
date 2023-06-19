import React from 'react';
import {
    Button as MuiButton,
    Grid,
    Paper as MuiPaper,
    CircularProgress,
    Typography,
    Stack,
    IconButton,
    Toolbar,
    Box,
    CircularProgressProps,
} from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { SxProps, styled } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Palette } from 'styles/Theme';
import LoadingButton from '@mui/lab/LoadingButton';
import { MET_Header_Font_Family, MET_Header_Font_Weight } from '../../styles/constants';
import { When } from 'react-if';

export const MetTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.primary?.main,
        fontSize: 11,
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.primary?.main,
    },
}));

export const MobileToolbar = styled(Toolbar)(() => ({
    marginBottom: '40px',
}));

const StyledPrimaryButton = styled(LoadingButton)(() => ({
    backgroundColor: Palette.primary.main,
    color: '#fff',
    lineHeight: '1.1rem',
    '&:hover': {
        opacity: '0.8',
        backgroundColor: Palette.primary.main,
        color: '#fff',
        textDecoration: 'underline',
    },
}));

const StyledSecondaryButton = styled(LoadingButton)(() => ({
    backgroundColor: 'transparent',
    color: Palette.primary.main,
    lineHeight: '1.1rem',
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
    lineHeight: '1.1rem',
    border: `2px solid ${'#707070'}`,
    '&:hover': {
        opacity: '0.8',
        textDecoration: 'underline',
        backgroundColor: '#f2f2f2',
        color: '#494949',
        border: `2px solid ${'#f2f2f2'}`,
    },
}));

const StyledSocialIconButton = styled(IconButton)(() => ({
    border: '1px solid #494949',
    color: '#494949',
}));

export const SocialIconButton = ({ children, ...rest }: { children: React.ReactNode; [prop: string]: unknown }) => (
    <StyledSocialIconButton color="info" {...rest}>
        {children}
    </StyledSocialIconButton>
);

export const WidgetButton = ({ children, ...rest }: { children: React.ReactNode; [prop: string]: unknown }) => (
    <StyledWidgetButton {...rest} variant="outlined">
        {children}
    </StyledWidgetButton>
);

export const SecondaryButton = ({ children, ...rest }: { children: React.ReactNode; [prop: string]: unknown }) => (
    <StyledSecondaryButton
        {...rest}
        variant="outlined"
        loadingIndicator={<CircularProgress color="primary" size={'1.8em'} />}
    >
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
    border: '1px solid #cdcdcd',
    borderRadius: '5px',
    boxShadow: 'rgb(0 0 0 / 6%) 0px 2px 2px -1px, rgb(0 0 0 / 6%) 0px 1px 1px 0px, rgb(0 0 0 / 6%) 0px 1px 3px 0px',
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
                    <MetHeader3 bold>{title}</MetHeader3>
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

export const MetDescription = styled(Typography)(() => ({
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

export const CircularProgressWithLabel = (props: CircularProgressProps & { value: number }) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress color="inherit" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="inherit">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
};

export const MetDisclaimer = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box
            sx={{
                borderLeft: 8,
                borderColor: '#003366',
                backgroundColor: '#F2F2F2',
            }}
        >
            <Typography
                sx={{
                    p: '1em',
                    mt: '2em',
                    fontSize: '0.8rem',
                }}
            >
                {children}
            </Typography>
        </Box>
    );
};
