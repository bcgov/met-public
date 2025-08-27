import React, { useEffect, useState, useRef } from 'react';
import { MetHeader3 } from 'components/common';
import { Grid, Skeleton, Box, useMediaQuery, Theme, useTheme } from '@mui/material';
import { Widget } from 'models/widget';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import MetMap from 'components/map';
import { fetchMaps } from 'services/widgetService/MapService';
import { WidgetMap } from 'models/widgetMap';
import { ExpandModal } from './ExpandModal';
import { When } from 'react-if';
import { geoJSONDecode, calculateZoomLevel } from 'components/engagement/form/EngagementWidgets/Map/utils';
import { Link } from 'components/common/Navigation';
import { faExpand } from '@fortawesome/pro-solid-svg-icons/faExpand';
import { Header2 } from 'components/common/Typography';
import { colors, Palette } from 'styles/Theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface MapWidgetProps {
    widget: Widget;
}

const MapWidget = ({ widget }: MapWidgetProps) => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [map, setMap] = useState<WidgetMap | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const [mapWidth, setMapWidth] = useState(250);
    const [mapHeight, setMapHeight] = useState(250);

    const theme = useTheme();
    const isDarkMode = 'dark' === theme.palette.mode;

    const fetchMap = async () => {
        try {
            const map = await fetchMaps(widget.id);
            setMap(map[map.length - 1]);
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
        fetchMap();
        if (mapContainerRef.current) {
            setMapWidth(mapContainerRef.current.clientWidth);
            setMapHeight(mapContainerRef.current.clientHeight);
        }
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
                    <Skeleton variant="rectangular" height="10em" />
                </Grid>
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" height="10em" />
                </Grid>
            </Grid>
        );
    }

    if (!map) {
        return null;
    }

    // Define the styles
    const metHeader3Styles = {
        fontWeight: 'lighter',
        fontSize: '1.5rem',
        marginBottom: '2.5rem',
        marginTop: '4rem',
        color: isDarkMode ? colors.surface.white : Palette.text.primary,
    };
    const outerContainerStyles = {
        position: 'relative',
        width: '100%',
        paddingTop: '66.67%' /* 3:2 aspect ratio (height / width * 100) */,
    };
    const innerContainerStyles = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
    };
    const linkStyles = {
        color: isDarkMode ? colors.surface.white : Palette.text.primary,
        textDecorationColor: isDarkMode ? colors.surface.white : Palette.text.primary,
        cursor: 'pointer',
    };

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
                <MetHeader3 style={metHeader3Styles}>{widget.title}</MetHeader3>
            </Grid>
            <Grid item xs={12}>
                <Box sx={outerContainerStyles}>
                    <Box sx={innerContainerStyles}>
                        <MetMap
                            geojson={geoJSONDecode(map.geojson)}
                            longitude={map.longitude}
                            latitude={map.latitude}
                            markerLabel={map.marker_label}
                            zoom={calculateZoomLevel(mapWidth, mapHeight, geoJSONDecode(map.geojson))}
                        />
                    </Box>
                </Box>
            </Grid>
            <When condition={isMediumScreen}>
                <Grid container item xs={12} alignItems={'center'} justifyContent={'flex-start'}>
                    <Link onClick={() => setOpen(true)} sx={linkStyles} tabIndex={0} onKeyDown={() => setOpen(true)}>
                        <FontAwesomeIcon
                            icon={faExpand}
                            style={{ color: isDarkMode ? colors.surface.white : Palette.text.primary }}
                        />
                        <span style={{ paddingLeft: '0.5rem' }}>View Expanded Map</span>
                    </Link>
                </Grid>
                <ExpandModal map={map} open={open} setOpen={setOpen} />
            </When>
        </Grid>
    );
};

export default MapWidget;
