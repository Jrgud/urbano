import {   useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';  
import { MapContext } from '../../context/map/MapContext';

mapboxgl.accessToken = 'pk.eyJ1Ijoid2lsLWFwdSIsImEiOiJja2oyM25menQxNDB2MnR0ZHFveGgzZmcyIn0.92hQDorrYHX50YdP_zajZg';

 

const MapView = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null); 
    const mapInstance = useRef<mapboxgl.Map | null>(null); 
    const {setMap }=useContext(MapContext); 
    useEffect(() => { 
        if (mapContainer.current && !mapInstance.current) {  
            const mapBox = new mapboxgl.Map({
            container: mapContainer.current!,
            style: { 
                glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
                version: 8,
                sources: {
                'osm-tiles': {
                    type: 'raster',
                    tiles: [
                    'https://mt.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
                    // 'https://storage.googleapis.com/recursos_pyp_pe/maptiles/v1/s512/{z}/{x}/{y}.png',
                    ],
                    tileSize: 256,
                },
                },
                layers: [
                {
                    id: 'osm-tiles-layer',
                    type: 'raster',
                    source: 'osm-tiles',
                    minzoom: 0,
                    maxzoom: 22,
                },
                ],
            },
            attributionControl: false, 
            center: [ -77.07954854547359,-12.042083040537804],
            zoom: 12,
            }); 
            mapInstance.current = mapBox;
            setMap(mapBox);   
        }
    }, []); 
    return (
        <div ref={mapContainer}       style={{ width: '100%', height: '100%' }}   /> 
    );
};

export default MapView;
