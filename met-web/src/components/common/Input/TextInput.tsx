import React, { useEffect } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, Input, InputProps, Box } from '@mui/material';
import { colors, elevations, globalFocusVisible } from '..';
import { FormField, FormFieldProps } from './FormField';
import { BodyText } from '../Typography';
import { faCircleXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { error } from 'console';
import { text } from 'stream/consumers';

type TextInputProps = {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
} & Omit<InputProps, 'value' | 'onChange' | 'placeholder' | 'disabled'>;

export const TextInput: React.FC<TextInputProps> = ({
    value,
    onChange,
    placeholder,
    disabled,
    sx,
    error,
    inputProps,
    ...textFieldProps
}: TextInputProps) => {
    // Exclude props that are not meant for the input element
    return (
        <Input
            className="met-input-text"
            disableUnderline
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            sx={{
                display: 'flex',
                height: '48px',
                padding: '8px 16px',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                alignSelf: 'stretch',
                borderRadius: '8px',
                outline: error ? `2px solid #B80C0D` : `1px solid ${colors.surface.gray[80]}`,
                caretColor: colors.surface.blue[90],
                '&:hover': {
                    outline: `2px solid ${colors.surface.gray[90]}`,
                },
                '&.Mui-focused': {
                    outline: `2px solid ${colors.surface.blue[70]}`,
                },
                ...globalFocusVisible,
                ...sx,
            }}
            inputProps={{
                error: error,
                ...inputProps,
                sx: {
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: colors.type.regular.primary,
                    '&::placeholder': {
                        color: colors.type.regular.secondary,
                    },
                    border: 'none',
                    ...inputProps?.sx,
                },
            }}
            {...textFieldProps}
        />
    );
};

export type TextFieldProps = {
    error?: string;
    counter?: boolean;
    maxLength?: number;
    clearable?: boolean;
} & Omit<FormFieldProps, 'children'> &
    Omit<TextInputProps, 'fullWidth' | 'error'>;

export const TextField = ({
    title,
    instructions,
    error,
    required,
    optional,
    clearable,
    onChange,
    ...textInputProps
}: TextFieldProps) => {
    const [value, setValue] = React.useState(textInputProps.value || '');
    useEffect(() => {
        setValue(textInputProps.value || '');
    }, [textInputProps.value]);
    const handleSetValue = (newValue: string) => {
        onChange?.(newValue) ?? setValue(newValue);
    };
    const isError = !!error;
    const endAdornment =
        clearable && value.length > 0
            ? {
                  endAdornment: (
                      <MuiButton
                          onClick={() => {
                              handleSetValue('');
                          }}
                          title="Clear this field"
                          sx={{
                              minWidth: 'unset',
                              minHeight: 'unset',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: 'none',
                              color: colors.surface.gray[70],
                              '&:hover, &:focus': {
                                  color: colors.surface.gray[90],
                              },
                              ...globalFocusVisible,
                          }}
                      >
                          <FontAwesomeIcon icon={faCircleXmark} />
                      </MuiButton>
                  ),
              }
            : {};
    const length = value.length;
    return (
        <FormField
            className="met-input-text-field met-input-form-field"
            title={title}
            instructions={instructions}
            required={required}
            optional={optional}
            error={error}
        >
            <TextInput
                fullWidth
                error={isError}
                value={value}
                required={required}
                {...endAdornment}
                {...textInputProps}
                inputProps={{ ...textInputProps.inputProps, maxLength: textInputProps.maxLength }}
                onChange={handleSetValue}
            />
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                {textInputProps.counter && textInputProps.maxLength && (
                    <BodyText size="small" sx={{ color: colors.type.regular.secondary }}>
                        {length}/{textInputProps.maxLength}
                    </BodyText>
                )}
            </Box>
        </FormField>
    );
};

export const TextAreaField = ({ ...textFieldProps }: Omit<TextFieldProps, 'multiline' | 'minRows' | 'maxRows'>) => {
    return <TextField sx={{ height: 'unset' }} multiline minRows={4} maxRows={6} {...textFieldProps} />;
};
