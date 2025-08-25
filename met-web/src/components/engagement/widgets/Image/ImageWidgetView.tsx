import React, { useEffect, useState } from 'react';
import { MetPaper } from 'components/common';
import { Grid, Skeleton, Paper } from '@mui/material';
import { Widget } from 'models/widget';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { ImageWidget } from 'models/imageWidget';
import { fetchImageWidgets } from 'services/widgetService/ImageService';
import { BodyText, Header2 } from 'components/common/Typography';

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
            <MetPaper elevation={1} sx={{ padding: '1em' }}>
                <Grid container justifyContent="flex-start" spacing={3}>
                    <Grid item xs={12}>
                        <Header2>
                            <Skeleton variant="rectangular" />
                        </Header2>
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rectangular" height="20em" />
                    </Grid>
                </Grid>
            </MetPaper>
        );
    }

    if (!imageWidget) {
        return null;
    }

    return (
        <Grid container justifyContent={{ xs: 'center' }} alignItems="center" rowSpacing={2}>
            <Grid
                item
                container
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                flexDirection={'column'}
                xs={12}
                paddingBottom={0}
            >
                <Header2 sx={{ margin: '4rem 0 0 0' }}>{widget.title}</Header2>
            </Grid>
            <Grid item xs={12}>
                <BodyText>{imageWidget.description}</BodyText>
            </Grid>
            <Grid item xs={12}>
                <Paper
                    elevation={4}
                    sx={{
                        width: '100%',
                        aspectRatio: '3/2',
                        position: 'relative',
                        borderRadius: '16px',
                        backgroundClip: 'padding-box',
                    }}
                >
                    <img
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            aspectRatio: '3/2',
                            objectFit: 'cover',
                            borderRadius: '16px',
                        }}
                        src={imageWidget.image_url}
                        alt={imageWidget.alt_text}
                    />
                </Paper>
            </Grid>
        </Grid>
    );
};

export default ImageWidgetView;
