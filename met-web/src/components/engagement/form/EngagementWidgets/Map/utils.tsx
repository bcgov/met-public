import { GeoJSON } from 'geojson';

export const geoJSONDecode = (geojson_string?: string) => {
    const geojson: GeoJSON = geojson_string ? JSON.parse(geojson_string.replace(/\\/g, '')) : undefined;
    return geojson;
};
