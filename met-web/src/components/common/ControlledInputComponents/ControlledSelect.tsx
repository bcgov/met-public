import React, { FC } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type IFormInputProps = {
    name: string;
} & TextFieldProps;

/**
 * @deprecated Do not use this component until it has been updated to be compliant with the design system.
 * Possible replacement: `components/common/Input/Select`
 * ControlledSelect is a wrapper around MUI's TextField component
 * that integrates with React Hook Form's Controller.
 * It allows for controlled form inputs with validation and error handling.
 * @param {IFormInputProps} props - The properties for the controlled select field.
 * @param {string} props.name - The name of the field, used for form state management.
 * @param {React.ReactNode} props.children - The options to be rendered within the select field.
 * @param {TextFieldProps} props.otherProps - Additional properties for the TextField component.
 * @returns {JSX.Element} A controlled TextField component that integrates with React Hook Form.
 * @example
 * <ControlledSelect name="exampleSelect" label="Example Select">
 *     <MenuItem value="option1">Option 1</MenuItem>
 *     <MenuItem value="option2">Option 2</MenuItem>
 * </ControlledSelect>
 */
const ControlledSelect: FC<IFormInputProps> = ({ name, children, ...otherProps }) => {
    const {
        control,
        formState: { errors, defaultValues },
    } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValues?.[name] || ''}
            render={({ field }) => (
                <TextField
                    select
                    {...otherProps}
                    {...field}
                    error={!!errors[name]}
                    helperText={String(errors[name]?.message || '')}
                >
                    {children}
                </TextField>
            )}
        />
    );
};

export default ControlledSelect;
