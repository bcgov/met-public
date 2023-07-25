import React, { useEffect, useState } from 'react';
import { MetPaper, MetHeader2, MetParagraph, AspectRatioContainer, ReactPlayerWrapper } from 'components/common';
import { Grid, Skeleton, Divider } from '@mui/material';
import { Widget } from 'models/widget';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { VideoWidget } from 'models/videoWidget';
import { fetchVideoWidgets } from 'services/widgetService/VideoService';

interface VideoWidgetProps {
    widget: Widget;
}

const VideoWidgetView = ({ widget }: VideoWidgetProps) => {
    const dispatch = useAppDispatch();
    const [videoWidget, setVideoWidget] = useState<VideoWidget | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const playerConfig = {
        youtube: {
            playerVars: {
                origin: window.location.origin,
            },
        },
    };

    const fetchVideo = async () => {
        try {
            const videos = await fetchVideoWidgets(widget.id);
            const video = videos[videos.length - 1];
            setVideoWidget(video);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while fetching Engagement widgets information',
                }),
            );
        }
    };

    useEffect(() => {
        fetchVideo();
    }, [widget]);

    if (isLoading) {
        return (
            <MetPaper elevation={1} sx={{ padding: '1em' }}>
                <Grid container justifyContent="flex-start" spacing={3}>
                    <Grid item xs={12}>
                        <MetHeader2>
                            <Skeleton variant="rectangular" />
                        </MetHeader2>
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rectangular" height="20em" />
                    </Grid>
                </Grid>
            </MetPaper>
        );
    }

    if (!videoWidget) {
        return null;
    }

    return (
        <>
            <MetPaper elevation={1} sx={{ paddingTop: '0.5em', padding: '1em' }}>
                <Grid container justifyContent={{ xs: 'center' }} alignItems="center" rowSpacing={2}>
                    <Grid
                        item
                        container
                        justifyContent={{ xs: 'center', md: 'flex-start' }}
                        flexDirection={'column'}
                        xs={12}
                        paddingBottom={0}
                    >
                        <MetHeader2 bold>Video</MetHeader2>
                        <Divider sx={{ borderWidth: 1, marginTop: 0.5 }} />
                    </Grid>
                    <Grid item xs={12}>
                        <MetParagraph>{videoWidget.description}</MetParagraph>
                    </Grid>
                    <Grid item xs={12}>
                        <AspectRatioContainer>
                            <ReactPlayerWrapper
                                url={videoWidget.video_url}
                                controls
                                width="100%"
                                height={'100%'}
                                config={playerConfig}
                                light
                            />
                        </AspectRatioContainer>
                    </Grid>
                </Grid>
            </MetPaper>
        </>
    );
};

export default VideoWidgetView;
