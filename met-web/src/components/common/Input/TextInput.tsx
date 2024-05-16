import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, Input, InputProps, Box } from '@mui/material';
import { colors, elevations, globalFocusVisible } from '..';
import { FormField, FormFieldProps } from './FormField';
import { BodyText } from '../Typography';
import { faCircleXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type TextInputProps = {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
} & Omit<InputProps, 'value' | 'onChange' | 'placeholder' | 'disabled' | 'error'>;

export const TextInput: React.FC<TextInputProps> = ({
    value,
    onChange,
    placeholder,
    disabled,
    ...textFieldProps
}: TextInputProps) => {
    // Exclude props with conflicting types
    const { error, sx, inputProps, ...rest } = textFieldProps;
    return (
        <Input
            className="met-input-text"
            disableUnderline
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            error={!!error}
            sx={{
                display: 'flex',
                height: '48px',
                padding: '8px 16px',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                alignSelf: 'stretch',
                borderRadius: '8px',
                outline: `1px solid ${colors.surface.gray[80]}`,
                outlineStyle: 'inset',
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
            {...rest}
        />
    );
};

export type TextFieldProps = {
    counter?: boolean;
    maxLength?: number;
    clearable?: boolean;
} & Omit<FormFieldProps, 'children'> &
    Omit<TextInputProps, 'fullWidth'>;

export const TextField = ({
    title,
    instructions,
    required,
    optional,
    clearable,
    ...textInputProps
}: TextFieldProps) => {
    const [value, setValue] = React.useState(textInputProps.value || '');
    const handleSetValue = (newValue: string) => {
        setValue(newValue);
        textInputProps.onChange?.(newValue);
    };
    const endAdornment = clearable
        ? {
              endAdornment: (
                  <MuiButton
                      onClick={() => handleSetValue('')}
                      sx={{
                          padding: '0',
                          minWidth: 'unset',
                          minHeight: 'unset',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'none',
                          color: colors.type.regular.secondary,
                          '&:hover': {
                              background: colors.surface.gray[80],
                          },
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
        >
            <TextInput fullWidth value={value} {...endAdornment} {...textInputProps} onChange={handleSetValue} />
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
