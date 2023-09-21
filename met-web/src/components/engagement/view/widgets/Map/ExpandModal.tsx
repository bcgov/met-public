import React, { useRef, useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Paper, Grid } from '@mui/material';
import MetMap from 'components/map';
import { WidgetMap } from 'models/widgetMap';
import { PrimaryButton } from 'components/common';
import { geoJSONDecode, calculateZoomLevel } from 'components/engagement/form/EngagementWidgets/Map/utils';

interface ExpandModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    map: WidgetMap | null;
}

export const ExpandModal = ({ open, setOpen, map }: ExpandModalProps) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [mapWidth, setMapWidth] = useState(250);
    const [mapHeight, setMapHeight] = useState(250);

    useEffect(() => {
        if (mapContainerRef.current) {
            setMapWidth(mapContainerRef.current.clientWidth);
            setMapHeight(mapContainerRef.current.clientHeight);
        }
    }, []);

    if (!map) {
        return null;
    }

    return (
        <Modal
            open={open}
            onClose={() => {
                setOpen(false);
            }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            keepMounted={false}
        >
            <Paper>
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    sx={{
                        width: '80vw',
                        height: '75vh',
                    }}
                >
                    <Grid item>
                        <Box
                            ref={mapContainerRef}
                            sx={{
                                width: '80vw',
                                height: '65vh',
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
                    <Grid item xs={12} container justifyContent="flex-end" padding={2}>
                        <Grid item>
                            <PrimaryButton
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                Close
                            </PrimaryButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Modal>
    );
};
