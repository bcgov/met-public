import React from 'react';
import Form from './Form';
import { MapProvider } from './MapContext';
import { PreviewModal } from './PreviewModal';

export const MapForm = () => {
    return (
        <MapProvider>
            <Form />
            <PreviewModal />
        </MapProvider>
    );
};

export default MapForm;
