import React, { useContext, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import { Grid2 as Grid } from '@mui/material';
import { MidScreenLoader } from 'components/common';
import { BodyText } from 'components/common/Typography/Body';
import { Button } from 'components/common/Input/Button';
import { useForm, FormProvider, SubmitHandler, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch } from 'hooks';
import ControlledTextField from 'components/common/ControlledInputComponents/ControlledTextField';
import { openNotification } from 'services/notificationService/notificationSlice';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { VideoContext } from './VideoContext';
import { patchVideo, postVideo } from 'services/widgetService/VideoService';
import { updatedDiff } from 'deep-object-diff';
import { WidgetTitle } from '../WidgetTitle';
import { WidgetLocation } from 'models/widget';

const schema = yup
    .object({
        videoUrl: yup
            .string()
            .url('Please enter a valid Link')
            .required('Please enter a valid Link')
            .max(255, 'Video link cannot exceed 255 characters'),
        title: yup.string().max(255, 'Video title cannot exceed 255 characters'),
        description: yup.string().max(500, 'Description cannot exceed 500 characters'),
    })
    .required();

type DetailsForm = yup.TypeOf<typeof schema>;

const Form = () => {
    const dispatch = useAppDispatch();
    const { widget, isLoadingVideoWidget, videoWidget } = useContext(VideoContext);
    const { setWidgetDrawerOpen } = useContext(WidgetDrawerContext);
    const [isCreating, setIsCreating] = React.useState(false);

    const methods = useForm<DetailsForm>({
        resolver: yupResolver(schema) as unknown as Resolver<DetailsForm>,
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        if (videoWidget) {
            methods.setValue('description', videoWidget.description);
            methods.setValue('videoUrl', videoWidget.video_url);
        }
    }, [videoWidget]);

    const createVideo = async (data: DetailsForm) => {
        if (!widget) {
            return;
        }

        const validatedData = await schema.validate(data);
        const { videoUrl, description } = validatedData;
        await postVideo(widget.id, {
            widget_id: widget.id,
            engagement_id: widget.engagement_id,
            video_url: videoUrl,
            description: description || '',
            location: widget.location in WidgetLocation ? widget.location : null,
        });
        dispatch(openNotification({ severity: 'success', text: 'A new video was successfully added' }));
    };

    const updateVideo = async (data: DetailsForm) => {
        if (!widget || !videoWidget) {
            return;
        }

        const validatedData = await schema.validate(data);
        const updatedDate = updatedDiff(
            {
                description: videoWidget.description,
                video_url: videoWidget.video_url,
            },
            {
                description: validatedData.description,
                video_url: validatedData.videoUrl,
            },
        );

        if (Object.keys(updatedDate).length === 0) {
            return;
        }

        await patchVideo(widget.id, videoWidget.id, {
            ...updatedDate,
        });
        dispatch(openNotification({ severity: 'success', text: 'The video widget was successfully updated' }));
    };

    const saveVideoWidget = (data: DetailsForm) => {
        if (!videoWidget) {
            return createVideo(data);
        }
        return updateVideo(data);
    };
    const onSubmit: SubmitHandler<DetailsForm> = async (data: DetailsForm) => {
        if (!widget) {
            return;
        }
        try {
            setIsCreating(true);
            await saveVideoWidget(data);
            setIsCreating(false);
            reset({});
            setWidgetDrawerOpen(false);
        } catch {
            dispatch(openNotification({ severity: 'error', text: 'An error occurred while trying to add event' }));
            setIsCreating(false);
        }
    };

    if (isLoadingVideoWidget || !widget) {
        return (
            <Grid container direction="row" alignItems={'flex-start'} justifyContent="flex-start" spacing={2}>
                <Grid size={12}>
                    <MidScreenLoader />
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid size={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
            <Grid size={12}>
                <WidgetTitle widget={widget} />
                <Divider sx={{ marginTop: '0.5em' }} />
            </Grid>
            <Grid size={12}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} aria-label="Video widget form">
                        <Grid
                            container
                            direction="row"
                            alignItems={'flex-start'}
                            justifyContent="flex-start"
                            spacing={2}
                        >
                            <Grid size={12}>
                                <BodyText bold>Description (Optional)</BodyText>
                                <ControlledTextField
                                    name="description"
                                    aria-label="Description: optional."
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                            <Grid size={12}>
                                <BodyText bold>Video Link</BodyText>
                                <BodyText>
                                    The video must be hosted on one of the following platforms: YouTube, Vimeo
                                </BodyText>
                                <ControlledTextField name="videoUrl" aria-label="Video URL: required." />
                            </Grid>
                            <Grid
                                size={12}
                                container
                                direction="row"
                                alignItems={'flex-start'}
                                justifyContent="flex-start"
                                spacing={2}
                                mt={'3em'}
                            >
                                <Grid>
                                    <Button variant="primary" type="submit" disabled={isCreating}>
                                        Save & Close
                                    </Button>
                                </Grid>
                                <Grid>
                                    <Button onClick={() => setWidgetDrawerOpen(false)}>Cancel</Button>
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
