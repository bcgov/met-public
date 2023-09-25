import { GeoJSON } from 'geojson';
import * as turf from '@turf/turf';

export interface PreviewMap {
    longitude: number;
    latitude: number;
    markerLabel?: string;
    geojson?: GeoJSON;
}

export type GeoJSONInput = turf.AllGeoJSON | GeoJSON | undefined | string;
