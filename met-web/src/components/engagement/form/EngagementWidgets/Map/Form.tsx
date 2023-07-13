import React, { useContext, useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import { Grid, Typography, Stack, IconButton } from '@mui/material';
import {
    MetHeader3,
    MetLabel,
    PrimaryButton,
    SecondaryButton,
    MidScreenLoader,
    MetWidgetPaper,
    MetDescription,
} from 'components/common';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch } from 'hooks';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { openNotification } from 'services/notificationService/notificationSlice';
import { MapContext } from './MapContext';
import { postMap, previewShapeFile } from 'services/widgetService/MapService';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import FileUpload from 'components/engagement/form/EngagementWidgets/Map/ShapeFileUpload/FileUpload';
import { geoJSONDecode } from './utils';
import { GeoJSON } from 'geojson';
import LinkIcon from '@mui/icons-material/Link';
import { When } from 'react-if';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import * as turf from '@turf/turf';

const schema = yup
    .object({
        markerLabel: yup.string().max(30, 'Markel label cannot exceed 30 characters'),
        shapefile: yup.mixed(),
        geojson: yup.mixed(),
        latitude: yup
            .number()
            .typeError('Invalid value for Latitude')
            .required('Latitude is required')
            .min(-90, 'Latitude must be greater than or equal to -90')
            .max(90, 'Latitude must be less than or equal to 90'),
        longitude: yup
            .number()
            .typeError('Invalid value for Longitude')
            .required('Longitude is required')
            .min(-180, 'Longitude must be greater than or equal to -180')
            .max(180, 'Longitude must be less than or equal to 180'),
        filename: yup.string().nullable(),
    })
    .required();

type DetailsForm = yup.TypeOf<typeof schema>;

const Form = () => {
    const dispatch = useAppDispatch();
    const { widget, mapData, isLoadingMap, setPreviewMapOpen, setPreviewMap } = useContext(MapContext);
    const { handleWidgetDrawerOpen } = useContext(WidgetDrawerContext);
    const [isCreating, setIsCreating] = useState(false);
    const [uploadName, setUploadName] = useState('');

    const methods = useForm<DetailsForm>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (mapData) {
            methods.setValue('markerLabel', mapData?.marker_label || '');
            methods.setValue('latitude', mapData?.latitude || undefined);
            methods.setValue('longitude', mapData?.longitude || undefined);
            methods.setValue('geojson', mapData ? geoJSONDecode(mapData?.geojson) : undefined);
            methods.setValue('filename', mapData ? mapData.file_name : undefined);
        }
    }, [mapData]);

    const { handleSubmit, reset, trigger, watch } = methods;

    const [longitude, latitude, markerLabel, geojson, shapefile, filename] = watch([
        'longitude',
        'latitude',
        'markerLabel',
        'geojson',
        'shapefile',
        'filename',
    ]);

    const createMap = async (data: DetailsForm) => {
        if (!widget) {
            return;
        }

        const validatedData = await schema.validate(data);
        const { latitude, longitude, markerLabel, shapefile } = validatedData;
        await postMap(widget.id, {
            widget_id: widget.id,
            engagement_id: widget.engagement_id,
            marker_label: markerLabel,
            longitude: longitude,
            latitude: latitude,
            file: shapefile,
        });
        dispatch(openNotification({ severity: 'success', text: 'A new map was successfully added' }));
    };

    const onSubmit: SubmitHandler<DetailsForm> = async (data: DetailsForm) => {
        if (!widget) {
            return;
        }
        try {
            setIsCreating(true);
            await createMap(data);
            setIsCreating(false);
            reset({});
            handleWidgetDrawerOpen(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'An error occurred while trying to add event' }));
            setIsCreating(false);
        }
    };

    const handlePreviewMap = async () => {
        const valid = await trigger(['latitude', 'longitude', 'markerLabel', 'shapefile']);
        const validatedData = await schema.validate({ latitude, longitude, markerLabel, geojson, shapefile });
        let previewGeoJson: turf.AllGeoJSON | GeoJSON | undefined;
        if (!valid) {
            return;
        }
        setPreviewMapOpen(true);
        if (shapefile) {
            previewGeoJson = await previewShapeFile({
                file: shapefile,
            });
        }
        setPreviewMap({
            longitude: validatedData.longitude,
            latitude: validatedData.latitude,
            markerLabel: validatedData.markerLabel,
            geojson: previewGeoJson ? previewGeoJson : validatedData.geojson,
        });
    };

    const handleAddFile = async (files: File[]) => {
        let previewGeoJson: turf.AllGeoJSON | GeoJSON | undefined;
        if (files.length > 0) {
            methods.setValue('shapefile', files[0]);
            previewGeoJson = (await previewShapeFile({
                file: files[0],
            })) as unknown as turf.FeatureCollection<turf.Point>;
            const centerPoint = turf.center(previewGeoJson as turf.FeatureCollection<turf.Point>);
            methods.setValue('longitude', centerPoint.geometry.coordinates[0]);
            methods.setValue('latitude', centerPoint.geometry.coordinates[1]);
            return;
        }
        methods.setValue('shapefile', undefined);
        setUploadName('');
    };

    if (isLoadingMap) {
        return (
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start" spacing={2}>
                <Grid item xs={12}>
                    <MidScreenLoader />
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid item xs={12}>
                <MetHeader3 bold>Map</MetHeader3>
                <Divider sx={{ marginTop: '1em' }} />
            </Grid>
            <Grid item xs={12}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container direction="row" alignItems="baseline" justifyContent="flex-start" spacing={2}>
                            <Grid item xs={12}>
                                <FileUpload
                                    data-testid="shapefile-upload"
                                    handleAddFile={handleAddFile}
                                    savedFileName={uploadName}
                                    savedFile={methods.getValues('shapefile')}
                                    helpText="Drag and drop a shapefile here or click to select one"
                                />
                            </Grid>
                            <When condition={Boolean(filename)}>
                                <Grid item xs={12}>
                                    <MetLabel sx={{ marginBottom: '2px' }}>File Uploaded </MetLabel>
                                    <MetWidgetPaper elevation={1} sx={{ width: '100%' }}>
                                        <Grid
                                            container
                                            direction="row"
                                            alignItems={'center'}
                                            justifyContent="flex-start"
                                        >
                                            <Grid item xs>
                                                <Stack spacing={2} direction="row" alignItems="center">
                                                    <LinkIcon color="info" />
                                                    <Typography>{mapData?.file_name}</Typography>
                                                </Stack>
                                            </Grid>
                                            <IconButton
                                                onClick={() => {
                                                    methods.setValue('filename', undefined);
                                                    methods.setValue('geojson', undefined);
                                                }}
                                                sx={{ padding: 0, margin: 0 }}
                                                color="inherit"
                                                aria-label="Remove GeoJSON"
                                            >
                                                <HighlightOffIcon />
                                            </IconButton>
                                        </Grid>
                                    </MetWidgetPaper>
                                </Grid>
                            </When>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Latitude</MetLabel>
                                <MetDescription>Latitude in British Columbia is between 48.30 and 60.00</MetDescription>
                                <ControlledTextField
                                    name="latitude"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Longitude</MetLabel>
                                <MetDescription>
                                    Longitude in British Columbia is between  -139.06 and -114.03
                                </MetDescription>
                                <ControlledTextField
                                    name="longitude"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Marker Label</MetLabel>
                                <MetDescription>This text will appear next to your marker on the map</MetDescription>
                                <ControlledTextField
                                    name="markerLabel"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} container direction="row" justifyContent={'flex-end'}>
                                <Grid item>
                                    <SecondaryButton onClick={handlePreviewMap}>Preview Map</SecondaryButton>
                                </Grid>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                container
                                direction="row"
                                spacing={1}
                                justifyContent={'flex-start'}
                                marginTop="2em"
                            >
                                <Grid item>
                                    <PrimaryButton type="submit" loading={isCreating}>{`Save & Close`}</PrimaryButton>
                                </Grid>
                                <Grid item>
                                    <SecondaryButton onClick={() => handleWidgetDrawerOpen(false)}>
                                        Cancel
                                    </SecondaryButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </FormProvider>
            </Grid>
        </Grid>
    );
};

export default Form;
