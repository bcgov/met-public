import React, { FC } from 'react';
import { Select, SelectProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from '../Input';

type IFormInputProps = {
    name: string;
} & SelectProps;

/**
 * ControlledSelect is a wrapper around MUI's Select component
 * that integrates with React Hook Form's Controller.
 * It allows for controlled form inputs with validation and error handling.
 * @param {IFormInputProps} props - The properties for the controlled select field.
 * @param {string} props.name - The name of the field, used for form state management.
 * @param {React.ReactNode} props.children - The options to be rendered within the select field.
 * @param {SelectProps} props.otherProps - Additional properties for the Select component.
 * @returns {JSX.Element} A controlled Select component that integrates with React Hook Form.
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
                <FormField error={String(errors[name]?.message || '')}>
                    <Select {...otherProps} {...field}>
                        {children}
                    </Select>
                </FormField>
            )}
        />
    );
};

export default ControlledSelect;
