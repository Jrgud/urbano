import React from 'react';
import mapboxgl from 'mapbox-gl';

interface MapSettings {
    accessToken: string;
    container: string | null;
    mapCenter: [number, number];
    mapZoom: number;
    navigationControl?: {
        visible: boolean;
        visualizePitch: boolean;
        position: string;
    };
    scaleControl?: {
        visible: boolean;
        maxWidth: number;
        unit: string;
    };
    onMapReady: () => void;
}

interface MarkerVehicle {
    code: string;
    url: string;
}

interface Polygon {
    [key: string]: any;
}

class Map {
    settings: MapSettings;
    navigationControl?: {
        visible: boolean;
        visualizePitch: boolean;
        position: string;
    };
    estyleMap: {
        version: number;
        name: string;
        sprite: string;
        glyphs: string;
        sources: {};
        layers: Array<{ id: string; type: string; paint: { 'background-color': string } }>;
    };
    mapStyles: {
        [key: string]: string;
    };
    markerVehicule: MarkerVehicle[];
    map: mapboxgl.Map;
    dx_polygons: Polygon[];

    constructor(settings: Partial<MapSettings>) {
        this.settings = Object.assign({
            accessToken: 'pk.eyJ1Ijoid2lsLWFwdSIsImEiOiJja2oyM25menQxNDB2MnR0ZHFveGgzZmcyIn0.92hQDorrYHX50YdP_zajZg',
            container: null,
            mapCenter: [-75.107418, -15.199883],
            mapZoom: 14,
            navigationControl: null,
            scaleControl: null,
            onMapReady: () => void 0,
        }, settings);

        this.settings.navigationControl = Object.assign({
            visible: true,
            visualizePitch: true,
            position: 'bottom-left'
        }, this.navigationControl);

        this.settings.scaleControl = {
            visible: true,
            maxWidth: 80,
            unit: 'metric'
        };

        this.estyleMap = {
            version: 8,
            name: 'maprosoft',
            sprite: 'mapbox://sprites/mapbox/streets-v8',
            glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
            sources: {},
            layers: [
                {
                    id: 'background',
                    type: 'background',
                    paint: { 'background-color': '#C0D1E8' }
                }
            ]
        }

        this.mapStyles = {
            v1_day: 'mapbox://styles/mapbox/navigation-day-v1',
            v1_night: 'mapbox://styles/mapbox/navigation-night-v1',
            v9: 'mapbox://styles/mapbox/satellite-v9',
            v11: 'mapbox://styles/mapbox/streets-v11',
            v12: 'mapbox://styles/mapbox/satellite-streets-v12',
        };

        this.markerVehicule = [
            { code: 'apla', url: '../assets/images/vehicleType/apla-icon.png' },
            { code: 'car-gru', url: '../assets/images/vehicleType/car-gru-icon.png' },
            { code: 'CAR', url: '../assets/images/vehicleType/car-fron-icon.png' },
            { code: 'cist', url: '../assets/images/vehicleType/cist-icon.png' },
            { code: 'FRON', url: '../assets/images/vehicleType/exc-icon.png' },
            { code: 'truc', url: '../assets/images/vehicleType/truck-icon.png' },
            { code: 'VOL', url: '../assets/images/vehicleType/volq-icon.png' },
            { code: 'PER', url: '../assets/images/vehicleType/per-icon.png' },
            { code: 'CAGRU', url: '../assets/images/vehicleType/CAGRU_128x128.png' },
            { code: 'CAMIO', url: '../assets/images/vehicleType/camion-icon.png' },
            { code: 'CAMIR', url: '../assets/images/vehicleType/camion-icon.png' },
            { code: 'CISCO', url: '../assets/images/vehicleType/CISAG.png' },
            { code: 'COMBI', url: '../assets/images/vehicleType/mini-combi-icon.png' },
            { code: 'MINBU', url: '../assets/images/vehicleType/mini-combi-icon.png' },
            { code: 'CONTR', url: '../assets/images/vehicleType/controller-icon.png' },
        ];

        this.dx_polygons = [{}];

        this.renderMapBox();
    }

    renderMapBox(): Promise<void> {
        return new Promise((resolve, reject) => {
            const s = this.settings;
            mapboxgl.accessToken = s.accessToken;
            this.map = new mapboxgl.Map({
                container: s.container!,    
                style: 'mapbox://styles/mapbox/streets-v11',
                center: s.mapCenter,
                zoom: s.mapZoom,
                minZoom: 1, // Nivel mínimo de zoom
                maxZoom: 22, // Nivel máximo de zoom
            });

            const sc = s.scaleControl!;
            if (sc.visible) {
                this.map.addControl(new mapboxgl.ScaleControl({
                    maxWidth: sc.maxWidth,
                    // unit: sc.unit
                }));
            }

            const nc = s.navigationControl!;
            if (nc.visible) {
                this.map.addControl(new mapboxgl.NavigationControl({
                    visualizePitch: nc.visualizePitch
                }), nc.position);
            }

            this.map.on('load', () => {
                const proms: Promise<void>[] = [];

                this.markerVehicule.forEach(mvhc => {
                    proms.push(new Promise((resolve, reject) => {
                        this.map.loadImage(mvhc.url, (error, img) => {
                            if (!this.map.hasImage(mvhc.code)) {
                                this.map.addImage(mvhc.code, img);
                                resolve();
                            }
                        });
                    }));
                });

                Promise.all(proms).then(res => {
                    s.onMapReady();
                    resolve();
                });

                this.layerRoute();
                this.configurationHeatmap();
            });
        });
    }

    layerRoute(): void {
        this.map.addSource('source_routes', {
            'type': 'geojson',
            'data': null,
        });
        this.map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'source_routes',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-width': 5,
                'line-color': ['get', 'color'],
            }
        });
    }

    configurationHeatmap(): void {
        this.map.addSource('src_velocidades', {
            type: 'geojson',
            data: null
        });
        this.map.addLayer({
            id: 'lyr_mapa_calor',
            type: 'heatmap',
            source: 'src_velocidades',
            maxzoom: 22,
            paint: {
                'heatmap-weight': {
                    property: 'diff',
                    type: 'exponential',
                    stops: [
                        [1, 0],
                        [62, 1]
                    ]
                },
                'heatmap-intensity': {
                    stops: [
                        [11, 1],
                        [15, 3]
                    ]
                },
                'heatmap-color': [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0,
                    'rgba(236,222,239,0)',
                    0.2,
                    'rgb(208,209,230)',
                    0.3,
                    '#3bb2d0',
                    0.6,
                    '#fbb03b',
                    1.0,
                    '#FF4D4D'
                ],
                'heatmap-radius': {
                    stops: [
                        [11, 15],
                        [15, 20]
                    ]
                },
                'heatmap-opacity': {
                    default: 1,
                    stops: [
                        [16.9, 1],
                        [17, 0]
                    ]
                }
            }
        });
        this.map.addLayer({
            id: 'lyr_velocidades',
            type: 'circle',
            source: 'src_velocidades',
            minzoom: 17,
            paint: {
                'circle-radius': {
                    'base': 2.75,
                    'stops': [
                        [12, 2],
                        [22, 180]
                    ]
                },
                'circle-color': {
                    property: 'diff',
                    type: 'exponential',
                    stops: [
                        [0, '#3bb2d0'],
                        [10, '#fbb03b'],
                        [15, '#FF4D4D']
                    ]
                },
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': {
                    stops: [
                        [16.9, 0],
                        [17, 1]
                    ]
                }
            }
        });
    }

    set setRoutes(data: any) {
        let secundarios = data;
        let dataGeoReferencia: any[] = [];
        for (let j = 0, rl = secundarios.length; j < rl; j++) {
            const ruta = secundarios[j];
            const latlngs = ruta.coordenadas;
            for (let i = 0, l = latlngs.length; i < l; i++) {
                if (i === latlngs.length - 1) break;
                const [xA, yA, zA] = [latlngs[i].lat, latlngs[i].lng, latlngs[i].elevacion];
                const [xB, yB, zB] = [latlngs[i + 1].lat, latlngs[i + 1].lng, latlngs[i + 1].elevacion];
                const latlngA: [number, number] = [yA, xA];
                const latlngB: [number, number] = [yB, xB];

                const distancia = this.fnDistance(latlngA, latlngB);
                const diffAltura = zA - zB;
                const pendiente = Math.atan2(diffAltura, distancia) * 180 / Math.PI;
                const color = '#ffff';

                dataGeoReferencia.push(this.convertidorGeoJson([latlngA, latlngB], 'LineString', color, secundarios.areaColor, ruta, 0, i));
            }
        }

        if (Boolean(this.map.getSource('source_routes'))) {
            this.map.getSource('source_routes').setData({
                'type': 'FeatureCollection',
                'features': dataGeoReferencia
            });
        }
    }

    set setHeatMap(v: any) {
        if (Boolean(this.map.getSource('src_velocidades'))) {
            this.map.getSource('src_velocidades').setData({
                'type': 'FeatureCollection',
                'features': v
            });
        }
    }

    convertidorGeoJson(coords: any, tipo: string, color: string, colorPerimetro: any, ruta: any, pendiente: any, seccion: any) {
        return {
            'type': 'Feature',
            'properties': {
                'color': `${color}`,
                'description': ``
            },
            'geometry': {
                'type': tipo,
                'coordinates': coords
            }
        }
    }

    addLayer(options: any) {
        const o = Object.assign({
            layerType: '',
            name: new Date().getTime(),
            data: null,
            layerOptions: null
        }, options);

        this.map.addSource('src-' + o.name, {
            type: 'geojson',
            data: o.data
        });

        switch (o.entityType) {
            case MapUtil.LayerType.Places:
                const pl = Object.assign({
                    colorExpr: '',
                    textExpr: '',
                }, o.layerOptions);
                this.map.addLayer({
                    'id': 'lyr-' + o.name,
                    'type': 'fill',
                    'source': 'src-' + o.name,
                    'layout': {
                        'visibility': 'visible',
                    },
                    'paint': {
                        'fill-color': ['get', pl.colorExpr],
                        'fill-opacity': ['get', 'opacity'],
                    }
                });

                this.map.addLayer({
                    'id': 'lyr-' + o.name + 'outline',
                    'type': 'line',
                    'source': 'src-' + o.name,
                    'layout': {},
                    'paint': {
                        'line-color': '#000',
                        'line-width': 1
                    }
                });
                this.map.addLayer({
                    'id': 'lyr-' + o.name + '-symbols',
                    'type': 'symbol',
                    'source': 'src-' + o.name,
                    'layout': {
                        'text-field': ['get', pl.textExpr],
                        'text-anchor': 'center',
                        'text-font': ["Open Sans Regular", "Arial Unicode MS Regular"]
                    },
                    'paint': {
                        'text-color': 'white',
                        "text-halo-color": '#1C243C',
                        "text-halo-width": 40,
                    }
                });
                break;
            case MapUtil.LayerType.Markers:
                const lo = Object.assign({
                    imageExpr: '',
                    textExpr: '',
                    textExprRealTime: '',
                    rotationExpr: '',
                }, o.layerOptions);
                this.map.addLayer({
                    'id': 'lyr-' + o.name + '-symbols',
                    'type': 'symbol',
                    'source': 'src-' + o.name,
                    'layout': {
                        'visibility': 'visible',
                        'icon-image': ['get', lo.imageExpr],
                        'text-field': ['get', lo.textExpr],
                        'icon-rotate': ['get', lo.rotationExpr],
                        'text-font': [
                            'Open Sans Semibold',
                            'Arial Unicode MS Bold'
                        ],
                        'text-offset': [0, 1.25],
                        'text-anchor': 'top',
                        'text-allow-overlap': true,
                        'text-ignore-placement': true,
                        'icon-allow-overlap': true,
                        'icon-ignore-placement': true,
                        'icon-size': 0.13,
                    },
                    'paint': {
                        "text-color": 'white',
                        "text-halo-color": '#1C243C',
                        "text-halo-width": 40,
                    }
                });
                this.map.addLayer({
                    'id': 'lyr-' + o.name + '-symbols' + '-text',
                    'type': 'symbol',
                    'source': 'src-' + o.name,
                    'layout': {
                        'visibility': 'visible',
                        'text-field': ['get', lo.textExprRealTime],
                        'text-font': [
                            'Open Sans Semibold',
                            'Arial Unicode MS Bold'
                        ],
                        "text-size": 12,
                        'text-offset': [0, 3.5],
                        'text-anchor': 'top',
                        'text-allow-overlap': true,
                        'text-ignore-placement': true,
                    },
                    'paint': {
                        "text-color": 'white',
                        "text-halo-color": '#1C243C',
                        "text-halo-width": 40,
                    }
                });
                break;
            case MapUtil.LayerType.Controller:
                const co = Object.assign({
                    imageExpr: '',
                    textExpr: '',
                    textExprRealTime: '',
                    rotationExpr: '',
                }, o.layerOptions);
                this.map.addLayer({
                    'id': 'lyr-' + o.name + '-symbols',
                    'type': 'symbol',
                    'source': 'src-' + o.name,
                    'layout': {
                        'visibility': 'visible',
                        'icon-image': ['get', co.imageExpr],
                        'text-field': ['get', co.textExpr],
                        'text-font': [
                            'Open Sans Semibold',
                            'Arial Unicode MS Bold'
                        ],
                        'text-offset': [0, 1.25],
                        'text-anchor': 'top',
                        'text-allow-overlap': true,
                        'text-ignore-placement': true,
                        'icon-allow-overlap': true,
                        'icon-ignore-placement': true,
                        'icon-size': 0.13,
                    },
                    'paint': {
                        "text-color": 'white',
                        "text-halo-color": '#1C243C',
                        "text-halo-width": 40,
                    }
                });
                break;
            case MapUtil.LayerType.Circles:
                this.map.addLayer({
                    'id': `lyr-${o.name}`,
                    'type': 'fill',
                    'source': `src-${o.name}`,
                    'paint': {
                        "fill-color": "#48273E",
                        "fill-opacity": 0.3
                    },
                });
                break;
            default:
        }
    }

    updateLayer(option: { name: string; data: any }) {
        const src = this.map.getSource('src-' + option.name);
        if (Boolean(src)) {
            this.map.getSource('src-' + option.name).setData(option.data);
        }
    }

    located(coord: [number, number], zoom: number): void {
        this.map.flyTo({
            center: coord,
            zoom: zoom,
            speed: 0.5,
            essential: true
        });
    }

    fnDistance(latlng1: [number, number], latlng2: [number, number]): number {
        const R = 6371e3; // metres
        const φ1 = latlng1[0] * Math.PI / 180; // φ, λ in radians
        const φ2 = latlng2[0] * Math.PI / 180;
        const Δφ = (latlng2[0] - latlng1[0]) * Math.PI / 180;
        const Δλ = (latlng2[1] - latlng1[1]) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // in metres
        return d;
    }
}

class MonitorProperties extends Map {
    constructor(settings: Partial<MapSettings>) {
        settings = Object.assign({
            container: '',
            onMapReady: () => {
                settings.onReady();
            }
        }, settings);
        super(settings);
    }

    createLayer(data: any): void {
        this.addLayer({
            entityType: data.entityType,
            name: data.nameLayer,
            data: MapUtil.geoJSON({
                entityType: data.entityType,
                data: data.data,
                longitudeExpr: 'longitude',
                latitudeExpr: 'latitude',
            }),
            layerOptions: {
                colorExpr: data.colorExpr,
                imageExpr: data.imageExpr,
                textExpr: data.textExpr,
                textExprRealTime: data.textExprRealTime,
                rotationExpr: data.rotationExpr
            }
        });
    }

    set setData(data: any) {
        this.updateLayer({
            entityType: data.entityType,
            name: data.nameLayer,
            data: MapUtil.geoJSON({
                entityType: data.entityType,
                data: data.data,
                longitudeExpr: 'longitude',
                latitudeExpr: 'latitude',
            }),
            layerOptions: {
                imageExpr: data.imageExpr,
                textExpr: data.textExpr,
                textExprRealTime: data.textExprRealTime,
                colorExpr: data.colorExpr,
                rotationExpr: data.rotationExpr
            }
        });
    }

    locationMap(coord: [number, number], zoom: number): void {
        this.located(coord, zoom);
    }
}

class MapUtil {
    static LayerType = {
        Buildings: 'building',
        Markers: 'vehicle',
        MarkersWith: 'marker-with-radius',
        Places: 'place',
        Controller: 'controller',
        Routes: 'routes',
        Mesh: 'mesh',
        Circles: 'radius',
    }

    static getPoints(center: { lat: number; lng: number }, radiusInKm: number, points = 0): [number, number][] {
        if (!points) points = 64;
        const coords = {
            latitude: center.lat,
            longitude: center.lng
        };
        const km = radiusInKm;

        const ret: [number, number][] = [];
        const distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
        const distanceY = km / 110.574;

        let theta: number, x: number, y: number;
        for (let i = 0; i < points; i++) {
            theta = (i / points) * (2 * Math.PI);
            x = distanceX * Math.cos(theta);
            y = distanceY * Math.sin(theta);

            ret.push([coords.longitude + x, coords.latitude + y]);
        }
        ret.push(ret[0]);
        return ret;
    }

    static geoJSON(options: { entityType: string; longitudeExpr?: string; latitudeExpr?: string; data: any[] }) {
        const o = Object.assign({
            longitudeExpr: 'longitude',
            latitudeExpr: 'latitude',
            data: []
        }, options);
        switch (o.entityType) {
            case MapUtil.LayerType.Places:
                return {
                    type: 'FeatureCollection',
                    features: o.data.length === 0 ? [] : o.data[0].map((x: any) => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Polygon',
                            coordinates: Boolean(x.coord) ? [
                                x.coord.map((l: any) => (
                                    [
                                        l[o.longitudeExpr], l[o.latitudeExpr]
                                    ]
                                ))
                            ] : []
                        },
                        properties: x
                    }))
                }
            case MapUtil.LayerType.Markers:
                return {
                    type: 'FeatureCollection',
                    features: o.data.map((x: any) => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [x[o.longitudeExpr], x[o.latitudeExpr]]
                        },
                        properties: x
                    }))
                }
            case MapUtil.LayerType.Controller:
                return {
                    type: 'FeatureCollection',
                    features: o.data.map((x: any) => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [x[o.longitudeExpr], x[o.latitudeExpr]]
                        },
                        properties: x
                    }))
                }
            case MapUtil.LayerType.Circles:
                return {
                    type: 'FeatureCollection',
                    features: o.data.map((x: any) => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Polygon',
                            coordinates: [this.getPoints({ lat: x[o.latitudeExpr], lng: x[o.longitudeExpr] }, 150 / 1000)]
                        },
                    }))
                }
            default:
                return { type: 'FeatureCollection', features: [] };
        }
    }
}

export default MonitorProperties;