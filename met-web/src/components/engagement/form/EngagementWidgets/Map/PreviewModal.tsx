import React, { useContext } from 'react';
import Modal from '@mui/material/Modal';
import { Paper } from '@mui/material';
import { modalStyle } from 'components/common';
import { MapContext } from './MapContext';
import Map from 'components/map';

export const PreviewModal = () => {
    const { previewMapOpen, setPreviewMapOpen } = useContext(MapContext);

    return (
        <Modal
            open={previewMapOpen}
            onClose={() => {
                setPreviewMapOpen(false);
            }}
            keepMounted={false}
        >
            <Paper sx={{ ...modalStyle, padding: 0 }}>
                <Map />
            </Paper>
        </Modal>
    );
};
