import { GeoJSON } from 'geojson';
import * as turf from '@turf/turf';

export const calculateZoomLevel = (mapWidth: number, mapHeight: number, geojson?: GeoJSON) => {
    const ZOOM_MAX = 21;

    if (geojson) {
        const bbox = turf.bbox(geojson);

        const latDiff = bbox[3] - bbox[1];
        const lngDiff = bbox[2] - bbox[0];

        const mapAspect = mapWidth / mapHeight;
        const bboxAspect = lngDiff / latDiff;

        let zoom;

        if (mapAspect > bboxAspect) {
            // limited by height, use latitude
            const verticalScale = mapHeight / latDiff;
            zoom = Math.log2(verticalScale) - 1; // -1 is a correction factor to prevent overshooting
        } else {
            // limited by width, use longitude
            const horizontalScale = mapWidth / lngDiff;
            zoom = Math.log2(horizontalScale) - 1; // -1 is a correction factor to prevent overshooting
        }

        zoom = Math.min(zoom, ZOOM_MAX);
        zoom = Math.max(zoom, 0);

        return zoom;
    }

    return 12;
};

export const geoJSONDecode = (geojson_string?: string) => {
    const geojson: GeoJSON = geojson_string ? JSON.parse(geojson_string.replace(/\\/g, '')) : undefined;
    return geojson;
};
