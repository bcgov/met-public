import React, { useContext } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Paper } from '@mui/material';
import { modalStyle } from 'components/common';
import { MapContext } from './MapContext';
import Map from 'components/map';

export const PreviewModal = () => {
    const { previewMapOpen, setPreviewMapOpen, previewMap } = useContext(MapContext);

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
                        width: '500px',
                        height: '500px',
                    }}
                >
                    <Map
                        geojson={previewMap.geojson}
                        longitude={previewMap.longitude ? previewMap.longitude : undefined}
                        latitude={previewMap.latitude ? previewMap.latitude : undefined}
                        markerLabel={previewMap.markerLabel}
                    />
                </Box>
            </Paper>
        </Modal>
    );
};
