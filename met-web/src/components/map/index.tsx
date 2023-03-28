import React from 'react';
import ReactMapGL, { Marker, NavigationControl, Source, Layer } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { GeoJSON } from 'geojson';
import MarkerIcon from '@mui/icons-material/LocationOnRounded';
import { MetSmallText } from 'components/common';
import { Stack } from '@mui/material';
import { When } from 'react-if';
import { AnyLayer } from 'mapbox-gl';

interface MapProps {
    latitude: number;
    longitude: number;
    markerLabel?: string;
    geojson?: GeoJSON;
}

const layerStyle: AnyLayer = {
    id: 'fill-layer',
    type: 'fill',
    paint: {
        'fill-color': '#00ffff',
        'fill-opacity': 0.5,
    },
};

const MetMap = ({ geojson, latitude, longitude, markerLabel }: MapProps) => {
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
            <When condition={Boolean(geojson)}>
                <Source id="geojson-data" type="geojson" data={geojson}>
                    <Layer {...layerStyle} />
                </Source>
            </When>
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
export default MetMap;
