import React from 'react';
import Form from './Form';
import { MapProvider } from './MapContext';

export const MapForm = () => {
    return (
        <MapProvider>
            <Form />
        </MapProvider>
    );
};

export default MapForm;
