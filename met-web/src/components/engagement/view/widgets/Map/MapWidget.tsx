import React, { useEffect, useState } from 'react';
import { MetPaper, MetHeader2 } from 'components/common';
import { Grid, Skeleton, Divider, Box, IconButton, Link } from '@mui/material';
import { Widget } from 'models/widget';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import Map from 'components/map';
import { fetchMaps } from 'services/widgetService/MapService';
import { WidgetMap } from 'models/widgetMap';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import { ExpandModal } from './ExpandModal';

interface MapWidgetProps {
    widget: Widget;
}

const MapWidget = ({ widget }: MapWidgetProps) => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [map, setMap] = useState<WidgetMap | null>(null);
    const [open, setOpen] = useState<boolean>(false);
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

    return (
        <MetPaper elevation={1} sx={{ paddingTop: '0.5em', padding: '1em', minHeight: '12em' }}>
            <ExpandModal map={map} open={open} setOpen={setOpen} />
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
            <Grid container item columnSpacing={2} rowSpacing={1} xs={12} paddingTop={2} paddingBottom={2}>
                <Box
                    sx={{
                        width: '100%',
                        height: '500px',
                    }}
                >
                    <Map longitude={map?.longitude || 0} latitude={map?.latitude || 0} />
                </Box>
            </Grid>
            <Grid container item alignItems={'center'} justifyContent={'flex-start'}>
                <Grid item>
                    <IconButton onClick={() => setOpen(true)}>
                        <OpenWithIcon />
                    </IconButton>
                </Grid>
                <Grid item>
                    <Link onClick={() => setOpen(true)} component={'button'}>
                        View Expanded Map
                    </Link>
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default MapWidget;
