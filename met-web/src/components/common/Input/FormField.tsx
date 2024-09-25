import React from 'react';
import { Grid, GridProps } from '@mui/material';
import { BodyText } from '../Typography';
import { ErrorMessage } from '../Typography/Body';

export type FormFieldProps = {
    title?: string;
    disabled?: boolean;
    instructions?: string;
    required?: boolean;
    optional?: boolean;
    error?: string;
    errorPosition?: 'top' | 'bottom';
    children: React.ReactNode;
} & GridProps;

export const FormField = ({
    title,
    disabled,
    instructions,
    required,
    optional,
    error,
    errorPosition = 'top',
    children,
    ...gridProps
}: FormFieldProps) => {
    return (
        <label style={{ width: '100%', display: 'block' }}>
            <Grid
                className="met-input-form-field"
                container
                spacing={0}
                direction="column"
                {...gridProps}
                sx={{ opacity: disabled ? '0.5' : '1', ...gridProps.sx }}
            >
                <Grid item xs={12}>
                    <BodyText bold size="large" className="met-input-form-field-title">
                        {title}
                        {required && title && <span title="(Required)">*</span>}
                        {optional && title && <span style={{ fontWeight: '400' }}> (Optional)</span>}
                    </BodyText>
                </Grid>
                <Grid item xs={12} sx={{ mb: '8px' }}>
                    <BodyText size="small">{instructions}</BodyText>
                </Grid>
                {error && errorPosition === 'top' && (
                    <Grid item container xs={12} sx={{ mb: '8px' }}>
                        <ErrorMessage error={error} />
                    </Grid>
                )}
                <Grid item container xs={12}>
                    {children}
                </Grid>
                {error && errorPosition === 'bottom' && (
                    <Grid item container xs={12} sx={{ mb: '8px' }}>
                        <ErrorMessage error={error} />
                    </Grid>
                )}
            </Grid>
        </label>
    );
};
