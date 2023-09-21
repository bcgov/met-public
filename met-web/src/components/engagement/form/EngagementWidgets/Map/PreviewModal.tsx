import React, { useContext, useRef } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Paper } from '@mui/material';
import { modalStyle } from 'components/common';
import { MapContext } from './MapContext';
import MetMap from 'components/map';
import { calculateZoomLevel } from 'components/engagement/form/EngagementWidgets/Map/utils';

export const PreviewModal = () => {
    const { previewMapOpen, setPreviewMapOpen, previewMap } = useContext(MapContext);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapWidth = 500;
    const mapHeight = 500;

    if (!previewMap) {
        return null;
    }

    return (
        <Modal
            open={previewMapOpen}
            onClose={() => {
                setPreviewMapOpen(false);
            }}
            keepMounted={false}
        >
            <Paper sx={{ ...modalStyle, padding: '1px' }}>
                <Box
                    ref={mapContainerRef}
                    sx={{
                        width: '500px',
                        height: '500px',
                    }}
                >
                    <MetMap
                        geojson={previewMap.geojson}
                        longitude={previewMap.longitude}
                        latitude={previewMap.latitude}
                        markerLabel={previewMap.markerLabel}
                        zoom={calculateZoomLevel(mapWidth, mapHeight, previewMap.geojson)}
                    />
                </Box>
            </Paper>
        </Modal>
    );
};
