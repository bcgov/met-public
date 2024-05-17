import React from 'react';
import { Grid, GridProps } from '@mui/material';
import { BodyText } from '../Typography';
import { colors } from '..';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/pro-regular-svg-icons';

export type FormFieldProps = {
    title: string;
    instructions?: string;
    required?: boolean;
    optional?: boolean;
    error?: string;
    children: React.ReactNode;
} & GridProps;

export const FormField = ({
    title,
    instructions,
    required,
    optional,
    error,
    children,
    ...gridProps
}: FormFieldProps) => {
    return (
        <Grid className="met-input-form-field" container spacing={0} direction="column" {...gridProps}>
            <Grid item xs={12}>
                <BodyText bold size="large">
                    {title}
                    {required && <span title="(Required)">*</span>}
                    {optional && <span style={{ fontWeight: '400' }}> (Optional)</span>}
                </BodyText>
            </Grid>
            <Grid item xs={12} sx={{ mb: '8px' }}>
                <BodyText size="small">{instructions}</BodyText>
            </Grid>
            {error && (
                <Grid item xs={12} sx={{ mb: '8px' }}>
                    <BodyText bold size="small" sx={{ color: colors.notification.error.shade }}>
                        <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: '8px', fontSize: '18px' }} />
                        {error}
                    </BodyText>
                </Grid>
            )}
            <Grid item container xs={12}>
                {children}
            </Grid>
        </Grid>
    );
};
