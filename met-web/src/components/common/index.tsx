import React from 'react';
import {
    Button as MuiButton,
    Grid,
    Paper as MuiPaper,
    CircularProgress,
    Typography,
    Stack,
    IconButton,
    Box,
    CircularProgressProps,
    ToggleButton,
    Theme,
    SxProps,
    styled,
} from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/pro-regular-svg-icons/faPen';
import { faCircleXmark } from '@fortawesome/pro-regular-svg-icons/faCircleXmark';
import { Palette, colors } from 'styles/Theme';
import LoadingButton from '@mui/lab/LoadingButton';
import { MET_Header_Font_Family, MET_Font_Weight, MET_Header_Font_Weight } from '../../styles/constants';
import { When } from 'react-if';
export { colors };

export const elevations = {
    // For use with CSS box-shadow property
    // Not complete in Figma yet
    none: '0px 0px transparent',
    pressed:
        '0px 0px 1px 0px rgba(0, 0, 0, 0.14), 0px 0px 1px 0px rgba(0, 0, 0, 0.60) inset, 0px 1px 6px 0px rgba(0, 0, 0, 0.60) inset',
    default:
        '0px 12px 10px 0px rgba(0, 0, 0, 0.01), 0px 7px 9px 0px rgba(0, 0, 0, 0.05), 0px 3px 6px 0px rgba(0, 0, 0, 0.09), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)',
    hover: '0px 5px 6px 0px rgba(0, 0, 0, 0.20), 0px 9px 12px 0px rgba(0, 0, 0, 0.14), 0px 3px 16px 0px rgba(0, 0, 0, 0.12)',
};

export const globalFocusShadow = `inset 0px 0px 0px 2px ${colors.focus.regular.inner}`;

export const globalFocusVisible = {
    '&:focus-visible': {
        outline: `2px solid ${colors.focus.regular.outer}`,
        boxShadow: globalFocusShadow,
    },
};

/**
 * @deprecated Use ‹Tooltip› from Material UI instead
 */
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

/**
 * @deprecated Use ‹Button variant="primary"› from common/Input instead
 */
export const StyledPrimaryButton = styled(LoadingButton)(() => ({
    backgroundColor: colors.button.default.shade,
    color: '#fff',
    lineHeight: '1.1rem',
    '&:hover': {
        opacity: '0.8',
        backgroundColor: Palette.primary.main,
        color: '#fff',
        textDecoration: 'underline',
    },
}));

/**
 * @deprecated Use ‹Button variant="secondary"› from common/Input instead
 */
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
/**
 * @deprecated Use ‹Button variant="secondary" size="small"› from common/Input instead
 */
export const WidgetButton = ({ children, ...rest }: { children: React.ReactNode; [prop: string]: unknown }) => (
    <StyledWidgetButton {...rest} variant="outlined">
        {children}
    </StyledWidgetButton>
);
/**
 * @deprecated Use ‹Button variant="secondary"› from common/Input instead
 */
export const SecondaryButtonOld = ({
    children,
    disabled = false,
    ...rest
}: {
    children: React.ReactNode;
    [prop: string]: unknown;
}) => {
    if (disabled) {
        return (
            <PrimaryButtonOld {...rest} disabled>
                {children}
            </PrimaryButtonOld>
        );
    }
    return (
        <StyledSecondaryButton
            {...rest}
            variant="outlined"
            loadingIndicator={<CircularProgress color="primary" size={'1.8em'} />}
        >
            {children}
        </StyledSecondaryButton>
    );
};

/**
 * @deprecated Use ‹PrimaryButton› from common/Input instead
 */
export const PrimaryButtonOld = ({ children, ...rest }: { children: React.ReactNode; [prop: string]: unknown }) => (
    <StyledPrimaryButton
        {...rest}
        variant="contained"
        loadingIndicator={<CircularProgress color="primary" size={'1.8em'} />}
    >
        {children}
    </StyledPrimaryButton>
);

interface MetToggleButtonProps {
    children: React.ReactNode;
    value: string;
    [prop: string]: unknown;
}

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    backgroundColor: 'transparent',
    color: Palette.primary.main,
    lineHeight: '1.1rem',
    border: `2px solid ${Palette.primary.main}`,
    '&.Mui-selected': {
        backgroundColor: Palette.primary.main,
        color: '#fff',
        '&:hover': {
            backgroundColor: Palette.primary.main,
        },
    },
    '&:hover': {
        opacity: '0.8',
        textDecoration: 'underline',
        backgroundColor: Palette.primary.main,
        color: '#FFFFFF',
        '&.Mui-selected:hover': {
            textDecoration: 'underline',
        },
    },
}));

/**
 * @deprecated Use ‹Button variant="primary"› from common/Input instead
 */
export const MetToggleButton = ({ value, children, ...rest }: MetToggleButtonProps) => (
    <StyledToggleButton {...rest} value={value}>
        {children}
    </StyledToggleButton>
);

const StyledPaper = styled(MuiPaper)(({ theme }) => ({
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' ? colors.surface.gray[100] : colors.surface.gray[60],
    borderRadius: '5px',
    boxShadow: 'rgb(0 0 0 / 6%) 0px 2px 2px -1px, rgb(0 0 0 / 6%) 0px 1px 1px 0px, rgb(0 0 0 / 6%) 0px 1px 3px 0px',
}));

/**
 * @deprecated Use ‹Paper elevation={0}› from Material UI instead
 */
export const MetPaper = ({ children, ...rest }: { children: React.ReactNode; [prop: string]: unknown }) => {
    return (
        <StyledPaper elevation={0} {...rest}>
            {children}
        </StyledPaper>
    );
};

/**
 * @deprecated Use ‹Paper elevation={3}› from Material UI instead
 */
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
                                <FontAwesomeIcon icon={faPen} style={{ fontSize: '22px' }} />
                            </IconButton>
                        </When>
                        <When condition={!!onDeleteClick}>
                            <IconButton
                                color="inherit"
                                onClick={onDeleteClick}
                                data-testid={`survey-widget/remove-${testId}`}
                            >
                                {deleting ? (
                                    <CircularProgress size="1em" color="inherit" />
                                ) : (
                                    <FontAwesomeIcon icon={faCircleXmark} style={{ fontSize: '22px' }} />
                                )}
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

/**
 * @deprecated Use ‹BodyText bold› from common/Typography instead
 */
export const MetLabel = styled(Typography)(() => ({
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: MET_Header_Font_Family,
}));

/**
 * @deprecated Use ‹BodyText› from common/Typography instead
 */
export const MetParagraphOld = styled(Typography)(() => ({
    fontSize: '16px',
    fontFamily: MET_Header_Font_Family,
}));

/**
 * @deprecated Use ‹MetIconText› from common/Typography instead
 */
export const MetIconText = styled(Typography)(() => ({
    fontSize: '11px',
    fontFamily: MET_Header_Font_Family,
    lineHeight: '1.2',
}));

/**
 * @deprecated Use ‹BodyText› from common/Typography instead
 */
export const MetDescription = styled(Typography)(() => ({
    fontSize: '13px',
    fontFamily: MET_Header_Font_Family,
    color: '#707070',
}));

/**
 * @deprecated Use ‹Header1› from common/Typography instead
 */
export const HeaderTitleOld = styled(Typography)(() => ({
    fontSize: '32px',
    fontWeight: 'bold',
    fontFamily: MET_Header_Font_Family,
}));

/**
 * @deprecated Use ‹Header2› from common/Typography instead
 */
export const SubHeaderOld = styled(Typography)(() => ({
    fontSize: '28px',
    fontFamily: MET_Header_Font_Family,
}));

/**
 * @deprecated Use ‹BodyText small› from common/Typography instead
 */
export const ListItem = styled(Typography)(() => ({
    fontSize: '14px',
    fontFamily: MET_Header_Font_Family,
    marginBottom: 1,
}));

/**
 * @deprecated Use ‹BodyText small› from common/Typography instead
 */
export const MetSmallTextOld = ({ bold, children, sx, ...rest }: HeaderProps) => {
    return (
        <Typography
            sx={
                [
                    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
                    {
                        fontSize: '13px',
                        fontFamily: MET_Header_Font_Family,
                        fontWeight: bold ? 'bold' : MET_Header_Font_Weight,
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ] as any
            }
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
    borderRadius: '8px',
    borderTop: '8px solid',
    borderColor: colors.notification.default.shade,
    position: 'absolute',
    top: '50%',
    left: '48%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 'min(95vw, 700px)',
    maxHeight: '95vh',
    bgcolor: 'background.paper',
    boxShadow: 10,
    pt: 2,
    pb: 3,
    pl: 3,
    pr: 4,
    m: 1,
    overflowY: 'scroll',
    color: Palette.text.primary,
};

interface HeaderProps {
    sx?: SxProps;
    color?: string;
    bold?: boolean;
    children?: React.ReactNode | string;
    [prop: string]: unknown;
}

/**
 * @deprecated Use ‹Header1› from common/Typography instead
 */
export const MetHeader1Old = ({ bold, children, sx, ...rest }: HeaderProps) => {
    return (
        <Typography
            sx={
                [
                    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
                    {
                        fontSize: '1.5rem',
                        lineHeight: 1.25,
                        fontWeight: MET_Header_Font_Weight,
                        fontFamily: MET_Header_Font_Family,
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ] as any
            }
            variant="h1"
            {...rest}
        >
            {children}
        </Typography>
    );
};

/**
 * @deprecated Use ‹Header2› from common/Typography instead
 */
export const MetHeader2Old = ({ bold, children, sx, ...rest }: HeaderProps) => {
    return (
        <Typography
            sx={
                [
                    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
                    {
                        fontSize: '1.9rem',
                        fontWeight: MET_Header_Font_Weight,
                        fontFamily: MET_Header_Font_Family,
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ] as any
            }
            variant="h2"
            {...rest}
        >
            {children}
        </Typography>
    );
};

/**
 * @deprecated Use ‹Header3› from common/Typography instead
 */
export const MetHeader3 = ({ bold, children, sx, ...rest }: HeaderProps) => {
    return (
        <Typography
            sx={
                [
                    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
                    {
                        fontSize: '1.5rem',
                        fontWeight: MET_Header_Font_Weight,
                        fontFamily: MET_Header_Font_Family,
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ] as any
            }
            variant="h3"
            {...rest}
        >
            {children}
        </Typography>
    );
};

/**
 * @deprecated Use ‹Header4› from common/Typography instead
 */
export const MetHeader4 = ({ bold, color, children, sx, ...rest }: HeaderProps) => {
    return (
        <Typography
            color={color}
            sx={
                [
                    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
                    {
                        fontSize: '1.3rem',
                        fontWeight: MET_Header_Font_Weight,
                        fontFamily: MET_Header_Font_Family,
                    },
                ] as SxProps<Theme> | undefined
            }
            variant="h4"
            {...rest}
        >
            {children}
        </Typography>
    );
};

/**
 * @deprecated Use ‹BodyText› from common/Typography instead
 */
export const MetBodyOld = ({ bold, children, sx, ...rest }: HeaderProps) => {
    return (
        <Typography
            sx={
                [
                    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
                    {
                        fontSize: '16px',
                        fontFamily: MET_Header_Font_Family,
                        fontWeight: bold ? 'bold' : MET_Font_Weight,
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ] as any
            }
            {...rest}
        >
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

export const MetDisclaimer = ({
    children,
    marginTop = '2em',
}: {
    children: React.ReactNode;
    marginTop?: number | string;
}) => {
    return (
        <Box
            sx={{
                borderLeft: 8,
                borderColor: '#003366',
                backgroundColor: '#aaaaaa22',
            }}
        >
            <Typography
                sx={{
                    p: '1em',
                    mt: marginTop,
                    fontSize: '0.8rem',
                }}
            >
                {children}
            </Typography>
        </Box>
    );
};

export const AspectRatioContainer = styled('div')({
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%' /* 16:9 aspect ratio (height / width * 100) */,
});
