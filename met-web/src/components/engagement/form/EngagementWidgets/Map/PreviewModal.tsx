import React, { useContext } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Paper } from '@mui/material';
import { modalStyle } from 'components/common';
import { MapContext } from './MapContext';
import MetMap from 'components/map';

export const PreviewModal = () => {
    const { previewMapOpen, setPreviewMapOpen, previewMap, zoomLevel, mapHeight, mapWidth } = useContext(MapContext);

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
                    sx={{
                        width: `${mapWidth}px`,
                        height: `${mapHeight}px`,
                    }}
                >
                    <MetMap
                        geojson={previewMap.geojson}
                        longitude={previewMap.longitude}
                        latitude={previewMap.latitude}
                        markerLabel={previewMap.markerLabel}
                        zoom={zoomLevel}
                    />
                </Box>
            </Paper>
        </Modal>
    );
};
