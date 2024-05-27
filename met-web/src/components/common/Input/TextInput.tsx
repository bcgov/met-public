import React, { useEffect } from 'react';
import { Button as MuiButton, Input, InputProps, Box, TextField as MuiTextField } from '@mui/material';
import { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import { colors, globalFocusVisible } from '..';
import { FormField, FormFieldProps } from './FormField';
import { BodyText } from '../Typography';
import { faCircleXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SxProps, Theme } from '@mui/system';

type TextInputProps = {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
} & Omit<InputProps, 'value' | 'onChange' | 'placeholder' | 'disabled'>;

export const TextInput: React.FC<TextInputProps> = ({
    id,
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
                boxShadow: error
                    ? `0 0 0 2px ${colors.notification.error.shade} inset`
                    : `0 0 0 1px ${colors.surface.gray[80]} inset`,
                caretColor: colors.surface.blue[90],
                '&:hover': {
                    boxShadow: `0 0 0 2px ${colors.surface.gray[90]} inset`,
                    '&:has(:disabled)': {
                        boxShadow: `0 0 0 1px ${colors.surface.gray[80]} inset`,
                    },
                },
                '&.Mui-focused': {
                    boxShadow: `0 0 0 4px ${colors.focus.regular.outer}`,
                    '&:has(:disabled)': {
                        // make sure disabled state doesn't override focus state
                        boxShadow: `0 0 0 1px ${colors.surface.gray[80]} inset`,
                    },
                },
                '&:has(:disabled)': {
                    background: colors.surface.gray[10],
                    color: colors.type.regular.secondary,
                    userSelect: 'none',
                    cursor: 'not-allowed',
                },
                ...sx,
            }}
            inputProps={{
                error: error,
                ...inputProps,
                'aria-describedby': id,
                sx: {
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: colors.type.regular.primary,
                    '&::placeholder': {
                        color: colors.type.regular.secondary,
                    },
                    '&:disabled': {
                        cursor: 'not-allowed',
                    },
                    border: 'none',
                    ...inputProps?.sx,
                },
            }}
            {...textFieldProps}
        />
    );
};

const clearInputButton = (onClick: () => void) => {
    return (
        <MuiButton
            onClick={onClick}
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
    disabled,
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
    const length = value.length;
    return (
        <FormField
            className="met-input-text-field met-input-form-field"
            title={title}
            disabled={disabled}
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
                disabled={disabled}
                endAdornment={clearable && value ? clearInputButton(() => handleSetValue('')) : undefined}
                {...textInputProps}
                inputProps={{ ...textInputProps.inputProps, maxLength: textInputProps.maxLength }}
                onChange={handleSetValue}
            />
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '8px', pt: '0.25em' }}>
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

// Define a Custom MUI Textfield
interface CustomTextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
    customLabel?: string;
    sx?: SxProps<Theme>;
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({ sx, ...props }) => {
    return (
        <MuiTextField
            {...props}
            sx={{
                '& .MuiOutlinedInput-root': {
                    display: 'flex',
                    height: '48px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    alignSelf: 'stretch',
                    borderRadius: '8px',
                    boxShadow: `0 0 0 1px ${colors.surface.gray[80]} inset`,
                    caretColor: colors.surface.blue[90],
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '1px', // Default outline
                        borderColor: colors.surface.gray[80],
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '2px', // 2px black outline on hover
                        borderColor: 'black',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '0px', // No outline when focused
                        borderColor: 'transparent',
                    },
                    '&.Mui-focused': {
                        boxShadow: `0 0 0 4px ${colors.focus.regular.outer}`,
                    },
                    '&:has(:disabled) .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '1px', // Ensure outline for disabled state
                        borderColor: colors.surface.gray[80],
                    },
                },
                ...sx,
            }}
        />
    );
};
