import React from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { Box } from '@mui/material';

const Map = () => {
    const pinLocation = {
        latitude: 37.7577,
        longitude: -122.4376,
    };

    return (
        <Box
            sx={{
                border: 'red 10px',
                width: '500px',
                height: '500px',
            }}
        >
            <ReactMapGL
                initialViewState={{
                    longitude: pinLocation.longitude,
                    latitude: pinLocation.latitude,
                    zoom: 12,
                }}
                mapLib={maplibregl}
                // mapStyle="https://api.maptiler.com/maps/basic-v2/style.json?key=IE2yWwcY3JTfcbqVxNOV"
                mapStyle="https://governmentofbc.maps.arcgis.com/sharing/rest/content/items/bbe05270d3a642f5b62203d6c454f457/resources/styles/root.json"
                style={{
                    width: '100%',
                    height: '100%',
                }}
            >
                <Marker latitude={pinLocation.latitude} longitude={pinLocation.longitude} color="red"></Marker>
            </ReactMapGL>
        </Box>
    );
};
export default Map;
