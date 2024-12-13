import { useEffect,  useRef, useState } from "react";
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import Marker1 from '../../images/map/marker-ruta-optima.png' 
import MarkerMapVial from '../../images/map/mapa-vial.png' 
import { GroupBatch,  PointOptiomal, PositionPoint } from "../../types/preruta";
import { usePreRutaStore } from "../../store/pre-ruta/preruta.store";
import { FeatureCollection, Point, Polygon } from "geojson"; 
import { decode } from "../../helpers/here.helper";
import { formatSecondsToTimeString } from "../../helpers/time.helper";
import { getRandomColor } from "../../helpers/general.helper";

const usePreRuta = () => {
    //CONSTANS  
    const TILES_MAP = {
        default: 'https://mt.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
        satelite: 'https://mt.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        secondary: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    }
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2lsLWFwdSIsImEiOiJja2oyM25menQxNDB2MnR0ZHFveGgzZmcyIn0.92hQDorrYHX50YdP_zajZg';
    const initGroupBatch:GroupBatch={}as GroupBatch
    //END CONSTANS

    //STORES
    const getGroupBatches = usePreRutaStore((state) => state.getGroupBatches);
    const groupBatch = usePreRutaStore((state) => state.groupBatch); 
    const optimalRoute = usePreRutaStore((state) => state.optimalRoute); 
    const routesPolyLine = usePreRutaStore((state) => state.routesPolyLine); 
    const getOptimalRoute = usePreRutaStore((state) => state.getOptimalRoute);  
    //END STORES
     
    //HOOKS
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);  
    const [currentStyleMap, setCurrentStyleMap] = useState('default');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentGroupBatch, setCurrentGroupBatch] = useState<GroupBatch>(initGroupBatch);
    //END HOOKS

    //FUNCTIONS 
    //Funcion para cambiar otro mapa
    const switchBaseMap = (newSource: 'default' | 'satelite' | 'secondary') => {
        if (!mapRef!.current!) return;

        const sourceId = 'osm-tiles';
        const layerId = 'osm-tiles-layer';

        // Si la fuente y capa ya existen, elimínalas primero
        if (mapRef!.current!.getLayer(layerId)) {
            mapRef!.current!.removeLayer(layerId);
        }
        if (mapRef!.current!.getSource(sourceId)) {
            mapRef!.current!.removeSource(sourceId);
        }

        // Agrega la nueva fuente con las tiles actualizadas
        mapRef!.current!.addSource(sourceId, {
        type: 'raster',
        tiles: [TILES_MAP[newSource]],
        tileSize: 256,
        });

        // Agrega la capa con la nueva fuente
        mapRef!.current!.addLayer({
        id: layerId,
        type: 'raster',
        source: sourceId,
        minzoom: 0,
        });
        const layers = mapRef!.current!.getStyle()!.layers;
        if (layers && layers.length > 0) {
            mapRef!.current!.moveLayer(layerId, layers[0].id); // Mover debajo de la primera capa existente
        }
        setCurrentStyleMap(newSource);
    }
    //Funcion para mostrar poligonos de zona
    const handleBuildLayerZone=(groupBatch: GroupBatch)=>{
        const points:FeatureCollection<Polygon> =  {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                    type: 'Polygon',
                    coordinates: [groupBatch.zona_puntos.map(point => [point.lng,point.lat])],
                    },
                    properties: {localidad:groupBatch.localidad,zona_color:groupBatch.zona_color},
                }
            ],
        }; 
        const geoJsonSource = mapRef!.current!.getSource('geocercas') as GeoJSONSource; 
        if(geoJsonSource){
            geoJsonSource.setData(points);
        }
    } 
    //Funcion para mostrar markers
    const handleBuildLayerMarkers = (groupBatch: GroupBatch) => { 
        const geojsonData:FeatureCollection<Point>  = {
          type: 'FeatureCollection',
          features: groupBatch.paradas_posicion.map(point => {
            return {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [point.lng,point.lat],
              },
              properties: {
                name: 'marker1',
                imageExpr: 'marker1', 
                textExpr: point.dir_puerta.length>0?point.dir_puerta:point.dir_mza+'-'+point.dir_lote, 
                ...point
              },
            }
          })
    
        };
        const geoJsonSource = mapRef!.current!.getSource('src-markers')as GeoJSONSource; 
        if(geoJsonSource){
            geoJsonSource.setData(geojsonData);
        }
    } 
    //Funcion para activar Zona  y markerts
    const handleCheckboxChange = async (groupBatch: GroupBatch) => {
        setCurrentGroupBatch(groupBatch)
        handleBuildLayerZone(groupBatch)
        handleBuildLayerMarkers(groupBatch)
        setDrawerOpen(false)
    };
    //Funcion para mostrar PopUp de ruta optima
    const handleGeneratePopup=()=> {
        // Agregar un evento de clic para mostrar el popup
        if(mapRef.current){
            mapRef!.current!.on('click', 'lyr-markers-symbols', (e) => {
                // Verifica si hay un feature bajo el cursor
                if (e.features && e.features.length > 0) {
                    const feature = e.features[0] ; // Obtén el primer feature
                    const coordinates =  (feature.geometry as GeoJSON.Point).coordinates.slice(); // Coordenadas del marcador
                    const properties= feature.properties as PositionPoint
    
                    // Ajustar coordenadas si el mapa está en zoom alto para evitar problemas de render
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                    let point=optimalRoute.waypoints.filter(f=>+f.id==properties.geo_id);
                    point=point.length>0? point  : optimalRoute.waypoints ;
 
                    const popup = new mapboxgl.Popup({
                        closeButton: false,
                        closeOnClick: true,
                        maxWidth: 'none', 
                        anchor: 'top',
                        offset:   20
                    });
                    const html = handleGeneratePopupHTML( point[0],properties);
                    popup.setLngLat([coordinates[0],coordinates[1]])
                        .setHTML(html)
                        .addTo(mapRef!.current!);  
                }
            });
        }
        
    }
    //Funcion para diseño de PopUp
    const handleGeneratePopupHTML=( point:PointOptiomal,properties:PositionPoint)=> {  
        const infoPoint= optimalRoute.interconnections.find(f=>f.fromWaypoint===point.id)
        const infoPointTo=currentGroupBatch.paradas_posicion.find(f=>f.geo_id===+infoPoint?.toWaypoint!)
        let html='<div class="grid gap-1">'
        html += `<p class="mx-1 text-black-2 text-xs my-1 font-extrabold ">&#10148;Puerta: ${properties.dir_puerta??properties.dir_mza+'-'+properties.dir_lote}</p>`
        html += `<div class="flex gap-1">`;
        html += `<div class="text-xl bg-purple-600 rounded-lg text-white w-10 flex items-center justify-center">${point.sequence +1} </div>`;
        html += `<div class="text-xs bg-purple-600/20  rounded-lg border-2 border-purple-600 ">
        <p class="mx-2 text-black-2 font-extrabold">&#128666; &#10148;${((infoPoint?.distance??0)/1000).toFixed(2)}km</p>
        <p class="mx-2 text-black-2 font-extrabold">&#9200; &#10148; ${formatSecondsToTimeString(infoPoint?.time??0)}</p>
        </div>`; 
        html += `</div>`;
        html += `<p class="mx-1 text-black-2 text-xs my-1 font-extrabold ">&#10148;Puerta: ${(infoPointTo?.dir_puerta)??(infoPointTo?.dir_mza??'')+'-'+(infoPointTo?.dir_bloque??'')}</p>`
        html+'</div>'
        return  html;
    }
    //Funcion para obtener ruta optma
    const handleGetOptimalRoute = async ( ) => { 
            getOptimalRoute(currentGroupBatch)
    }; 

    //Fuuncion para mostrar layer de ruta optima
    const handleGenerateLineOptimalRoute = () => { 
        // Procesar la primera ruta
        // const route = data.routes[0].sections[0].polyline; // Asegúrate de que este path sea correcto
        const routesDecode: number[][]=[]
        routesPolyLine.map(route=>{
            routesDecode.push(...decode(route.polyline).polyline)
        }) 
        // Convertir la polilínea en GeoJSON
        // const geoJsonData: GeoJSON.Feature = {
        //     type: 'Feature',
        //     properties: {
        //         colorExpr: getRandomColor()
        //     }, // Es obligatorio, aunque esté vacío
        //     geometry: {
        //         type: 'LineString',
        //         coordinates: routesDecode.map(([lat, lng]) => [ lng,lat]), // Mapbox usa lng, lat
        //     },
        // }; 
        const geoJsonData:FeatureCollection  = {
            type: 'FeatureCollection',
            features:routesPolyLine.map(route=>{
                return {
                    type: 'Feature',
                    properties: {
                        colorExpr: getRandomColor()
                    }, // Es obligatorio, aunque esté vacío
                    geometry: {
                        type: 'LineString',
                        coordinates: decode(route.polyline).polyline.map(([lat, lng]) => [ lng,lat]), // Mapbox usa lng, lat
                    },

                } 
            })   
        }; 
    
        const geoJsonSource = mapRef!.current!.getSource('src-line')as GeoJSONSource; 
        if(geoJsonSource){
            geoJsonSource.setData(geoJsonData);
        } 
    }; 
    //END FUNCTIONS 

    //HOOKS USE EFFECTS
    useEffect(() => {
        if(optimalRoute.waypoints){ 
            handleGenerateLineOptimalRoute()
            handleGeneratePopup()
        }
    }, [optimalRoute,routesPolyLine]); 
    useEffect(() => {
        getGroupBatches({ agencia_id: 1, area_id: 1, fecha: '2024-11-01' }); 
        handleGeneratePopup()
    }, []); 

    useEffect(() => {
        if (mapContainerRef.current) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
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
                center: [-77.07954854547359, -12.042083040537804],
                zoom: 12,
            });
            mapRef.current = map; 
            map.on('load', async () => {
                const proms: Promise<void>[] = [];
                const markerVehicule = [
                    { code: 'marker1', url: Marker1 }, 
                    { code: 'marker-map-vial', url: MarkerMapVial }, 
                ];
                markerVehicule.forEach(mvhc => {
                    proms.push(new Promise((resolve, reject) => {
                        map.loadImage(mvhc.url, (error, img) => {
                        if (!map.hasImage(mvhc.code)) {
                            map.addImage(mvhc.code, img!);
                            resolve();
                        }
                        });
                    }));
                }); 
                // LAYER POLYLINE 
                map.addSource('geocercas', {
                    type: 'geojson',
                    data:  {
                        type: 'FeatureCollection',
                        features: [],
                    },
                }); 
                map.addLayer({
                    id: 'geocercas-fill',
                    type: 'fill',
                    source: 'geocercas',
                    paint: {
                    'fill-color': ['get', 'zona_color'],
                    'fill-opacity': 0.5,
                    },
                }); 
                map.addLayer({
                    id: 'geocercas-line',
                    type: 'line',
                    source: 'geocercas',
                    paint: {
                    'line-color': '#000000',
                    'line-width': 2,
                    },
                });  
                map.addLayer({
                    id: 'geocercas-label',
                    type: 'symbol',
                    source: 'geocercas',
                    layout: {
                    'text-field': ['get', 'localidad'],
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                    'text-size': 12,
                    'text-offset': [0, 1.5],
                    },
                    paint: {
                    'text-color': '#ffffff', // Color del texto
                    'text-halo-color': '#000000', // Color del halo (fondo)
                    'text-halo-width': 2, // Grosor del halo (fondo)
                    'text-halo-blur': 1, // Suavizado del halo
                    },
                }); 
                //END LAYER POLYLINE 

                //LAYER LINE
                map.addSource('src-line', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [],
                    },
                }); 
                map.addLayer({
                    id: 'lyr-line',
                    type: 'line',
                    source: 'src-line', // Fuente que acabamos de añadir
                    layout: {
                        'line-join': 'round', // Define cómo se conectan las líneas en los puntos de intersección
                        'line-cap': 'round',  // Define cómo se ven los extremos de la línea
                    },
                    paint: {
                        'line-color': ['get', 'colorExpr'],
                        'line-width': 10,
                        'line-opacity': 0.9
                    },
                });
                map.addLayer({
                    type: 'line',
                    source: 'src-line',
                    id: 'lyr-routes-dashed',
                    paint: {
                        'line-color': '#ffffff',
                        'line-width': 4,
                        'line-dasharray': [0, 4, 3]
                    }
                }); 
                const dashArraySequence = [
                    [0, 4, 3],
                    [0.5, 4, 2.5],
                    [1, 4, 2],
                    [1.5, 4, 1.5],
                    [2, 4, 1],
                    [2.5, 4, 0.5],
                    [3, 4, 0],
                    [0, 0.5, 3, 3.5],
                    [0, 1, 3, 3],
                    [0, 1.5, 3, 2.5],
                    [0, 2, 3, 2],
                    [0, 2.5, 3, 1.5],
                    [0, 3, 3, 1],
                    [0, 3.5, 3, 0.5]
                ]; 
                let step = 0; 
                const animateDashArray = (timestamp:number) => {
                    const newStep = Math.floor(
                        (timestamp / 50) % dashArraySequence.length
                    );
                    if (newStep !== step) {
                        map.setPaintProperty(
                            'lyr-routes-dashed',
                            'line-dasharray',
                            dashArraySequence[step]
                        );
                        step = newStep;
                    }
                    requestAnimationFrame(animateDashArray);
                } 
                animateDashArray(0);
                //END LAYER LINE

                // LAYER MARKERTS 
                map.addSource('src-markers', {
                    type: 'geojson',
                    data:  {
                        type: 'FeatureCollection',
                        features: [],
                    },
                }); 
                map.addLayer({
                    id: 'lyr-markers-symbols',
                    type: 'symbol',
                    source: 'src-markers', // Fuente que acabamos de añadir
                    layout: {
                        visibility: 'visible',
                        'icon-image': ['get', 'imageExpr'], // Obtiene el icono de la propiedad 'imageExpr'
                        'text-field': ['get', 'textExpr'], // Obtiene el texto de la propiedad 'textExpr' 
                        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                        'text-size': 12, // Tamaño del texto
                        'text-offset': [0, 1.25], // Desplaza el texto hacia arriba del icono
                        
                        'text-anchor': 'top', //fija el texto en la parte inferior?
                        'text-allow-overlap': true,
                        'text-ignore-placement': true,
                        'icon-allow-overlap': true,
                        'icon-ignore-placement': true,
                        'icon-size': 0.6, // Tamaño del icono
                        
                    },
                    paint: {
                        'text-color': 'white', // Color del texto
                        'text-halo-color': '#1C243C', // Color del halo (contorno) del texto
                        'text-halo-width': 1, // Grosor del halo
                    },
                }); 
                

                // Cambiar el cursor al pasar por un marcador
                map.on('mouseenter', 'lyr-markers-symbols', () => {
                    map.getCanvas().style.cursor = 'pointer';
                });
                map.on('mouseleave', 'lyr-markers-symbols', () => {
                    map.getCanvas().style.cursor = '';
                });
                //END LAYER MARKERTS 

                
            }); 
            // Add zoom controls 
            return () => map.remove();
        }
    }, []);
    //END HOOKS USE EFFECTS

  return { 
    switchBaseMap,
    groupBatch,
    handleCheckboxChange,
    mapContainerRef,
    currentStyleMap,
    handleGetOptimalRoute,
    currentGroupBatch,
    drawerOpen, 
    setDrawerOpen,
    optimalRoute
  }
}

export default usePreRuta;