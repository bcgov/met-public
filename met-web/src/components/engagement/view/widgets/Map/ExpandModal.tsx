import React from 'react';
import Modal from '@mui/material/Modal';
import { Box, Paper, Button } from '@mui/material';
import Map from 'components/map';
import { WidgetMap } from 'models/widgetMap';

interface ExpandModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    map: WidgetMap;
}

export const ExpandModal = ({ open, setOpen, map }: ExpandModalProps) => {
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
            <Paper
                sx={{
                    width: '80vw',
                    height: '80vh',
                }}
            >
                <Box
                    sx={{
                        width: '80vw',
                        height: '70vh',
                    }}
                >
                    <Map longitude={map?.longitude || 0} latitude={map?.latitude || 0} />
                </Box>
                <Button
                    onClick={() => {
                        setOpen(false);
                    }}
                >
                    Close
                </Button>
            </Paper>
        </Modal>
    );
};
