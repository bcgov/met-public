import React, { useEffect, useState, useRef } from 'react';
import { MetPaper, MetHeader2Old, MetLabel } from 'components/common';
import { Grid, Skeleton, Divider, Box, IconButton, Link, useMediaQuery, Theme } from '@mui/material';
import { Widget } from 'models/widget';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import MetMap from 'components/map';
import { fetchMaps } from 'services/widgetService/MapService';
import { WidgetMap } from 'models/widgetMap';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import { ExpandModal } from './ExpandModal';
import { When } from 'react-if';
import { geoJSONDecode, calculateZoomLevel } from 'components/engagement/form/EngagementWidgets/Map/utils';

interface MapWidgetProps {
    widget: Widget;
}

const MapWidget = ({ widget }: MapWidgetProps) => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [map, setMap] = useState<WidgetMap | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const [mapWidth, setMapWidth] = useState(250);
    const [mapHeight, setMapHeight] = useState(250);

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
            <MetPaper elevation={1} sx={{ padding: '1em' }}>
                <Grid container justifyContent="flex-start" spacing={3}>
                    <Grid item xs={12}>
                        <MetHeader2Old>
                            <Skeleton variant="rectangular" />
                        </MetHeader2Old>
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rectangular" height="10em" />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rectangular" height="10em" />
                    </Grid>
                </Grid>
            </MetPaper>
        );
    }

    if (!map) {
        return null;
    }

    return (
        <>
            <MetPaper elevation={1} sx={{ paddingTop: '0.5em', padding: '1em', minHeight: '12em' }}>
                <Grid container justifyContent={{ xs: 'center' }} alignItems="center" rowSpacing={2}>
                    <Grid
                        item
                        container
                        justifyContent={{ xs: 'center', md: 'flex-start' }}
                        flexDirection={'column'}
                        xs={12}
                        paddingBottom={0}
                    >
                        <MetHeader2Old bold>{widget.title}</MetHeader2Old>
                        <Divider sx={{ borderWidth: 1, marginTop: 0.5 }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            ref={mapContainerRef}
                            sx={{
                                width: '100%',
                                height: '370px',
                            }}
                        >
                            <MetMap
                                geojson={geoJSONDecode(map.geojson)}
                                longitude={map.longitude}
                                latitude={map.latitude}
                                markerLabel={map.marker_label}
                                zoom={calculateZoomLevel(mapWidth, mapHeight, geoJSONDecode(map.geojson))}
                            />
                        </Box>
                    </Grid>
                    <When condition={isLargeScreen}>
                        <Grid container item xs={12} alignItems={'center'} justifyContent={'flex-start'}>
                            <Grid item>
                                <IconButton onClick={() => setOpen(true)}>
                                    <OpenWithIcon />
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <Link onClick={() => setOpen(true)} component={MetLabel} sx={{ cursor: 'pointer' }}>
                                    View Expanded Map
                                </Link>
                            </Grid>
                        </Grid>
                        <ExpandModal map={map} open={open} setOpen={setOpen} />
                    </When>
                </Grid>
            </MetPaper>
        </>
    );
};

export default MapWidget;
