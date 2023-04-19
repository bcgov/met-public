import React, { useEffect, useState } from 'react';
import { MetPaper, MetHeader2, MetLabel } from 'components/common';
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
import { geoJSONDecode } from 'components/engagement/form/EngagementWidgets/Map/utils';

interface MapWidgetProps {
    widget: Widget;
}

const MapWidget = ({ widget }: MapWidgetProps) => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [map, setMap] = useState<WidgetMap | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
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
                        <MetHeader2 bold={true}>Map</MetHeader2>
                        <Divider sx={{ borderWidth: 1, marginTop: 0.5 }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Box
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
