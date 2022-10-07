import React, { FC } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Control, Controller, ControllerProps, FieldValues } from 'react-hook-form';
import { WidgetContact } from 'components/engagement/form/types';

interface ControllerInputProps {
    control: Control<WidgetContact, any>;
    name: keyof WidgetContact;
    defaultValue?: string | number;
}
export const ControlledTextField: FC<TextFieldProps & ControllerInputProps> = (
    props: TextFieldProps & ControllerInputProps,
) => {
    return (
        <Controller
            name={props.name}
            control={props.control}
            defaultValue={props.defaultValue}
            render={({ field: { onChange, onBlur, name: fieldName, value }, fieldState: { error } }) => (
                <TextField
                    {...props}
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                    name={fieldName}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
                />
            )}
        />
    );
};
