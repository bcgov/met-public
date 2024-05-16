import React from 'react';
import { Grid, GridProps } from '@mui/material';
import { BodyText } from '../Typography';

export type FormFieldProps = {
    title: string;
    instructions?: string;
    required?: boolean;
    optional?: boolean;
    children: React.ReactNode;
} & GridProps;

export const FormField = ({ title, instructions, required, optional, children, ...gridProps }: FormFieldProps) => {
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
            <Grid item container xs={12}>
                {children}
            </Grid>
        </Grid>
    );
};
