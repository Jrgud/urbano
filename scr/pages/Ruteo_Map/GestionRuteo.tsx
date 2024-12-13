import {   useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl, { Marker } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'; // Importar estilos de Mapbox Draw
import 'mapbox-gl/dist/mapbox-gl.css';
import './../../css/map.css';
import SelectWithSearch from '../../components/Forms/SelectGroup/SelectSearch';
import { Box, Button,  ButtonGroup,  IconButton,  Modal, Popover  } from '@mui/material';
import { useZoneMapStore } from '../../store/map/zone/zoneManagement.store'; 
import CloseIcon from '@mui/icons-material/Close'; 
import { createRoot } from 'react-dom/client'; 
import CustomPopup from './PopUpGeocerca'; 
import LeyerRouting from './CapasRuteo';
import ButtonPointRuteo from './PointRuteo';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import  { swalWithBootstrapButtons, ToastCustom } from '../../helpers/toast.helper'; 
import Marker1 from '../../images/map/marker-1.png'
import Marker2 from '../../images/map/marker-2.png'
import Marker3 from '../../images/map/marker-3.png'
import Marker4 from '../../images/map/marker-4.png'
import Marker5 from '../../images/map/marker-5.png'
import Marker6 from '../../images/map/marker-6.png'
import MyForm from './FormRuteoRegister';
import PopupDoor from './PopUpDoor';
import FormDoorRegister from './FormDoorRegister';
import GestureIcon from '@mui/icons-material/Gesture';
import * as turf from "@turf/turf"; 
import AddressPopup from './AddressPopup';
import { Feature, GeoJsonProperties, Polygon } from 'geojson';
import { LayerDoors } from './LayerDoors';
import { useUserStore } from '../../store/user/User.store';
import MapIcon from '@mui/icons-material/Map';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import SatelliteIcon from '@mui/icons-material/Satellite';
import FlagIcon from '@mui/icons-material/Flag';
mapboxgl.accessToken = 'pk.eyJ1Ijoid2lsLWFwdSIsImEiOiJja2oyM25menQxNDB2MnR0ZHFveGgzZmcyIn0.92hQDorrYHX50YdP_zajZg';

 

const GestionRuteo = () => {
    


    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [openModalGeocercar,setOpenModalGeocercar]=useState(false);
    const drawPolygon = useRef<MapboxDraw | null>(null);
    const mapBox = useRef<MapboxDraw | null>(null);
    const mapGeoRuteo = useRef< any | null>(null);
    const popupRef = useRef<mapboxgl.Popup | null>(null);
    const popupDoorRef = useRef<mapboxgl.Popup | null>(null);
    

    const [currentZonePoints,setCurrentZonePoints]=useState([]);
    const [currentDoor,setCurrentDoor]=useState(0);
    const [selectedOption, setSelectedOption] = useState<{ label: string; value: number } | null>(null);
    const [zoomMap,setZoomMap]=useState(12);
    const [currentDistrict,setCurrentDistrict]=useState(1263);
    const [currentStyleMap,setCurrentStyleMap]=useState('default');
    const [showBottonEditZone,setShowBottonEditZone] = useState(false);
    const [modalPopupOpen, setModalPopupOpen] = useState(false); 
    const [propertiesLayer, setPropertiesLayer] = useState(null); 
    const [showLayerZone,setShowLayerZone] = useState(true); 
    const [stateTypeZone, setStateTypeZone] = useState(0); 
    const [showLayerPolygonDistict,setShowLayerPolygonDistict] = useState(false); 
    const [isActiveDrawGeofence,setIsActiveDrawGeofence] = useState(false); 
    const [showButtonActiveDrawGeofence,setShowButtonActiveDrawGeofence] = useState(false); 
    const [popupData, setPopupData] = useState(null); 
    const [openPopupLegendDoors, setOpenPopupLegendDoors] = useState<null | HTMLElement>(null);
    const markerAddAddress = useRef<Marker>(null); 
    const [formValues, setFormValues] = useState({
      zona_id: 0,
      dep_id: 0,
      prv_id: 0,
      ciu_id: 0,
      zona_tipo: 0,
      zona_codigo: '',
      zona_descri: '',
      zona_color: '#000000',
    });
    const [formDoorValues, setFormDoorValues] = useState({
      geo_id:0,
      gps: '',
      dep_id: 0,
      prv_id: 0,
      ciu_id: 0,
      bloque: '',
      calle: '',
      nro_puerta: '',
      manzana: '',
      lote: '',
      urbanizacion: '',
      referencia: '',
      direccion: '',
    });
    const [openFormDoorValues, setOpenFormDoorValues] = useState(false);


    const layersDoors =  useZoneMapStore(state=>state.layersDoors);
    const setLayerDoors =  useZoneMapStore(state=>state.setLayerDoors);

    const  pointsDoor=useZoneMapStore(state=>state.pointsDoor);
    const  zonas=useZoneMapStore(state=>state.zones);
    const  polygonDistrict=useZoneMapStore(state=>state.polygonDistrict);
     
    const  addDictionary=useZoneMapStore(state=>state.addDictionary);
    const  authorization=useUserStore(state=>state.authorization);

    const  deleteInventary=useZoneMapStore(state=>state.deleteInventary);
    const  deleteDictionary=useZoneMapStore(state=>state.deleteDictionary);
    const  deleteDoors=useZoneMapStore(state=>state.deleteDoors);
    const  getDoorsByGeoref=useZoneMapStore(state=>state.getDoorsByGeoref);
    
    const  addZoneMap=useZoneMapStore(state=>state.addZoneMap);

    const  addOrUpdateDoor=useZoneMapStore(state=>state.addOrUpdateDoor);
    const  getZoneLayerByDistric=useZoneMapStore(state=>state.getZoneLayerByDistric);
    const  deleteZoneMap=useZoneMapStore(state=>state.deleteZoneMap);  

    const  commands= useZoneMapStore(state=>state.commands);

    //Zustand USER

    
    const getPointsLayerByZone=useZoneMapStore(state=>state.getPointsLayerByZone);

    const  handlerSetCurrentDistric= async (value:any )=>{ 
      setCurrentDistrict(value); 
    }
    const handlerSearchCurrentDistrict= async ( typeZoneId:number )=>{  
      const geoJsonSource = mapGeoRuteo.current.getSource('src-markers'); 
      geoJsonSource.setData({
          type: 'FeatureCollection',
          features: []
      });
      await handlerGetPoints(); 
    } 
    const handlerSwitchShowLayer=(value:boolean)=>{
      setShowLayerZone(value);
      if(value){
        handlerBuildGeoJsonLayer(zonas)
      }else{
        handlerBuildGeoJsonLayer([])

      }
    }
    const handlerSwitchShowDoors=(value:boolean)=>{ 
      if(value){
        handlerBuildMarketsGeoJsonLayer(pointsDoor)
      }else{
        handlerBuildMarketsGeoJsonLayer([])

      }
    } 
    const onSubmitDoor=async(data:any)=>{  
      const door={
        geo_id: data.geo_id,
        ciu_id: data.ciu_id,
        geo_gps: data.gps,
        dir_calle: data.calle,
        dir_puerta: data.nro_puerta,
        dir_urbaniz: data.urbanizacion,
        dir_bloque: data.bloque,
        dir_mza: data.manzana,
        dir_lote: data.lote,
        dir_referencia: data.referencia,
        user_id:authorization.userPostgreId
      } 
      
      await addOrUpdateDoor(door);
      if(currentZonePoints.geometry){
        await handlerGetDoorsByGeoref();
      }else{
        const points = await getPointsLayerByZone(currentDoor);
        await handlerBuildMarketsGeoJsonLayer(points);
      }
      setModalPopupOpen(false)
      setOpenFormDoorValues(false)
    } 
    const handlerGetPoints=async()=>{
      setShowLayerZone(true);
      const geocerca =await getZoneLayerByDistric(currentDistrict,stateTypeZone);
      await handlerBuildGeoJsonLayer(geocerca);
    } 
    const handlerBuildGeoJsonLayerPolygon=(layer:any)=>{
      const points=  {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [layer.puntos.map(point => point.map_point.split(',').reverse().map(Number))],
          },
          properties: layer,
        }]
      }; 
      const geoJsonSource = mapGeoRuteo.current.getSource('geocercas-district') ; 
      geoJsonSource.setData(points);
    } 
    const handlerBuildGeoJsonLayer=(layer:any)=>{
      const points=  {
        type: 'FeatureCollection',
        features: layer.map((zona) => ({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [zona.puntos.map(point => point.map_point.split(',').reverse().map(Number))],
          },
          properties: zona,
        })),
      }; 
      const geoJsonSource = mapGeoRuteo.current.getSource('geocercas') ; 
      geoJsonSource.setData(points);
    } 
    const handlerGetImageMarker=(value:number)=>{ 

      let nameMarket='marker1';
      if (0==value ) {
        nameMarket='marker1';
      }else if (1<=value && value<=2) {
        nameMarket='marker6';
      }else if (2<value && value<=4){
        nameMarket='marker2';
      }else if (4<value && value<=6){
        nameMarket='marker3';
      }else if (6<value && value<=8){
        nameMarket='marker4';
      }else if (8<value ){
        nameMarket='marker5';
      } 
      return nameMarket;

    }
    const handlerBuildMarketsGeoJsonLayer= async(pointsDoor:any)=>{
      const countTypeDoors:Record<string, number> ={}
      let typeMarket='';
      const geojsonData = {
        type: 'FeatureCollection',
        features: pointsDoor.map(point => {
          typeMarket=handlerGetImageMarker(point.tot_inventario)
          countTypeDoors[typeMarket]=(countTypeDoors[typeMarket]?countTypeDoors[typeMarket]:0)+1
           return  {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: point.gps.split(',').reverse(), 
            },
            properties: {
              name: 'marker1',
              imageExpr: typeMarket, 
              textExpr: (point.nro_puerta.length>0 && +point.nro_puerta>0)?point.nro_puerta:point.manzana+'-'+point.lote,  //muestra el numero de las puerta 
              ...point
            },
          }
        })
         
      }; 
      setLayerDoors(countTypeDoors)
      const geoJsonSource = mapGeoRuteo.current.getSource('src-markers') ; 
      geoJsonSource.setData(geojsonData);
    }
    const handlerCloseModalGeocerca=()=>{ 
      swalWithBootstrapButtons.fire({
        title: "¿Si cierrra la ventana no guarda los cambios?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Salir",
        cancelButtonText: "Regresar",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          setOpenModalGeocercar(false);
          drawPolygon.current.deleteAll();
        }
      });
    }
    const handleSelect = (option: { label: string; value: number } | null) => {
      setSelectedOption(option);
    };
    const handlerEditZone=async ()=>{
      const zonesEdit=zonas.find(f=>f.zona_id == currentZonePoints.id);
      if (!zonesEdit){
        ToastCustom.fire({
          icon: "warning",
          title: "no hubo cambios"
        });
        await handlerGetPoints();
        setCurrentZonePoints([]);
        setShowBottonEditZone(false);
        drawPolygon.current.deleteAll();
        return;
      } 

      await swalWithBootstrapButtons.fire({
        title: "¿Deseas guardar los cambios de la Geocerca?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Salir",
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (currentZonePoints.geometry.coordinates[0].length<=1) return;
          const puntos=currentZonePoints.geometry.coordinates[0].map((k:[],i)=>{
            return {map_sequenc:i+1,map_point:k.reverse().join(',')}
          })
          
          const data={
            zona_id:zonesEdit?.zona_id,
            ciu_id:zonesEdit?.ciu_id,
            zona_codigo:zonesEdit?.zona_codigo,
            zona_tipo: zonesEdit?.zona_tipo,
            zona_descri:zonesEdit?.zona_descri,
            zona_color:zonesEdit?.zona_color,
            puntos
          };
          await addZoneMap(data); 
        }else{
          ToastCustom.fire({
            icon: "warning",
            title: "la geocerca no se actualizo"
          });
        }
      });
      await handlerGetPoints();
      setCurrentZonePoints([]);
      setShowBottonEditZone(false);
      drawPolygon.current.deleteAll();
    }
    const handleOptionsLayerZone =async (option: any | null) => {
      const {properties,action} = option; 
      switch (action) {
        case 1:
          await deleteZoneMap(properties.zona_id); 
          await handlerGetPoints();
          break;
        case 2:
          const geocerca= await getZoneLayerByDistric(properties.ciu_id,stateTypeZone);
          const zonesNotEdited=geocerca.filter(f=>f.zona_id != properties.zona_id);
          const zonesEdit=geocerca.find(f=>f.zona_id == properties.zona_id);
          handlerBuildGeoJsonLayer(zonesNotEdited);
          setShowBottonEditZone(true)
          if (zonesEdit) {
            const polygon = {
              id: properties.zona_id,  // Identificador del polígono
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [zonesEdit.puntos.map(k => k.map_point.split(',').reverse().map(Number))],
              },
            };
            // Elimina solo el polígono que estás editando
            const existingFeature = drawPolygon.current.get(polygon.id);
            if (existingFeature) {
              drawPolygon.current.delete(polygon.id);  // Elimina la geometría por su ID
            }
            // Añade el polígono actualizado
            drawPolygon.current.add(polygon);
            
            // Ahora mueve el polígono editado al frente
            const drawLayers = [
              'gl-draw-polygon-fill.cold',
              'gl-draw-polygon-fill.hot',
              'gl-draw-polygon-stroke.cold',
              'gl-draw-polygon-stroke.hot',
              'gl-draw-line.cold',
              'gl-draw-line.hot'
            ];
            
            drawLayers.forEach(layerId => {
              if (mapGeoRuteo.current.getLayer(layerId)) {
                mapGeoRuteo.current.moveLayer(layerId);
              }
            });
          }
          
          break;
        case 3:
          setOpenModalGeocercar(true);
          const geocerca_list=await getZoneLayerByDistric(properties.ciu_id,stateTypeZone); 
          const zoneEdit=geocerca_list.find(f=>f.zona_id == properties.zona_id); 
          const points={
              "id": properties.zona_id,
              "type": "Feature",
              "properties": {},
              "geometry": {
                  "coordinates":[zoneEdit?.puntos.map(k=>k.map_point.split(",").reverse().map(Number))] ,
                  "type": "Polygon"
              }
          }
          setCurrentZonePoints(points);

          setFormValues({
            zona_id: zoneEdit?.zona_id?? 0,
            dep_id: zoneEdit?.dep_id?? 0,
            prv_id: zoneEdit?.prv_id?? 0,
            ciu_id: zoneEdit?.ciu_id??0,
            zona_tipo: zoneEdit?.zona_tipo??0,
            zona_codigo: zoneEdit?.zona_codigo??'',
            zona_descri: zoneEdit?.zona_descri??'',
            zona_color: zoneEdit?.zona_color??'',
          })

          break;
        case 4: 
          const pointsDoor = await getPointsLayerByZone(properties.zona_id);
          setCurrentDoor(properties.zona_id); 
          setCurrentZonePoints([]);
          await handlerBuildMarketsGeoJsonLayer(pointsDoor); 
          break;
        case 5:
          setOpenFormDoorValues(true);  
          const gps= [popupData?.coordinates.lat,popupData?.coordinates.lng].join(',');
          const propertiesDoor={...popupData?.properties} 
          setFormDoorValues((state)=>  ({...state,gps,ciu_id:propertiesDoor.ciu_id,dep_id:propertiesDoor.dep_id,prv_id:propertiesDoor.prv_id}));
         break;
      } 
    }; 
    const handlerSaveZone= async (option: any)=>{  
      if (currentZonePoints.geometry.coordinates[0].length<=1) return;
      const puntos=currentZonePoints.geometry.coordinates[0].map((k:[],i)=>{
        return {map_sequenc:i+1,map_point:k.reverse().join(',')}
      })

      const data= {
        zona_id:option.zona_id,
        ciu_id:option.ciu_id,
        zona_codigo:option.zona_codigo,
        zona_tipo:option.zona_tipo,
        zona_descri:option.zona_descri,
        zona_color:option.zona_color, 
        puntos
      }; 
      await addZoneMap(data);
      
 
      setOpenModalGeocercar(false); 
      await handlerGetPoints(); 
      drawPolygon.current.deleteAll();

    } 
    const optionInventory=async(option:any)=>{
      let response=0;
      if(option.tipo==2){
        const data ={
          direccion:option.direccion,
          geo_id:option.geo_id,
          id_inventario:option.id_inventario,
          ciu_id:option.ciu_id,
          user_id:authorization.userPostgreId
        }
        response=await addDictionary(data);
      }else{
        await deleteInventary(option.id_inventario,authorization.userPostgreId);
      }
      if(currentZonePoints.geometry){
        await handlerGetDoorsByGeoref();
      }else{
        const points = await getPointsLayerByZone(currentDoor);
        await handlerBuildMarketsGeoJsonLayer(points);
      }
      return response
    }
    const handlerDeleteAddresFromDictionary=(id_inventario:number)=>{
      deleteDictionary(id_inventario,authorization.userPostgreId)
    }
    const handlerDeleteDoors=async (geoId:number)=>{
      await deleteDoors(geoId,authorization.userPostgreId);
      const points = await getPointsLayerByZone(currentDoor);
      await handlerBuildMarketsGeoJsonLayer(points);
    }
    
    const handlerChangeModeEdit= async()=>{
      await setIsActiveDrawGeofence(true); 
      if (mapGeoRuteo.current && drawPolygon.current) {   
        drawPolygon.current.deleteAll();
        setCurrentZonePoints([]);
        if(drawPolygon.current.changeMode) drawPolygon.current.changeMode('draw_polygon');
      }
    }
    const handlerGetZoneOrOpenModalZone=()=>{
      if(!isActiveDrawGeofence){
        setShowButtonActiveDrawGeofence(false)
        return setOpenModalGeocercar(true); 
      } 
      handlerGetDoorsByGeoref();

    }
    const validateIntersectZone =(polygon_1:[number,number][],polygon_2:[number,number][])=>{
      const poly1 = turf.polygon([polygon_1 ]); 
      const poly2 = turf.polygon([polygon_2 ]);
      
      const result=turf.intersect(turf.featureCollection([poly1, poly2])) 
      return  result;

 
    }


    const handlerGetDoorsByGeoref= async()=>{ 
      if(!validateIntersectZone(currentZonePoints.geometry!.coordinates[0],polygonDistrict.puntos.map(point => point.map_point.split(',').reverse().map(Number)))){
        ToastCustom.fire({
          icon: "warning",
          title: "La geocerca no está dentro del distrito "
        });
        return
      } 
      setShowButtonActiveDrawGeofence(false)
      const georef = {
        ciu_id:polygonDistrict.ciu_id,
        puntos:currentZonePoints.geometry.coordinates[0].map(k=>{ return {map_point:`${k[1]},${k[0]}`} })
      } 
      const doorsResponse= await getDoorsByGeoref(georef) 
      await handlerBuildMarketsGeoJsonLayer(doorsResponse); 
      drawPolygon.current.deleteAll();
    }

    const getAreaPolygon=useMemo(()=>{
      if(!Boolean(currentZonePoints.geometry)) return 0;
      const points=[currentZonePoints.geometry.coordinates[0].map(k=>k) ];
      var polygon = turf.polygon(points);
      return  turf.area(polygon) ??0;

    },[currentZonePoints] )

    


    useEffect(() => {
      if (popupData && mapGeoRuteo.current) {
        // Cerrar popup anterior si existe
        if (popupRef.current) {
          popupRef.current.remove();
        }
    
        // Crear el contenido del popup
        const popupContent = document.createElement('div');
        const rootPopup = createRoot(popupContent);
    
        // Renderizar el contenido en el popup
        rootPopup.render(<CustomPopup properties={popupData.properties} onOptionZone={handleOptionsLayerZone} />);
    
        // Crear un nuevo popup con el contenido
        const popup = new mapboxgl.Popup({ closeOnClick: true })
          .setLngLat(popupData.coordinates)
          .setDOMContent(popupContent)
          .addTo(mapGeoRuteo.current);
    
        // Guardar la referencia del popup para cerrarlo en el futuro
        popupRef.current = popup; 
      }
    }, [popupData]); 

    const TILES_MAP={
      default:  'https://mt.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
      satelite:'https://mt.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      secondary:'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    }
    const switchBaseMap = (newSource: 'default' | 'satelite'|'secondary') => {
      if (!mapGeoRuteo.current) return;  

      const sourceId = 'osm-tiles';
      const layerId = 'osm-tiles-layer';

      // Si la fuente y capa ya existen, elimínalas primero
      if (mapGeoRuteo.current.getLayer(layerId)) {
        mapGeoRuteo.current.removeLayer(layerId);
      }
      if (mapGeoRuteo.current.getSource(sourceId)) {
        mapGeoRuteo.current.removeSource(sourceId);
      }

      // Agrega la nueva fuente con las tiles actualizadas
      mapGeoRuteo.current.addSource(sourceId, {
        type: 'raster',
        tiles: [TILES_MAP[newSource]],
        tileSize: 256,
      });

      // Agrega la capa con la nueva fuente
      mapGeoRuteo.current.addLayer({
        id: layerId,
        type: 'raster',
        source: sourceId,
        minzoom: 0,
      });
      const layers = mapGeoRuteo.current.getStyle().layers;
      if (layers && layers.length > 0) {
        mapGeoRuteo.current.moveLayer(layerId, layers[0].id); // Mover debajo de la primera capa existente
      }
      setCurrentStyleMap(newSource); 
    } 
 

    useEffect(() => {
        if (mapContainer.current) { 
          const map = new mapboxgl.Map({
            container: mapContainer.current,
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
            zoom: zoomMap,
          }); 
          // Inicializar Mapbox Draw y agregarlo al mapa
          const customModes = MapboxDraw.modes;
          const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: false,
                point: false, 
                line_string: false,
                combine_features: false,
                uncombine_features: false
            },
            clickBuffer: 10,  
            keybindings: false,
            touchEnabled: false,
            modes: {
              ...customModes,
              // Sobrescribir el modo de edición de polígono
              draw_polygon: Object.assign({}, customModes.draw_polygon, {
                // Personalizamos el comportamiento aquí
                onVertex: function () {
                  // No hacer nada para deshabilitar los subpuntos automáticos
                }
              }),
              draw_line_string: Object.assign({}, customModes.draw_line_string, {
                // También para las líneas
                onVertex: function () {
                  // No hacer nada
                }
              }),
            },
            styles: [
              // Estilos para las líneas de los polígonos
              {
                  'id': 'gl-draw-polygon-stroke',
                  'type': 'line',
                  'filter': ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
                  'layout': {
                      'line-cap': 'round',
                      'line-join': 'round',
                  },
                  'paint': {
                      'line-color': 'black', // Cambiar el color de la línea
                      'line-width': 1, // Cambiar el grosor de la línea
                  },
              },
              // Estilos para los rellenos de los polígonos
              {
                  'id': 'gl-draw-polygon-fill',
                  'type': 'fill',
                  'filter': ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
                  'paint': {
                      'fill-color': 'rgba(246 ,199 ,71, 0.46)', // Cambiar el color de relleno
                      'fill-outline-color': 'lightyellow', // Cambiar el color del contorno
                  },
              },
              // Estilos para los puntos
              {
                  'id': 'gl-draw-point',
                  'type': 'circle',
                  'filter': ['all', ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
                  'paint': {
                      'circle-radius': 5,
                      'circle-color': '#FF0000', // Cambiar el color del punto
                  },
              },
               // Estilo para subpuntos (puntos intermedios, color negro y más pequeños)
              {
                'id': 'gl-draw-polygon-and-line-vertex-halo-active',
                'type': 'circle',
                'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'vertex'], ['!=', 'mode', 'static']],
                'paint': {
                  'circle-radius': 10,
                  'circle-color': '#000000' // Color negro para los subpuntos
                }
              },
              // Estilos para líneas
              {
                  'id': 'gl-draw-line',
                  'type': 'line',
                  'filter': ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
                  'layout': {
                      'line-cap': 'round',
                      'line-join': 'round',
                  },
                  'paint': {
                      'line-color': '#FF0000', // Cambiar el color de la línea
                      'line-width': 2,
                  },
              },
          ],
          });
          drawPolygon.current = draw;
          mapGeoRuteo.current=map;
           

          map.on('load', async() => {  
            const proms: Promise<void>[] = [];
            const  markerVehicule=[
              {code:'marker1', url:Marker1},
              {code:'marker2', url:Marker2},
              {code:'marker3', url:Marker3},
              {code:'marker4', url:Marker4},
              {code:'marker5', url:Marker5},
              {code:'marker6', url:Marker6},
            ];
            markerVehicule.forEach(mvhc => {
                proms.push(new Promise((resolve, reject) => {
                    map.loadImage(mvhc.url, (error, img) => {
                        if (!map.hasImage(mvhc.code)) {
                            map.addImage(mvhc.code, img);
                            resolve();
                        }
                    });
                }));
            });
            // Añadir la fuente única para todas las geocercas  de district
            map.addSource('geocercas-district', {
              type: 'geojson',
              data: null,
            }); 
            map.addLayer({
              id: 'geocercas-district-fill',
              type: 'fill',
              source: 'geocercas-district',
              paint: {
                'fill-color': '#1976d2',
                'fill-opacity': 0.5,
              },
            }); 
            map.addLayer({
              id: 'geocercas-district-line',
              type: 'line',
              source: 'geocercas-district',
              paint: {
                'line-color': '#1976d2',
                'line-width': 2,
              },
            });  
            // Añadir la fuente única para todas las geocercas 
            map.addSource('geocercas', {
              type: 'geojson',
              data: null,
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
            // Capa de texto (etiquetas)
            map.addLayer({
              id: 'geocercas-label',
              type: 'symbol',
              source: 'geocercas',
              layout: {
                'text-field': ['get', 'zona_codigo'],
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
            map.addControl(draw);
            // Añadir la fuente GeoJSON al mapa
            map.addSource('src-markers', {
              type: 'geojson',
              data: null,
            }); 
            // Añadir el layer de símbolos al mapa
            map.addLayer({
              id: 'lyr-markers-symbols',
              type: 'symbol',
              source: 'src-markers', // Fuente que acabamos de añadir
              layout: {
                visibility: 'visible',
                'icon-image': ['get', 'imageExpr'], // Obtiene el icono de la propiedad 'imageExpr'
                'text-field': ['get', 'textExpr'], // Obtiene el texto de la propiedad 'textExpr' 
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 1.25], // Desplaza el texto hacia arriba del icono
                'text-anchor': 'top',
                'text-allow-overlap': true,
                'text-ignore-placement': true,
                'icon-allow-overlap': true,
                'icon-ignore-placement': true,
                'icon-size': 0.5 , // Tamaño del icono
                'text-size': 12,
              },
              paint: {
                'text-color': 'white', // Color del texto
                'text-halo-color': '#1C243C', // Color del halo (contorno) del texto
                'text-halo-width': 40, // Grosor del halo
              },
            }); 
          }); 
          map.on('draw.create', e => {
            let data = drawPolygon.current.getAll();
            setFormValues({
              zona_id: 0,
              dep_id: 0,
              prv_id: 0,
              ciu_id: 0,
              zona_tipo: 0,
              zona_codigo: '',
              zona_descri: '',
              zona_color: '#000000',
            })
            setShowButtonActiveDrawGeofence(true); 
            setCurrentZonePoints(data.features[0]);
          }); 
          map.on('draw.update', e => {
            let data = drawPolygon.current.getAll();
            setCurrentZonePoints(data.features[0]);
          });  
          // Evento para detectar clic en una geocerca
          map.on('click', 'geocercas-fill', (e) => {
            const coordinates = e.lngLat;
            const properties = e.features?.[0].properties;
            setPopupData({ coordinates, properties }); 
          });  
          // Cerrar el popup si se hace clic fuera de una geocerca
          map.on('click', (e) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['geocercas-fill'] });  
            if (!features.length ) {
              if (popupRef.current) {
                popupRef.current.remove();
                popupRef.current = null;
              }
            } 
          });   
          // Evento para detectar clic en una geocerca
          map.on('contextmenu', 'lyr-markers-symbols', (e) => { 
            const properties = e.features?.[0].properties; 
            setPropertiesLayer(properties)
            setModalPopupOpen(true);  

          });  
          // Detectar cuando el zoom ha terminado
          map.on('zoomend', () => {
            const finalZoom = map.getZoom();
            setZoomMap(finalZoom); 
          });  
          // Add zoom controls
          map.addControl(new mapboxgl.NavigationControl(), 'top-right');
          return () => map.remove();
        }
    }, []);

    
    useEffect(() => { 
      if (mapGeoRuteo.current&&mapGeoRuteo.current.getSource('geocercas-district')) {
        if(showLayerPolygonDistict && polygonDistrict.puntos.length>0){ 
          handlerBuildGeoJsonLayerPolygon(polygonDistrict)
        }else{
          const geoJsonSource = mapGeoRuteo.current.getSource('geocercas-district'); 
          geoJsonSource.setData({
            type: 'FeatureCollection',
            features: []
        });
        }

      }
    }, [polygonDistrict,showLayerPolygonDistict]); 


    const handlerOptionAddressMarker=( type:number)=>{ 
      switch (type) {
        case 1:
          if (mapGeoRuteo.current ) {   
            if (markerAddAddress.current && markerAddAddress.current.getPopup()) {
              markerAddAddress.current.getPopup()?.remove(); // Cierra el popup
              setOpenFormDoorValues(true);  
              const lngLat = markerAddAddress.current.getLngLat();
              const gps= [lngLat.lat,lngLat.lng].join(','); 
              setFormDoorValues((state)=>  ({...state,gps,ciu_id:polygonDistrict.ciu_id,dep_id:polygonDistrict.dep_id,prv_id:polygonDistrict.prv_id}));
            } 
          }
          break;
        case 2:  
          if (markerAddAddress.current) {
              markerAddAddress.current.remove();  
          }
          break;
      } 
    }

    const handlerCloseDrawPolygon=async ()=>{
      await setIsActiveDrawGeofence(false); 
      setShowButtonActiveDrawGeofence(false)
      if (mapGeoRuteo.current && drawPolygon.current) {   
        drawPolygon.current.deleteAll();
        setCurrentZonePoints([]); 
      }
    }
    const addMarkerAddAddress = () => {
      if (markerAddAddress.current) {
        markerAddAddress.current.remove(); // Elimina el marcador existente antes de agregar uno nuevo
      }


      const polygon = turf.polygon([
        polygonDistrict.puntos.map(point => point.map_point.split(',').reverse().map(Number))
      ]);
      
      const centroid = turf.centroid(polygon);
      if(!centroid){
        ToastCustom.fire({
          icon: "warning",
          title: "No hay Geocerca de Distrito "
        });
        return
      } 
  
      const popupContent = document.createElement('div');
      const rootPopup = createRoot(popupContent);
      // const popupData={lat:centroid.geometry.coordinates[0],  lng:centroid.geometry.coordinates[1]} 
      const position=mapGeoRuteo.current.getCenter();
      const popupData={lat:position.lat,  lng:position.lng} 
      const validatePoint=validatePointInPolygon([popupData.lng,popupData.lat],polygon)
        if(!validatePoint){
          ToastCustom.fire({
            icon: "warning",
            title: "La puerta está fuera del distrito"
          });
        }

      // Renderizar el contenido en el popup
      rootPopup.render(<AddressPopup properties={popupData} showBottomAddAddress={validatePoint}   handlerOptionAddressMarker={handlerOptionAddressMarker} />);
      let marker = new mapboxgl.Marker({ draggable: true,color: 'black' })
      .setLngLat([popupData.lng,popupData.lat]) // Establecemos la posición inicial
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent)   
      )
      .addTo(mapGeoRuteo.current );  


      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        const validatePoint=validatePointInPolygon([lngLat.lng,lngLat.lat],polygon)
        if(!validatePoint){
          ToastCustom.fire({
            icon: "warning",
            title: "La puerta está fuera del distrito"
          });
        }
        rootPopup.render(<AddressPopup properties={{lat:lngLat.lat,lng:lngLat.lng}} showBottomAddAddress={validatePoint}  handlerOptionAddressMarker={handlerOptionAddressMarker} />);
        marker.setPopup(
          new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent) 
        );
      });
      mapGeoRuteo!.current!.flyTo({ center: [popupData.lng,popupData.lat]});
  
      markerAddAddress.current=marker;
    };

    const validatePointInPolygon=(point:[number,number],polygon: Feature<Polygon, GeoJsonProperties>)=>{
      const pt = turf.point(point);  
      return turf.booleanPointInPolygon(pt, polygon);
    }


  return (
    <div  id="mapRuteo" className="p-0 m-0 h-screen" style={{ width: '100%' }} >
        <div className="absolute z-30 bg-white w-62.5 m-1.5 hidden">
          <SelectWithSearch options={commands} onOptionSelect={handleSelect} />
        </div>
        <div className={`absolute z-30  left-0   top-0  m-2 `}>
        <button onClick={(e)=>setOpenPopupLegendDoors(e.currentTarget)} className='bg-purple-700 p-2 text-white font-bold rounded-md'>
          <FlagIcon/>
        </button>
        <Popover 
          open={!!openPopupLegendDoors}
          anchorEl={openPopupLegendDoors} 
          onClose={()=>setOpenPopupLegendDoors(null)}
          anchorOrigin={{ 
            vertical: 'top',
            horizontal: 'left',
          }}
        > 
          <LayerDoors data={layersDoors}/>
        </Popover>
        </div> 
        <div className={`absolute z-30  left-1/2   top-0  m-2 `}>
          <ButtonGroup size="small" aria-label="Small button group" variant="contained" >
            <Button color={currentStyleMap==='default'?'warning':'primary'} key="one" onClick={()=>switchBaseMap('default')}>
              <MapIcon/>
            </Button>
            <Button key="two" color={currentStyleMap==='satelite'?'warning':'primary'} onClick={()=>switchBaseMap('satelite')}>
              <SatelliteAltIcon/>
            </Button>
            <Button key="three" color={currentStyleMap==='secondary'?'warning':'primary'} onClick={()=>switchBaseMap('secondary')}>
              <SatelliteIcon/>
            </Button>
          </ButtonGroup> 
        </div> 
        <div className="absolute z-30 bg-white w-62.5 m-1.5 right-0 bottom-0 p-3 rounded">
          <LeyerRouting 
            zoomMap={zoomMap} 
            polygonDistrict={polygonDistrict}
            onSelectedDistricZone={handlerSetCurrentDistric} 
            onClickSearch={handlerSearchCurrentDistrict}  
            handlerSwitchShowLayer={handlerSwitchShowLayer} 
            handlerSwitchShowDoors={handlerSwitchShowDoors} 
            showLayerPolygonDistict={showLayerPolygonDistict}
            setShowLayerPolygonDistict={setShowLayerPolygonDistict}
            addMarkerAddAddress={addMarkerAddAddress}
            handlerChangeModeEdit={handlerChangeModeEdit} 
            stateTypeZone={stateTypeZone}
            setStateTypeZone={setStateTypeZone}
          />
        </div>
        <div className="absolute z-30   w-62.5 m-1.5 left-0 bottom-0 hidden">
          <ButtonPointRuteo/>
        </div> 
        <div className={`absolute z-30   w-62.5 m-1.5 left-0 top-50 ${showBottonEditZone?'':'hidden'}`}>
          <Button
            component="label"
            variant="contained"
            tabIndex={-1}
            onClick={handlerEditZone}
            startIcon={<BeenhereIcon />}
          >
            Guardar Geocerca
          </Button> 
        </div>
        <div className={`absolute bg-black-2 left-1/2 m-2 p-1.5 rounded-md text-center text-lg text-white top-0 w-62.5 z-30 ${showButtonActiveDrawGeofence?'':'hidden'}`}>
          <div>
            Area: { getAreaPolygon.toFixed(2) } m²
          </div>
          <button type='button' className='text-white bg-red-600 absolute top-0 right-0 rounded-full px-2 m-2' onClick={handlerCloseDrawPolygon}>X</button>
          <Button
            component="label"
            variant="contained"
            tabIndex={-1}
            onClick={handlerGetZoneOrOpenModalZone}
            startIcon={isActiveDrawGeofence?(<GestureIcon/>)  :  (<BeenhereIcon />)}
            color={isActiveDrawGeofence?'secondary':'success'}
          >
            {isActiveDrawGeofence?'Traer Puertas':'Llenar datos Zona'}
          </Button> 
        </div>
        <div ref={mapContainer}       style={{ width: '100%', height: '100%' }}   />  
        <Modal  
          open={openModalGeocercar}
          // onClose={handlerCloseModalGeocerca}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="bg-white" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',  width: 400 }}>
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
                <h3 className="font-medium text-black dark:text-white">Configuración Zona </h3>
                <IconButton color="primary" aria-label="add to shopping cart" onClick={()=>handlerCloseModalGeocerca()}>
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="p-6.5">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <MyForm initialValues={formValues} onSubmit={handlerSaveZone}/> 
                  </div>
              </div> 
          </Box>
        </Modal>  
        <FormDoorRegister initialValues={formDoorValues}   onSubmit={onSubmitDoor} open={openFormDoorValues} setOpenFormDoorValues={setOpenFormDoorValues} ></FormDoorRegister>
        <Modal
          open={modalPopupOpen}
          onClose={() => setModalPopupOpen(false)}
          aria-labelledby="popup-modal"
          aria-describedby="popup-modal-description"
        >
        <Box className="bg-white"  sx={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-35%, -50%)'}} >
          <PopupDoor 
            properties={propertiesLayer} 
            onSubmit={onSubmitDoor} 
            optionInventory={optionInventory} 
            handlerDeleteAddresFromDictionary={handlerDeleteAddresFromDictionary}
            setModalPopupOpen={setModalPopupOpen}
            handlerDeleteDoors={handlerDeleteDoors}
          /> 
        </Box>
      </Modal>
    </div>
  );
};

export default GestionRuteo;
