import React, { FC } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type IFormInputProps = {
    name: string;
} & TextFieldProps;

const ControlledTextField: FC<IFormInputProps> = ({ name, ...otherProps }) => {
    const {
        control,
        formState: { errors, defaultValues },
    } = useFormContext();

    React.useEffect(() => {
        console.log(JSON.stringify(defaultValues));
    });

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValues?.[name] || ''}
            render={({ field }) => (
                <TextField
                    {...otherProps}
                    {...field}
                    error={!!errors[name]}
                    helperText={String(errors[name]?.message || '')}
                />
            )}
        />
    );
};

export default ControlledTextField;
