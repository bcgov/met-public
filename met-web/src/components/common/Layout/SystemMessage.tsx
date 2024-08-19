import React from 'react';
import { Button, Grid, GridProps } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StatusIcon } from '../Communication/StatusIcon';
import { colors } from 'styles/Theme';
import { faClose } from '@fortawesome/pro-regular-svg-icons';

export const SystemMessage = ({
    status,
    onDismiss,
    color,
    coloredBackground,
    icon,
    children,
    ...props
}: {
    status: 'success' | 'warning' | 'danger' | 'info';
    onDismiss?: () => void;
    color?: string;
    coloredBackground?: boolean;
    icon?: string;
} & GridProps) => {
    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{
                maxWidth: { xs: '100%', md: '700px' },
                borderRadius: '8px',
                backgroundColor: coloredBackground ? colors.notification[status].tint : 'transparent',
                color: 'text.primary',
                padding: '0.8rem 1rem',
                paddingLeft: { xs: '0.5rem', md: '1rem' },
                border: `1px solid ${colors.notification[status].shade}`,
                flexWrap: 'nowrap',
                ...props.sx,
            }}
        >
            <Grid item sx={{ pr: 1, mt: -0.5, fontSize: '18px' }}>
                <StatusIcon status={status} color={color} />
            </Grid>
            <Grid item sx={{ width: '100%', maxWidth: { xs: '100%', md: '600px', fontSize: '14px' } }}>
                {children}
            </Grid>
            <Grid item justifySelf="flex-end" sx={{ mt: -0.75, opacity: onDismiss ? 1 : 0 }}>
                <Button
                    disabled={!onDismiss}
                    onClick={onDismiss}
                    sx={{
                        padding: 0,
                        height: '100%',
                        width: '32px',
                        minWidth: '24px',
                        marginTop: '8px',
                        backgroundColor: 'transparent',
                        color: colors.notification[status].icon,
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                    }}
                    startIcon={<FontAwesomeIcon icon={faClose} />}
                ></Button>
            </Grid>
        </Grid>
    );
};
