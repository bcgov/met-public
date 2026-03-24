import React, { FC } from 'react';
// import { TextField, TextFieldProps } from '@mui/material';
import { TextField, TextFieldProps } from '../Input';
import { Controller, useFormContext } from 'react-hook-form';

type IFormInputProps = {
    name: string;
} & TextFieldProps;

/**
 * ControlledTextField is a wrapper around our custom TextField component
 * that integrates with React Hook Form's Controller.
 * It allows for controlled form inputs with validation and error handling.
 * @param {IFormInputProps} props - The properties for the controlled text field.
 * @param {string} props.name - The name of the field, used for form state management.
 * @param {TextFieldProps} props.otherProps - Additional properties for the TextField component.
 * @returns {JSX.Element} A controlled TextField component that integrates with React Hook Form. *
 */
const ControlledTextField: FC<IFormInputProps> = ({ name, ...otherProps }) => {
    const {
        control,
        formState: { errors, defaultValues },
    } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValues?.[name] || ''}
            render={({ field }) => <TextField {...otherProps} {...field} error={String(errors[name]?.message || '')} />}
        />
    );
};

export default ControlledTextField;
