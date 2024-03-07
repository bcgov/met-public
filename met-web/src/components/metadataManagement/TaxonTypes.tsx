import {
    AlternateEmail,
    Event,
    EventNote,
    Flaky,
    Link,
    Article,
    ChatBubbleOutline,
    PinOutlined,
    Phone,
    Schedule,
} from '@mui/icons-material';
import { TaxonType, GenericInputProps as TaxonInputProps } from './types';
import * as yup from 'yup';
import React from 'react';
import { FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import { TaxonPicker } from 'components/engagement/form/EngagementFormTabs/AdditionalDetails/Metadata/TaxonInputComponents';

export const TaxonTypes: { [key: string]: TaxonType } = {
    text: {
        name: 'Text',
        icon: ChatBubbleOutline,
        supportsPresetValues: true,
        supportsFreeform: true,
        supportsMulti: true,
        yupValidator: yup.string(),
    },
    long_text: {
        name: 'Multiline Text',
        icon: Article,
        supportsPresetValues: false,
        supportsFreeform: true,
        supportsMulti: false,
        yupValidator: yup.string(),
        customInput: ({ taxon, field, setValue, errors }: TaxonInputProps) => (
            <TextField
                {...field}
                label={taxon.name}
                variant="outlined"
                error={!!errors[taxon.id.toString()]}
                helperText={errors[taxon.id.toString()]?.message?.toString() ?? ''}
                fullWidth
                multiline
                minRows={3}
                maxRows={8}
                onChange={(e) => {
                    setValue(taxon.id.toString(), e.target.value);
                }}
            />
        ),
    },
    number: {
        name: 'Number',
        icon: PinOutlined,
        supportsPresetValues: true,
        supportsFreeform: true,
        supportsMulti: true,
        yupValidator: yup.number().typeError('This value must be a number.'),
    },
    boolean: {
        name: 'True/False',
        icon: Flaky,
        supportsPresetValues: false,
        supportsFreeform: false,
        supportsMulti: false,
        yupValidator: yup.boolean(),
        customInput: ({ taxon, field, setValue, errors }: TaxonInputProps) => (
            <FormControlLabel
                control={
                    <Switch
                        {...field}
                        checked={field?.value ?? false}
                        onChange={(e) => {
                            setValue(taxon.id.toString(), e.target.checked);
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                }
                label={
                    <>
                        {taxon.name}
                        {errors[taxon.id.toString()] && (
                            <Typography variant="caption" color="error">
                                {errors[taxon.id.toString()]?.message?.toString() ?? ''}
                            </Typography>
                        )}
                    </>
                }
                color={errors[taxon.id.toString()] ? 'error' : 'primary'}
            />
        ),
    },
    date: {
        name: 'Date',
        icon: Event,
        supportsPresetValues: false,
        supportsFreeform: false,
        supportsMulti: false,
        yupValidator: yup.date().typeError('This value must be a valid date.'),
        customInput: ({ ...props }: TaxonInputProps) => TaxonPicker({ ...props, pickerType: 'DATE' }),
    },
    time: {
        name: 'Time',
        icon: Schedule,
        supportsPresetValues: false,
        supportsFreeform: false,
        supportsMulti: false,
        yupValidator: yup
            .string()
            // .uppercase()
            .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]( ?[AaPp][Mm])?$/, 'This field must be a valid time.'),
        customInput: ({ ...props }: TaxonInputProps) => TaxonPicker({ ...props, pickerType: 'TIME' }),
    },
    datetime: {
        name: 'Date and Time',
        icon: EventNote,
        supportsPresetValues: false,
        supportsFreeform: false,
        supportsMulti: false,
        yupValidator: yup.date().typeError('This field must be a valid date and time.'),
        customInput: ({ ...props }: TaxonInputProps) => TaxonPicker({ ...props, pickerType: 'DATETIME' }),
    },
    url: {
        name: 'Web Link',
        icon: Link,
        supportsPresetValues: true,
        supportsFreeform: true,
        supportsMulti: true,
        yupValidator: yup.string().url('This field must be a valid web URL.'),
        externalResource: (value: string) => value,
        externalResourceLabel: 'Open',
    },
    email: {
        name: 'Email Address',
        icon: AlternateEmail,
        supportsPresetValues: true,
        supportsFreeform: true,
        supportsMulti: true,
        yupValidator: yup.string().email('This field must be a valid email address.'),
        externalResource: (value: string) => `mailto:${value}`,
        externalResourceLabel: 'Email',
    },
    phone: {
        name: 'Phone Number',
        icon: Phone,
        supportsPresetValues: true,
        supportsFreeform: true,
        supportsMulti: true,
        yupValidator: yup
            .string()
            .matches(
                /^(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/,
                'This field must be a valid phone number.',
            ),
        externalResource: (value: string) => `tel:${value}`,
        externalResourceLabel: 'Call',
    },
};
