import React, { FC } from 'react';
import { RadioGroup, RadioGroupProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type IFormInputProps = {
    name: string;
} & RadioGroupProps;

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
