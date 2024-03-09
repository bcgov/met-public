import React, { forwardRef, useContext, useEffect, useImperativeHandle, useMemo } from 'react';
import { Grid, Divider, Typography, Avatar, Chip } from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { MetHeader4 } from 'components/common';
import { EngagementTabsContext } from '../../EngagementTabsContext';
import { MetadataTaxon } from 'models/engagement';
import { TaxonTypes } from 'components/metadataManagement/TaxonTypes';
import { TaxonFormValues } from 'components/metadataManagement/types';
import { useTheme } from '@mui/material/styles';
import { ActionContext } from '../../../ActionContext';
import * as yup from 'yup';
import { defaultAutocomplete } from './TaxonInputComponents';
import { yupResolver } from '@hookform/resolvers/yup';

const EngagementMetadata = forwardRef((_props, ref) => {
    const { metadataFormRef } = useContext(EngagementTabsContext);
    const { tenantTaxa, setTaxonMetadata, taxonMetadata } = useContext(ActionContext);

    const validationSchema = useMemo(() => {
        const schemaShape: { [key: string]: yup.SchemaOf<any> } = tenantTaxa.reduce((acc, taxon) => {
            const taxonType = TaxonTypes[taxon.data_type as keyof typeof TaxonTypes];
            if (taxonType.yupValidator) {
                if (taxon.one_per_engagement) {
                    acc[taxon.id.toString()] = taxonType.yupValidator.nullable();
                } else {
                    acc[taxon.id.toString()] = yup.array().of(taxonType.yupValidator).nullable();
                }
            }
            return acc;
        }, {} as { [key: string]: yup.SchemaOf<any> }); // Add index signature to the initial value of acc
        return yup.object().shape(schemaShape);
    }, [tenantTaxa]);

    const initialValues = useMemo<TaxonFormValues>(() => {
        // Use tenantTaxa and taxonMetadata to find initial values
        // tenantTaxa is a list of Taxon objects and taxonMetadata is a map of taxonIds to values
        return tenantTaxa.reduce((values: TaxonFormValues, taxon) => {
            values[taxon.id.toString()] = taxonMetadata.get(taxon.id) ?? (taxon.one_per_engagement ? null : []);
            if (taxon.one_per_engagement) {
                values[taxon.id.toString()] = values[taxon.id.toString()]?.[0] ?? null;
            }
            return values; // Return the updated values object
        }, {});
    }, [tenantTaxa, taxonMetadata]);

    useEffect(() => {
        // Reset the form when the initialValues change
        // (e.g. when the engagement is updated from the server)
        reset(initialValues);
    }, [initialValues]);
    // Initialize react-hook-form
    const {
        control,
        handleSubmit,
        setValue,
        reset,
        getValues,
        trigger,
        watch,
        formState: { errors },
    } = useForm<TaxonFormValues>({
        defaultValues: initialValues,
        resolver: yupResolver(validationSchema),
    });

    const cleanArray = (arr: string[]) => arr.map((v) => v.trim()).filter(Boolean);

    const onSubmit: SubmitHandler<TaxonFormValues> = async () => {
        const data = getValues();
        console.log('Submitting form', data);
        Object.entries(data).forEach(async ([id, value]) => {
            const taxonId = Number(id);
            const taxonMeta = taxonMetadata.get(taxonId) ?? [];
            value = value ?? [];
            // Normalize and clean the arrays
            value = Array.isArray(value) ? cleanArray(value) : value.toString().trim();
            const normalizedTaxonMeta = cleanArray(taxonMeta);
            value = Array.isArray(value) ? value : [value];
            console.log('Comparing taxon metadata', normalizedTaxonMeta, taxonId, value);
            if (JSON.stringify(value.sort()) === JSON.stringify(taxonMeta.sort())) return;
            // If we reach here, arrays are not equal, proceed with update
            console.log('Updating taxon metadata', normalizedTaxonMeta, taxonId, value);
            await setTaxonMetadata(taxonId, value);
        });
    };

    useImperativeHandle(ref, () => ({
        submitForm: async () => {
            // validate the form
            await handleSubmit(onSubmit)(); // manually trigger form submission
            const isValid = await trigger([...tenantTaxa.map((taxon) => taxon.id.toString())]);

            // After submission, check if there are any errors
            return isValid;
        },
    }));

    const renderTaxonTile = (taxon: MetadataTaxon, index: number) => {
        const taxonType = TaxonTypes[taxon.data_type as keyof typeof TaxonTypes];
        const theme = useTheme();
        const taxonValue = watch(taxon.id.toString());
        const TaxonInput = taxonType.customInput ?? defaultAutocomplete;
        return (
            <Grid
                item
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                flexBasis="auto"
                key={index}
                spacing={1}
                padding={2}
                xs={12}
                xl={6}
            >
                <Grid item>
                    <Avatar
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                        }}
                    >
                        <taxonType.icon />
                    </Avatar>
                </Grid>
                <Grid item>
                    <MetHeader4 bold>{taxon.name}</MetHeader4>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                        {taxon.description}
                        <i>
                            {taxon.one_per_engagement ? ' ' : ' (Enter one or more)'}
                            {taxon.freeform ? '' : ' (Options limited)'}
                        </i>
                    </Typography>
                </Grid>
                <Grid xs={12} mb={1} mt={1} item component={Divider}></Grid>
                {taxonType.externalResource && taxon.one_per_engagement && (
                    <Grid item pb={1} xs={12}>
                        <Chip
                            disabled={!taxonValue || !!errors[taxon.id.toString()]}
                            label={taxonType.externalResourceLabel ?? 'Open external resource'}
                            color="primary"
                            icon={<taxonType.icon />}
                            onClick={() => {
                                taxonType.externalResource &&
                                    window.open(taxonType.externalResource(taxonValue), '_blank');
                            }}
                        />
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Controller
                        name={taxon.id.toString()}
                        control={control}
                        render={({ field }) => TaxonInput({ field, taxon, taxonType, setValue, errors, trigger })}
                    />
                </Grid>
            </Grid>
        );
    };

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
            <form onSubmit={handleSubmit(onSubmit)} ref={metadataFormRef}>
                <Grid item xs={12} m={1}>
                    <MetHeader4 bold>Engagement Metadata</MetHeader4>
                </Grid>
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={3}
                    padding={2}
                >
                    {tenantTaxa.map(renderTaxonTile)}
                </Grid>
            </form>
        </Grid>
    );
});

export default EngagementMetadata;
