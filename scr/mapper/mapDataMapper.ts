import { Feature, FeatureCollection, Point } from 'geojson';

export function mapParadasToGeoJson(paradas: any[]) {
    if (!Array.isArray(paradas) || paradas.length === 0) {
        console.warn('No se encontraron paradas para mapear.');
        return null;
    }

    return {
        type: 'FeatureCollection',
        features: paradas.map(parada => ({
            type: 'Feature',
            properties: {}, // Añadir propiedades si es necesario
            geometry: {
                type: 'Point',
                coordinates: [parada.lng, parada.lat],
            }
        }))
    };
}

export const mapZonaPuntosToGeoJson = (zona_puntos: any[]): FeatureCollection<Point> | null => {
    if (!Array.isArray(zona_puntos) || zona_puntos.length === 0) {
        console.warn('No se encontraron zona_puntos válidos.');
        return null;
    }

    return {
        type: 'FeatureCollection',
        features: zona_puntos
            .map((point) => {
                if (point.lat === undefined || point.lng === undefined) {
                    console.warn('Punto inválido encontrado:', point);
                    return null;
                }
                return {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: [point.lng, point.lat],
                    },
                } as Feature<Point>;
            })
            .filter((feature) => feature !== null) as Feature<Point>[],
    };
};



