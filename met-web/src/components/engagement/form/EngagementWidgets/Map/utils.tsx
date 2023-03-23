import { GeoJSON } from 'geojson';

export const geoJSONDecode = (geojson_string: string | undefined) => {
    const geojson: GeoJSON | undefined = geojson_string ? JSON.parse(geojson_string.replace(/\\/g, '')) : undefined;
    return geojson;
};
