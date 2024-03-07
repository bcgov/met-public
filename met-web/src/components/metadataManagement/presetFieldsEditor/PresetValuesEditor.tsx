import React, { useState } from 'react';
import { Autocomplete, TextField, Chip, IconButton, Stack } from '@mui/material';
import { Controller, FieldError } from 'react-hook-form';
import { ArrowCircleUp, HighlightOff } from '@mui/icons-material';

const PresetValuesEditor = ({
    control, // The control object (from react-hook-form)
    name, // The name of the field in the form
}: {
    control: any;
    name: string;
}) => {
    // State to manage the input value of the Autocomplete component
    const [inputValue, setInputValue] = useState('');

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value }, formState: { errors } }) => {
                const valueErrors = (errors.preset_values as unknown as Array<FieldError>) ?? [];
                const errorIndices = new Set<number>();
                const errorMessage = valueErrors?.map((error: FieldError, index: number) => {
                    errorIndices.add(index);
                    return (
                        <span key={index}>
                            Entry #{index + 1}: {error.message}
                            <br />
                        </span>
                    );
                });

                const onArrayChange = (_event: any, newValue: string[] | null) => {
                    newValue = newValue ?? [...value, inputValue];
                    newValue = newValue.map((v: string) => v.trim()).filter(Boolean);
                    onChange(newValue);
                    setInputValue(''); // Clear the input value after change
                };

                return (
                    <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={value || []}
                        inputValue={inputValue}
                        onInputChange={(_event, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        onChange={onArrayChange}
                        renderTags={(value, getTagProps) => (
                            <Stack width="100%" direction="row" spacing={1} flexWrap="wrap">
                                {value.map((option, index) => (
                                    <Chip
                                        variant="outlined"
                                        label={option}
                                        {...getTagProps({ index })}
                                        key={index}
                                        color={errorIndices.has(index) ? 'error' : 'default'}
                                    />
                                ))}
                            </Stack>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Preset values"
                                placeholder="Type a new option..."
                                error={!!errors.preset_values}
                                helperText={errorMessage}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {inputValue && (
                                                <IconButton
                                                    title="Add value to the list"
                                                    onClick={() => {
                                                        onArrayChange(null, [...value, inputValue]);
                                                    }}
                                                >
                                                    <ArrowCircleUp />
                                                </IconButton>
                                            )}
                                            <IconButton
                                                color="error"
                                                title="Clear all values"
                                                onClick={() => onChange([])}
                                            >
                                                <HighlightOff />
                                            </IconButton>
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                );
            }}
        />
    );
};

export default PresetValuesEditor;
