import {
    TextField,
    Switch,
    FormControlLabel,
    FormControl,
    FormGroup,
    Select,
    Grid,
    Button,
    MenuItem,
    Tooltip,
    Avatar,
    Collapse,
    Box,
    useMediaQuery,
    Theme,
} from '@mui/material';
import { Save, Check, Edit, Close, Delete, Error, FilterAltOff, HelpOutline } from '@mui/icons-material';
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
import { MetHeader3, MetLabel } from 'components/common';
import { openNotification } from 'services/notificationService/notificationSlice';

const HelpTooltip = ({ children }: { children: string | string[] }) => {
    if (Array.isArray(children)) children = children.join(' ');
    return (
        <Tooltip title={children}>
            <HelpOutline tabIndex={0} color="primary" aria-label={children} />
        </Tooltip>
    );
};

const TaxonEditForm = ({ taxon }: { taxon: MetadataTaxon }): JSX.Element => {
    const { setSelectedTaxonId, updateMetadataTaxon, removeMetadataTaxon } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const methods = useForm<MetadataTaxon>({
        defaultValues: {
            name: taxon.name,
            description: taxon.description ?? '',
            freeform: taxon.freeform,
            one_per_engagement: taxon.one_per_engagement,
            data_type: taxon.data_type,
            preset_values: taxon.preset_values,
            filter_type: taxon.filter_type,
            include_freeform: taxon.include_freeform,
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
            name: taxon.name ?? '',
            description: taxon.description ?? '',
            freeform: taxon.freeform ?? false,
            one_per_engagement: taxon.one_per_engagement ?? false,
            data_type: taxon.data_type ?? 'text',
            preset_values: taxon.preset_values ?? [],
            filter_type: taxon.filter_type ?? 'none',
            include_freeform: taxon.include_freeform ?? false,
        });
    }, [taxon, reset]);

    // Watch data_type to update taxonType
    const dataType = watch('data_type');
    const taxonType = TaxonTypes[dataType as keyof typeof TaxonTypes];
    // Watch freeform to update label
    const isFreeform = watch('freeform');
    const isValidFilter = watch('filter_type') !== 'none';
    const presetValues = watch('preset_values');

    const schema = yup.object().shape({
        name: yup.string().required('Name is required').max(64, 'Name is too long! Limit: 64 characters.'),
        description: yup.string().max(255, 'Description is too long! Limit: 255 characters.'),
        freeform: yup.boolean().oneOf([taxonType.supportsFreeform, false]),
        one_per_engagement: taxonType.supportsMulti ? yup.boolean() : yup.boolean().oneOf([true]),
        data_type: yup.string().required('Type is required'),
        preset_values: yup.mixed().when('data_type', {
            is: (value: string) => taxonType.supportsPresetValues,
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
        filter_type: yup.string().when('data_type', {
            is: (value: string) => (taxonType.supportedFilters ?? []).length > 0,
            then: yup
                .string()
                .oneOf(['none', ...(taxonType.supportedFilters ?? []).map((filter) => filter.code)])
                .nullable(),
            otherwise: yup.string().strip(),
        }),
        include_freeform: yup.boolean().when('filter_type', {
            is: (value: string) => {
                return taxonType.allowFreeformInFilter;
            },
            then: yup.boolean().optional(),
            otherwise: yup.boolean().strip(),
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
            // Catch clause variable type annotation must be 'any' or 'unknown' if specified
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: yup.ValidationError | any) {
            console.error(error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        if (Object.keys(formErrors).length) {
            dispatch(
                // openNotification({ text: 'Please correct the highlighted errors before saving.', severity: 'error' }),
                openNotification({
                    severity: 'info',
                    text: 'This state is never used and I had to make a custom function to open it',
                }),
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
            filter_type: data.filter_type === 'none' ? null : data.filter_type,
            include_freeform: data.include_freeform,
        };
        console.log(updatedTaxon);
        updateMetadataTaxon(updatedTaxon);
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
    const allowLimiting = taxonType.supportsFreeform && (presetValues?.length ?? 0) > 0;

    return (
        <FormProvider {...methods}>
            <FormGroup onKeyDown={handleKeys}>
                <Grid container spacing={2} direction="column" sx={{ width: '100%', maxWidth: '40em' }}>
                    <Grid item container direction="row">
                        <Grid item xs={6} container alignItems="center">
                            {!isSmallScreen && (
                                <Avatar sx={{ backgroundColor: 'primary.main', marginRight: '0.5em' }}>
                                    <Edit />
                                </Avatar>
                            )}
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
                        <MetLabel>Taxon Name</MetLabel>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    placeholder="Enter taxon name"
                                    error={!!methods.formState.errors.name}
                                    helperText={methods.formState.errors.name?.message}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item>
                        <MetLabel>Taxon Description</MetLabel>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    maxRows={8}
                                    placeholder="[Optional] Enter a description"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item>
                        <Grid item container justifyContent="flex-start" alignItems="left">
                            <MetLabel marginRight={1}>Data Type</MetLabel>
                            <HelpTooltip>
                                The type of data that this taxon will store. Affects the availability of some other
                                options.
                            </HelpTooltip>
                        </Grid>
                        <FormControl fullWidth>
                            <Controller
                                name="data_type"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onChange={field.onChange}>
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
                    <Grid item component={Collapse} in={taxonType.supportsPresetValues} timeout="auto" unmountOnExit>
                        <Grid item container justifyContent="flex-start" alignItems="left">
                            <MetLabel marginRight={1}>Preset Values</MetLabel>
                            <HelpTooltip>
                                These values will be shown to staff as possible options when creating engagements.
                                {(Boolean(taxonType.supportedFilters) || '') &&
                                    "If filtering is enabled below, they are also publicly visible as the filter's options."}
                            </HelpTooltip>
                        </Grid>
                        <PresetValuesEditor control={methods.control} name="preset_values" />
                    </Grid>
                    <Grid
                        item
                        component={Collapse}
                        in={taxonType.supportsPresetValues && allowLimiting}
                        timeout="auto"
                        unmountOnExit
                    >
                        <FormControlLabel
                            control={
                                <Controller
                                    name="freeform"
                                    control={control}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Switch
                                                checked={value && allowLimiting}
                                                onChange={(e) => onChange(e.target.checked)}
                                            />
                                        );
                                    }}
                                />
                            }
                            label={
                                <Box display="flex" alignItems="center">
                                    <Box ml={1} mr={1}>
                                        Allow custom values
                                    </Box>
                                    <HelpTooltip>
                                        If enabled, users can enter custom values when creating engagements. Otherwise,
                                        only preset values can be used.
                                    </HelpTooltip>
                                </Box>
                            }
                        />
                    </Grid>
                    <Grid item component={Collapse} in={taxonType.supportsMulti} timeout="auto" unmountOnExit>
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
                                    <Box ml={1} mr={1}>
                                        Allow multiple values
                                    </Box>
                                    <HelpTooltip>
                                        When enabled, users can enter multiple values for this taxon in a single
                                        engagement. Otherwise, only one value can be entered.
                                    </HelpTooltip>
                                </Box>
                            }
                        />
                    </Grid>
                    <Grid item component={Collapse} in={!!taxonType.supportedFilters} timeout="auto" unmountOnExit>
                        <Grid item container justifyContent="flex-start" alignItems="left">
                            <MetLabel marginRight={1}>Engagement Filtering</MetLabel>
                            <HelpTooltip>
                                Selecting a filter style allows the public to use this taxon to narrow down which
                                engagements they want to see. "No filtering" means it will not be publicly shown. For
                                details on the selected filter, expand and read the blue highlighted {taxon.name ?? ''}{' '}
                                card.`
                            </HelpTooltip>
                        </Grid>
                        <FormControl fullWidth>
                            <Controller
                                name="filter_type"
                                control={control}
                                render={({ field: { onChange, value, ...fieldProps } }) => (
                                    <Select
                                        error={!!methods.formState.errors.filter_type}
                                        value={value || 'none'} // Display "none" when value is null or undefined
                                        onChange={onChange}
                                        {...fieldProps}
                                    >
                                        <MenuItem value="none">
                                            <Grid container alignItems="center" spacing={1}>
                                                {!isSmallScreen && (
                                                    <Grid item>
                                                        <FilterAltOff />
                                                    </Grid>
                                                )}
                                                <Grid item>No filtering</Grid>
                                            </Grid>
                                        </MenuItem>
                                        {taxonType.supportedFilters?.map((filter) => (
                                            <MenuItem key={filter.code} value={filter.code}>
                                                <Grid container alignItems="center" spacing={1}>
                                                    {!isSmallScreen && (
                                                        <Grid item>
                                                            <filter.icon />
                                                        </Grid>
                                                    )}
                                                    <Grid item>Show as {filter.name}</Grid>
                                                </Grid>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            ></Controller>
                        </FormControl>
                    </Grid>
                    <Grid
                        item
                        component={Collapse}
                        in={Boolean(taxonType.allowFreeformInFilter && isFreeform && isValidFilter)}
                        timeout="auto"
                        unmountOnExit
                    >
                        <FormControlLabel
                            control={
                                <Controller
                                    name="include_freeform"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Switch checked={value} onChange={(e) => onChange(e.target.checked)} />
                                    )}
                                />
                            }
                            label={
                                <Box display="flex" alignItems="center">
                                    <Box ml={1} mr={1}>
                                        Include custom values as filter options
                                    </Box>
                                    <HelpTooltip>
                                        If enabled, custom values entered on engagements will be available as filter
                                        options, in addition to the preset values.
                                    </HelpTooltip>
                                </Box>
                            }
                        />
                    </Grid>
                    <Grid item container alignItems="center" justifyContent="flex-start">
                        <Tooltip title="Discard changes to taxon" id="cancel-button-tooltip">
                            <Button
                                variant="outlined"
                                aria-label="Discard changes to taxon"
                                onClick={() => setSelectedTaxonId(-1)}
                            >
                                <Close /> Cancel
                            </Button>
                        </Tooltip>
                        <If condition={Object.keys(methods.formState.errors).length === 0}>
                            <Then>
                                <If condition={isDirty}>
                                    <Then>
                                        <Tooltip title={`Save changes to taxon (${modifierKey} + Enter)`}>
                                            <Button
                                                variant="contained"
                                                aria-label="Save changes to taxon"
                                                onClick={handleSubmit(onSubmit)}
                                                sx={{ marginLeft: '0.5em' }}
                                            >
                                                <Save /> Save
                                            </Button>
                                        </Tooltip>
                                    </Then>
                                    <Else>
                                        <Button
                                            variant="contained"
                                            aria-label="No changes to save"
                                            aria-disabled
                                            disabled
                                            sx={{ marginLeft: '0.5em' }}
                                        >
                                            <Check /> Saved
                                        </Button>
                                    </Else>
                                </If>
                            </Then>
                            <Else>
                                <Tooltip title="Unable to save due to form errors" id="save-button-tooltip">
                                    <span>
                                        {/* Span is used to allow disabled elements in a tooltip */}
                                        <Button
                                            variant="contained"
                                            aria-disabled
                                            aria-labelledby="save-button-tooltip"
                                            aria-details="Please correct the errors before saving."
                                            disabled
                                            sx={{ marginLeft: '0.5em' }}
                                        >
                                            <Error /> Save
                                        </Button>
                                    </span>
                                </Tooltip>
                            </Else>
                        </If>
                    </Grid>
                </Grid>
            </FormGroup>
        </FormProvider>
    );
};

export default TaxonEditForm;
