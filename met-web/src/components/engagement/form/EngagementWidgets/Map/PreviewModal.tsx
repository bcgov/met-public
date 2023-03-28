import React, { useContext } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Paper } from '@mui/material';
import { modalStyle } from 'components/common';
import { MapContext } from './MapContext';
import MET_Map from 'components/map';

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
                    <MET_Map
                        geojson={previewMap.geojson}
                        longitude={previewMap.longitude}
                        latitude={previewMap.latitude}
                        markerLabel={previewMap.markerLabel}
                    />
                </Box>
            </Paper>
        </Modal>
    );
};
