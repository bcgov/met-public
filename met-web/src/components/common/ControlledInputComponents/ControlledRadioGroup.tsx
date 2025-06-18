import React, { FC } from 'react';
import { RadioGroup, RadioGroupProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type IFormInputProps = {
    name: string;
} & RadioGroupProps;

/**
 * ControlledRadioGroup is a wrapper around MUI's RadioGroup component
 * that integrates with React Hook Form's Controller.
 * It allows for controlled form inputs with validation and error handling.
 * @param {IFormInputProps} props - Additional properties for the controlled radio group.
 * @param {string} props.name - The name of the field, used for form state management.
 * @param {React.ReactNode} props.children - The radio buttons to be rendered within the group.
 * @deprecated Do not use this component until it has been updated to be compliant with the design system.
 */
const ControlledRadioGroup: FC<IFormInputProps> = ({ name, children, ...otherProps }) => {
    const {
        control,
        formState: { defaultValues },
    } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValues?.[name] || ''}
            render={({ field }) => (
                <RadioGroup {...otherProps} {...field}>
                    {children}
                </RadioGroup>
            )}
        />
    );
};

export default ControlledRadioGroup;
