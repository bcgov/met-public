import React, { useEffect, useState } from 'react';

import { Grid2 as Grid, Skeleton, Paper } from '@mui/material';
import { Widget } from 'models/widget';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { ImageWidget } from 'models/imageWidget';
import { fetchImageWidgets } from 'services/widgetService/ImageService';
import { BodyText, Heading2 } from 'components/common/Typography';

interface ImageWidgetProps {
    widget: Widget;
}

const ImageWidgetView = ({ widget }: ImageWidgetProps) => {
    const dispatch = useAppDispatch();
    const [imageWidget, setImageWidget] = useState<ImageWidget | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchImage = async () => {
        try {
            const images = await fetchImageWidgets(widget.id);
            const image = images[images.length - 1];
            setImageWidget(image);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while fetching widget information',
                }),
            );
        }
    };

    useEffect(() => {
        fetchImage();
    }, [widget]);

    if (isLoading) {
        return (
            <Paper elevation={1} sx={{ padding: '1em' }}>
                <Grid container justifyContent="flex-start" spacing={3}>
                    <Grid size={12}>
                        <Heading2>
                            <Skeleton variant="rectangular" />
                        </Heading2>
                    </Grid>
                    <Grid size={12}>
                        <Skeleton variant="rectangular" height="20em" />
                    </Grid>
                </Grid>
            </Paper>
        );
    }

    if (!imageWidget) {
        return null;
    }

    return (
        <Grid container size={12} alignItems="center" rowSpacing={2}>
            <Grid
                container
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                flexDirection={'column'}
                size={12}
                paddingBottom={0}
            >
                <Heading2>{widget.title}</Heading2>
            </Grid>
            <Grid size={12}>
                <BodyText>{imageWidget.description}</BodyText>
            </Grid>
            <Grid
                container
                size={12}
                maxWidth="32rem"
                component={Paper}
                elevation={4}
                sx={{ borderRadius: '16px', backgroundClip: 'padding-box' }}
            >
                <img
                    style={{
                        width: '100%',
                        aspectRatio: '3/2',
                        objectFit: 'cover',
                        borderRadius: '16px',
                    }}
                    src={imageWidget.image_url}
                    alt={imageWidget.alt_text}
                />
            </Grid>
        </Grid>
    );
};

export default ImageWidgetView;
