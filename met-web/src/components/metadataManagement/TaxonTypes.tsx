import {
    Abc,
    AlternateEmail,
    Event,
    EventNote,
    Flaky,
    Link,
    Article,
    PinOutlined,
    Phone,
    Schedule,
} from '@mui/icons-material';
import { TaxonType, GenericInputProps as TaxonInputProps } from './types';
import * as yup from 'yup';
import React from 'react';
import { TextField } from '@mui/material';
import {
    TaxonPicker,
    PickerTypes,
    taxonSwitch,
} from 'components/engagement/form/EngagementFormTabs/AdditionalDetails/Metadata/TaxonInputComponents';
import { MetadataFilterTypes } from './MetadataFilterTypes';

export const TaxonTypes: { [key: string]: TaxonType } = {
    text: {
        name: 'Text',
        icon: Abc,
        supportsPresetValues: true,
        supportsFreeform: true,
        supportsMulti: true,
        yupValidator: yup.string(),
        supportedFilters: [MetadataFilterTypes.chips_all, MetadataFilterTypes.chips_any],
        allowFreeformInFilter: true,
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
        customInput: taxonSwitch,
    },
    date: {
        name: 'Date',
        icon: Event,
        supportsPresetValues: false,
        supportsFreeform: false,
        supportsMulti: true,
        yupValidator: yup.date().typeError('This value must be a valid date.'),
        customInput: ({ ...props }: TaxonInputProps) => TaxonPicker({ ...props, pickerType: PickerTypes.DATE }),
    },
    time: {
        name: 'Time',
        icon: Schedule,
        supportsPresetValues: false,
        supportsFreeform: false,
        supportsMulti: false,
        yupValidator: yup.date().typeError('This value must be a valid time.'),
        customInput: ({ ...props }: TaxonInputProps) => TaxonPicker({ ...props, pickerType: PickerTypes.TIME }),
    },
    datetime: {
        name: 'Date and Time',
        icon: EventNote,
        supportsPresetValues: false,
        supportsFreeform: false,
        supportsMulti: false,
        yupValidator: yup.date().typeError('This value must consist of a valid date and time.'),
        customInput: ({ ...props }: TaxonInputProps) => TaxonPicker({ ...props, pickerType: PickerTypes.DATETIME }),
    },
    url: {
        name: 'Web Link',
        icon: Link,
        supportsPresetValues: true,
        supportsFreeform: true,
        supportsMulti: true,
        yupValidator: yup.string().url('This value must be a valid web URL.'),
        externalResource: (value: string) => value,
        externalResourceLabel: 'Open',
    },
    email: {
        name: 'Email Address',
        icon: AlternateEmail,
        supportsPresetValues: true,
        supportsFreeform: true,
        supportsMulti: true,
        yupValidator: yup.string().email('This value must be a valid email address.'),
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
                'This value must be a valid phone number.',
            ),
        externalResource: (value: string) => `tel:${value}`,
        externalResourceLabel: 'Call',
    },
};
