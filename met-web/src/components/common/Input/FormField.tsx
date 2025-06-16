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

/**
 * Displays a form field with a title, instructions, and error messages.
 * It is designed to be used as a wrapper for form inputs, providing a consistent layout and styling.
 * The field can be disabled, and it supports displaying required or optional indicators.
 * The error message can be positioned at the top or bottom of the field.
 * @param {FormFieldProps} props - The properties for the form field.
 * @param {string} [props.title] - The title of the form field.
 * @param {boolean} [props.disabled=false] - If true, the field will be disabled.
 * @param {string} [props.instructions] - Instructions or additional information for the field.
 * @param {boolean} [props.required=false] - If true, indicates that the field is required.
 * @param {boolean} [props.optional=false] - If true, indicates that the field is optional.
 * @param {string} [props.error] - An error message to display for the field.
 * @param {'top' | 'bottom'} [props.errorPosition='top'] - The position of the error message, either 'top' or 'bottom'.
 * @param {React.ReactNode} props.children - The content of the form field, typically an input component.
 * @param {GridProps} [props.gridProps] - Additional properties for the Grid component.
 * @returns {JSX.Element} A styled form field component.
 * @example
 * <FormField
 *     title="Username"
 *     instructions="Please enter your username."
 *     required
 *     error="Username is required."
 * >
 *     <TextInput name="username" />
 * </FormField>
 */
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
