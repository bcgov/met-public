import React, { useContext, useState } from 'react';
import Divider from '@mui/material/Divider';
import { Grid } from '@mui/material';
import { MetHeader3, MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch } from 'hooks';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { openNotification } from 'services/notificationService/notificationSlice';
import { MapContext } from './MapContext';
import { postMap } from 'services/widgetService/MapService';
import { WidgetDrawerContext } from '../WidgetDrawerContext';

const schema = yup
    .object({
        description: yup.string().max(500, 'Description cannot exceed 500 characters'),
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
    })
    .required();

type DetailsForm = yup.TypeOf<typeof schema>;

const Form = () => {
    const dispatch = useAppDispatch();
    const { widget } = useContext(MapContext);
    const { handleWidgetDrawerOpen } = useContext(WidgetDrawerContext);
    const [isCreating, setIsCreating] = useState(false);

    const methods = useForm<DetailsForm>({
        resolver: yupResolver(schema),
    });

    const { handleSubmit, reset, trigger } = methods;

    const createMap = async (data: DetailsForm) => {
        if (!widget) {
            return;
        }

        const validatedData = await schema.validate(data);
        const { latitude, longitude, description } = validatedData;
        await postMap(widget.id, {
            widget_id: widget.id,
            description,
            longitude,
            latitude,
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
        await trigger(['latitude', 'longitude']);
    };

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
                                <MetLabel sx={{ marginBottom: '2px' }}>Latitude</MetLabel>
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
                            <Grid item xs={12} container direction="row" justifyContent={'flex-end'}>
                                <Grid item>
                                    <SecondaryButton onClick={handlePreviewMap}>Preview Map</SecondaryButton>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <MetLabel sx={{ marginBottom: '2px' }}>Description</MetLabel>
                                <ControlledTextField
                                    name="description"
                                    variant="outlined"
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    fullWidth
                                    size="small"
                                    multiline
                                    minRows={4}
                                />
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
