import React from 'react';
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
// import MarkerIcon from '@mui/icons-material/Room';
import MarkerIcon from '@mui/icons-material/LocationOnRounded';
import { MetSmallText } from 'components/common';
import { Stack } from '@mui/material';
import { When } from 'react-if';

interface MapProps {
    latitude: number;
    longitude: number;
    markerLabel?: string;
}
const Map = ({ latitude, longitude, markerLabel }: MapProps) => {
    return (
        <ReactMapGL
            initialViewState={{
                longitude: longitude,
                latitude: latitude,
                zoom: 12,
            }}
            mapLib={maplibregl}
            mapStyle="https://governmentofbc.maps.arcgis.com/sharing/rest/content/items/bbe05270d3a642f5b62203d6c454f457/resources/styles/root.json"
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <NavigationControl />
            <Marker latitude={latitude} longitude={longitude} anchor="bottom">
                <Stack direction="column" alignItems="center" justifyContent="center">
                    <MarkerIcon fontSize="large" htmlColor="red" />
                    <When condition={Boolean(markerLabel)}>
                        <MetSmallText bold bgcolor={'white'} borderRadius="10px" padding="0 2px 0 2px">
                            {markerLabel}
                        </MetSmallText>
                    </When>
                </Stack>
            </Marker>
        </ReactMapGL>
    );
};
export default Map;
