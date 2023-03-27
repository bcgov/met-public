import { GeoJSON } from 'geojson';
export interface PreviewMap {
    longitude?: number;
    latitude?: number;
    markerLabel?: string;
    geojson?: GeoJSON;
}
