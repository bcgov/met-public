import React from 'react';
import ReactMapGL, { Marker, NavigationControl, Source, Layer, MapLib } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { GeoJSON } from 'geojson';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/pro-solid-svg-icons/faLocationDot';
import { MetSmallTextOld } from 'components/common';
import { Stack } from '@mui/material';
import { When } from 'react-if';
import mapboxgl, { AnyLayer } from 'mapbox-gl';
import { colors, Palette } from 'styles/Theme';

interface MapProps {
    latitude: number;
    longitude: number;
    markerLabel?: string;
    geojson?: GeoJSON;
    zoom: number;
}

const layerStyle: AnyLayer = {
    id: 'fill-layer',
    type: 'fill',
    paint: {
        'fill-color': `${Palette.primary.main}`,
        'fill-opacity': 0.5,
    },
    filter: ['all', ['==', ['geometry-type'], 'Polygon']],
};

//filter enforces that only geojson features that are linestrings use this styling
const lineStyle: AnyLayer = {
    id: 'lines',
    type: 'line',
    filter: ['all', ['==', ['geometry-type'], 'LineString'], ['!=', ['get', 'type'], 'platform']],
    layout: {
        'line-join': 'round',
        'line-cap': 'round',
    },
    paint: {
        'line-width': 1,
        'line-color': `${Palette.primary.main}`,
    },
};
export const MAP_STYLE =
    'https://governmentofbc.maps.arcgis.com/sharing/rest/content/items/bbe05270d3a642f5b62203d6c454f457/resources/styles/root.json';

const MetMap = ({ geojson, latitude, longitude, markerLabel, zoom }: MapProps) => {
    return (
        <ReactMapGL
            id="map-gl-container"
            initialViewState={{
                longitude: longitude,
                latitude: latitude,
                zoom: zoom,
            }}
            mapLib={maplibregl as unknown as MapLib<mapboxgl.Map>}
            mapStyle={MAP_STYLE}
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <NavigationControl />
            <When condition={Boolean(geojson)}>
                <Source id="geojson-data" type="geojson" data={geojson}>
                    <Layer {...layerStyle} />
                    <Layer {...lineStyle} />
                </Source>
            </When>
            <Marker latitude={latitude} longitude={longitude} anchor="bottom">
                <Stack direction="column" alignItems="center" justifyContent="center">
                    <FontAwesomeIcon icon={faLocationDot} style={{ fontSize: '22px', color: 'red' }} />
                    <When condition={Boolean(markerLabel)}>
                        <MetSmallTextOld
                            bold
                            bgcolor={'#12508F'}
                            style={{ color: colors.surface.white, padding: '1px 4px' }}
                            borderRadius="10px"
                            padding="0 2px 0 2px"
                        >
                            {markerLabel}
                        </MetSmallTextOld>
                    </When>
                </Stack>
            </Marker>
        </ReactMapGL>
    );
};
export default MetMap;
