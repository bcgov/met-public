import {
    TextField,
    Switch,
    FormControlLabel,
    FormControl,
    FormGroup,
    Select,
    Grid,
    InputLabel,
    Button,
    MenuItem,
    Tooltip,
    Avatar,
    Collapse,
    Box,
} from '@mui/material';
import { Save, Check, Edit, Close, Delete, Error, VerifiedUser, ShieldMoon, Queue, AddBox } from '@mui/icons-material';
import * as yup from 'yup';
import React, { useContext, useEffect } from 'react';
import { MetadataTaxon } from 'models/engagement';
import { ActionContext } from './ActionContext';
import { useAppDispatch } from 'hooks';
import { If, Then, Else } from 'react-if';
import { TaxonTypes } from './TaxonTypes';
import { TaxonType } from './types';
import PresetValuesEditor from './presetFieldsEditor/PresetValuesEditor';
import { useForm, SubmitHandler, Controller, FormProvider } from 'react-hook-form';
import { MetHeader3 } from 'components/common';
import { openNotification } from 'services/notificationService/notificationSlice';

const TaxonEditForm = ({ taxon }: { taxon: MetadataTaxon }): JSX.Element => {
    const { setSelectedTaxonId, updateMetadataTaxon, removeMetadataTaxon } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const methods = useForm<MetadataTaxon>({
        defaultValues: {
            name: taxon.name,
            description: taxon.description || '',
            freeform: taxon.freeform,
            one_per_engagement: taxon.one_per_engagement,
            data_type: taxon.data_type,
            preset_values: taxon.preset_values,
        },
    });
    const {
        handleSubmit,
        control,
        watch,
        formState: { isDirty },
        reset,
        setError,
    } = methods;

    useEffect(() => {
        reset({
            name: taxon.name || '',
            description: taxon.description || '',
            freeform: taxon.freeform || false,
            one_per_engagement: taxon.one_per_engagement || false,
            data_type: taxon.data_type || 'text',
            preset_values: taxon.preset_values || [],
        });
    }, [taxon, reset]);

    // Watch data_type to update taxonType
    const dataType = watch('data_type');
    const taxonType = TaxonTypes[dataType as keyof typeof TaxonTypes];
    // Watch freeform to update label
    const isFreeform = watch('freeform');
    const isMulti = !watch('one_per_engagement');
    const presetValues = watch('preset_values');

    const schema = yup.object().shape({
        name: yup.string().required('Name is required').max(64, 'Name is too long!'),
        description: yup.string().max(255, 'Description is too long!').strip(),
        freeform: yup.boolean().oneOf([taxonType.supportsFreeform, false]),
        one_per_engagement: taxonType.supportsMulti ? yup.boolean() : yup.boolean().oneOf([true]),
        data_type: yup.string().required('Type is required'),
        preset_values: yup.mixed().when('data_type', {
            is: (value: string) => TaxonTypes[value as keyof typeof TaxonTypes].supportsPresetValues,
            then: yup.mixed().when('freeform', {
                is: false,
                then: yup
                    .array()
                    .of(taxonType.yupValidator ?? yup.mixed())
                    .required('Preset value is required'),
                otherwise: yup.array().of(taxonType.yupValidator ?? yup.mixed()),
            }),
            otherwise: yup.mixed().strip(),
        }),
    });

    const onSubmit: SubmitHandler<MetadataTaxon> = async (data, event) => {
        let formErrors: { [key: string]: string } = {};
        // These fields don't always apply to all taxon types, so
        // if they are unsupported, we set them to the defaults
        if (!taxonType.supportsFreeform) data.freeform = false;
        if (!taxonType.supportsMulti) data.one_per_engagement = true;
        if (!taxonType.supportsPresetValues) data.preset_values = [];
        try {
            await schema.validate(data, { abortEarly: false });
        } catch (error: any) {
            formErrors = error.inner.reduce((errors: { [key: string]: string }, innerError: any) => {
                errors[innerError.path] = innerError.message;
                return errors;
            }, {});
            // Set errors for each field in formState
            Object.keys(formErrors).forEach((fieldName) => {
                setError(fieldName as keyof MetadataTaxon, {
                    type: 'validate',
                    message: formErrors[fieldName],
                });
            });
        }

        if (!!Object.keys(formErrors).length) {
            console.log('Form errors:', formErrors);
            dispatch(
                openNotification({ text: 'Please correct the highlighted errors before saving.', severity: 'error' }),
            );
            return false;
        }

        const updatedTaxon: MetadataTaxon = {
            ...taxon,
            name: data.name,
            description: data.description,
            freeform: data.freeform || data.preset_values?.length === 0,
            one_per_engagement: data.one_per_engagement || !TaxonTypes[data.data_type ?? 'text'].supportsMulti,
            data_type: data.data_type,
            preset_values: TaxonTypes[data.data_type ?? 'text'].supportsPresetValues ? data.preset_values : [],
        };

        const result = updateMetadataTaxon(updatedTaxon);
    };

    const handleKeys = (event: React.KeyboardEvent) => {
        // Handle as many key combinations as possible
        if ((event.ctrlKey || event.metaKey || event.altKey) && event.key === 'Enter') {
            event.nativeEvent.stopImmediatePropagation();
            event.preventDefault(); // Prevent default to stop any native form submission
            handleSubmit(onSubmit)();
        }
    };

    const isMac = () => {
        return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    };
    const modifierKey = !isMac() ? 'Ctrl' : '⌘';

    // Whether the options can be limited to preset values
    const allowLimiting = taxonType.supportsFreeform && Boolean(presetValues?.length ?? 0 > 0);

    return (
        <FormProvider {...methods}>
            <FormGroup onKeyDown={handleKeys}>
                <Grid container spacing={2} direction="column" sx={{ width: '100%', maxWidth: '40em' }}>
                    <Grid item container direction="row">
                        <Grid item xs={6} container alignItems="center">
                            <Avatar sx={{ backgroundColor: 'primary.main', marginRight: '0.5em' }}>
                                <Edit />
                            </Avatar>
                            <MetHeader3>Edit taxon</MetHeader3>
                        </Grid>
                        <Grid item xs={6} alignItems="center" textAlign="right">
                            <Button
                                variant="outlined"
                                color="error"
                                aria-label="delete"
                                onClick={() => removeMetadataTaxon(taxon.id)}
                            >
                                <Delete /> Delete
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    label="Taxon Name"
                                    error={!!methods.formState.errors.name}
                                    helperText={methods.formState.errors.name?.message}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    maxRows={8}
                                    label="Taxon Description"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth>
                            <InputLabel id="taxonType">Type</InputLabel>
                            <Controller
                                name="data_type"
                                control={control}
                                render={({ field }) => (
                                    <Select label="Type" value={field.value} onChange={field.onChange}>
                                        {Object.entries(TaxonTypes).map(([key, type]: [string, TaxonType]) => (
                                            <MenuItem key={key} value={key}>
                                                <Grid container spacing={1} alignItems="center">
                                                    <Grid item>
                                                        <type.icon />
                                                    </Grid>
                                                    <Grid item>{type.name}</Grid>
                                                </Grid>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <Collapse in={taxonType.supportsPresetValues} timeout="auto" unmountOnExit>
                            <PresetValuesEditor control={methods.control} name="preset_values" />
                        </Collapse>
                    </Grid>
                    <Grid item>
                        <Collapse in={taxonType.supportsPresetValues && allowLimiting} timeout="auto" unmountOnExit>
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="freeform"
                                        control={control}
                                        render={({ field: { onChange, value } }) => {
                                            return (
                                                <Switch
                                                    checked={!value && allowLimiting}
                                                    onChange={(e) => onChange(!e.target.checked)}
                                                />
                                            );
                                        }}
                                    />
                                }
                                label={
                                    <Box display="flex" alignItems="center">
                                        {isFreeform ? <ShieldMoon /> : <VerifiedUser />}
                                        <Box ml={1}>Limit to preset values</Box>
                                    </Box>
                                }
                            />
                        </Collapse>
                    </Grid>
                    <Grid item>
                        <Collapse in={taxonType.supportsMulti} timeout="auto" unmountOnExit>
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="one_per_engagement"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Switch checked={!value} onChange={(e) => onChange(!e.target.checked)} />
                                        )}
                                    />
                                }
                                label={
                                    <Box display="flex" alignItems="center">
                                        {isMulti ? <Queue /> : <AddBox />}
                                        <Box ml={1}>Allow multiple values</Box>
                                    </Box>
                                }
                            />
                        </Collapse>
                    </Grid>
                    <Grid item container alignItems="center" justifyContent="flex-start">
                        <Button variant="outlined" onClick={() => setSelectedTaxonId(-1)}>
                            <Close /> Cancel
                        </Button>
                        <If condition={Object.keys(methods.formState.errors).length === 0}>
                            <Then>
                                <If condition={isDirty}>
                                    <Then>
                                        <Tooltip title={`Save (${modifierKey} + Enter)`}>
                                            <Button
                                                variant="contained"
                                                onClick={handleSubmit(onSubmit)}
                                                sx={{ marginLeft: '0.5em' }}
                                            >
                                                <Save /> Save
                                            </Button>
                                        </Tooltip>
                                    </Then>
                                    <Else>
                                        <Button variant="contained" disabled sx={{ marginLeft: '0.5em' }}>
                                            <Check /> Saved
                                        </Button>
                                    </Else>
                                </If>
                            </Then>
                            <Else>
                                <Button variant="contained" disabled sx={{ marginLeft: '0.5em' }}>
                                    <Error /> Save
                                </Button>
                            </Else>
                        </If>
                    </Grid>
                </Grid>
            </FormGroup>
        </FormProvider>
    );
};

export default TaxonEditForm;
