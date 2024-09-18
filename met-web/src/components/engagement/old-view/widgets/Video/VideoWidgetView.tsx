import React, { useEffect, useState } from 'react';
import { AspectRatioContainer, colors, MetHeader3 } from 'components/common';
import { Box, Grid, Skeleton, useTheme } from '@mui/material';
import { Widget } from 'models/widget';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { VideoWidget } from 'models/videoWidget';
import { fetchVideoWidgets } from 'services/widgetService/VideoService';
import { BodyText, Header2 } from 'components/common/Typography';
import ReactPlayer from 'react-player';
import { When } from 'react-if';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faVimeo,
    faYoutube,
    faSoundcloud,
    faFacebookF,
    faTwitch,
    faMixcloud,
    faDailymotion,
} from '@fortawesome/free-brands-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Palette } from 'styles/Theme';

interface VideoWidgetProps {
    widget: Widget;
}

const VideoWidgetView = ({ widget }: VideoWidgetProps) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const isDarkMode = 'dark' === theme.palette.mode;

    const [videoWidget, setVideoWidget] = useState<VideoWidget | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [videoDuration, setVideoDuration] = useState('');
    const [showOverlay, setShowOverlay] = useState(true);
    const [videoOverlayTitle, setVideoOverlayTitle] = useState('');

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

    const formatVideoDuration = (duration: number) => {
        let minutes = 0;
        let hours = 0;
        let seconds = 0;
        if (3600 < duration) {
            hours = Math.floor(duration / 3600);
            minutes = Math.floor((duration - hours * 3600) / 60);
            seconds = Math.floor(duration - hours * 3600 - minutes * 60);
            return `${hours} hr ${minutes} min ${seconds} sec`;
        } else if (3600 > duration && 60 < duration) {
            minutes = Math.floor(duration / 60);
            seconds = Math.floor(duration - minutes * 60);
            return `${minutes} min ${seconds} sec`;
        } else if (60 > duration && 0 < duration) {
            return `${seconds} seconds`;
        } else {
            return '';
        }
    };

    const getVideoSource = (url: string) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return 'YouTube';
        } else if (url.includes('vimeo.com')) {
            return 'Vimeo';
        } else if (url.includes('facebook.com')) {
            return 'Facebook';
        } else if (url.includes('twitch.tv')) {
            return 'Twitch';
        } else if (url.includes('soundcloud.com')) {
            return 'SoundCloud';
        } else if (url.includes('mixcloud.com')) {
            return 'Mixcloud';
        } else if (url.includes('dailymotion.com')) {
            return 'DailyMotion';
        } else {
            return 'Unknown';
        }
    };

    const getVideoTitle = (player: ReactPlayer, source: string, widgetTitle: string) => {
        if ('YouTube' === source) {
            return `${player.getInternalPlayer().videoTitle} (${source} video)`;
        } else if ('Vimeo' === source) {
            return `${player.getInternalPlayer().element.title} (${source} video)`;
        } else if ('Facebook' === source || 'Twitch' === source || 'DailyMotion' === source) {
            return `${widgetTitle} (${source} video)`; // API doesn't return video title, use widget title.
        } else if ('SoundCloud' === source || 'Mixcloud' === source) {
            return `${widgetTitle} (${source} audio)`; // API doesn't return audio title, use widget title.
        } else {
            return `${widgetTitle} (video)`;
        }
    };

    useEffect(() => {
        fetchVideo();
    }, [widget]);

    if (isLoading) {
        return (
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
        );
    }

    if (!videoWidget) {
        return null;
    }

    return (
        <Grid container justifyContent={{ xs: 'center' }} alignItems="center" rowSpacing={2}>
            <Grid item xs={12} sx={{ height: 0 === videoWidget.title.length ? '0px' : 'auto' }}>
                <MetHeader3
                    style={{
                        fontWeight: 'lighter',
                        fontSize: '1.5rem',
                        marginBottom: '0.2rem',
                        marginTop: '3.3rem',
                        color: isDarkMode ? colors.surface.white : Palette.text.primary,
                    }}
                >
                    {videoWidget.title}
                </MetHeader3>
            </Grid>
            <Grid item xs={12}>
                <BodyText
                    style={{ marginBottom: '2.5rem', color: isDarkMode ? colors.surface.white : Palette.text.primary }}
                >
                    {videoWidget.description}
                </BodyText>
            </Grid>
            {/* Overlay covers play button for Mixcloud so it shouldn't be displayed */}
            <When condition={showOverlay && 'Mixcloud' !== getVideoSource(videoWidget.video_url)}>
                <Grid item xs={12} sx={{ maxHeight: '0px', padding: '0 !important', margin: '0' }}>
                    <VideoOverlay
                        videoOverlayTitle={videoOverlayTitle}
                        source={getVideoSource(videoWidget.video_url)}
                    />
                </Grid>
            </When>
            <Grid item xs={12} sx={{ paddingTop: '0 !important', marginTop: '0' }}>
                <AspectRatioContainer style={{ borderRadius: '16px', overflow: 'hidden' }}>
                    <ReactPlayer
                        onDuration={(duration) => {
                            setVideoDuration(formatVideoDuration(duration));
                        }}
                        url={videoWidget.video_url}
                        controls
                        onReady={(player) => {
                            const videoSource = getVideoSource(videoWidget.video_url);
                            setVideoOverlayTitle(getVideoTitle(player, videoSource, videoWidget.title));
                        }}
                        onPlay={() => setShowOverlay(false)}
                        width="100%"
                        height={'100%'}
                        config={playerConfig}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                        }}
                    />
                </AspectRatioContainer>
            </Grid>
            <Grid item xs={12} sx={{ pt: '0.5rem !important' }}>
                <BodyText
                    style={{ fontSize: '0.95rem', color: isDarkMode ? colors.surface.white : Palette.text.primary }}
                >
                    {videoDuration}
                </BodyText>
            </Grid>
        </Grid>
    );
};

interface VideoOverlayProps {
    videoOverlayTitle: string;
    source: string;
}

const VideoOverlay = ({ videoOverlayTitle, source }: VideoOverlayProps) => {
    const getIcon = (source: string) => {
        if ('YouTube' === source) {
            return faYoutube;
        } else if ('Vimeo' === source) {
            return faVimeo;
        } else if ('Facebook' === source) {
            return faFacebookF;
        } else if ('Twitch' === source) {
            return faTwitch;
        } else if ('SoundCloud' === source) {
            return faSoundcloud;
        } else if ('Mixcloud' === source) {
            return faMixcloud;
        } else if ('DailyMotion' === source) {
            return faDailymotion;
        } else {
            return faQuestionCircle;
        }
    };
    return (
        <Box
            sx={{
                display: 'flex',
                height: '3.8rem',
                background: 'black',
                width: '100%',
                borderRadius: '16px 16px 0 0',
                position: 'relative',
                top: '0',
                zIndex: '10000',
                alignItems: 'center',
                padding: '1rem',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                }}
            >
                <FontAwesomeIcon
                    icon={getIcon(source)}
                    style={{ fontSize: '1.9rem', paddingRight: '0.65rem', color: '#FCBA19' }}
                />{' '}
                <span style={{ fontSize: '0.95rem' }}>{videoOverlayTitle}</span>
            </div>
        </Box>
    );
};

export default VideoWidgetView;
