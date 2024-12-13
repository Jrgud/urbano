import { Box, Button, IconButton, Modal } from "@mui/material";
import LeyerRouting from "../../pages/Ruteo_Map/CapasRuteo";
import ButtonPointRuteo from "../../pages/Ruteo_Map/PointRuteo";
import SelectWithSearch from "../Forms/SelectGroup/SelectSearch";
import MyForm from "../../pages/Ruteo_Map/FormRuteoRegister";
import { useContext, useEffect, useRef, useState } from "react";
import { useZoneMapStore } from "../../store/map/zone/zoneManagement.store";

import CloseIcon from '@mui/icons-material/Close'; 
import BeenhereIcon from '@mui/icons-material/Beenhere';
import { MapContext } from "../../context/map/MapContext";
import Marker1 from '../../images/map/marker-1.png'
import Marker2 from '../../images/map/marker-1.png'
import mapboxgl from 'mapbox-gl'; 
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { createRoot } from "react-dom/client";
import CustomPopup from "../../pages/Ruteo_Map/PopUpGeocerca";
import PopupDoor from "../../pages/Ruteo_Map/PopUpDoor";

const SettingsMap=()=>{
  const {map}=useContext(MapContext); 
  console.log(map)
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const drawPolygon = useRef<MapboxDraw | null>(null);
  const mapBox = useRef<MapboxDraw | null>(null);
  const mapGeoRuteo = useRef< any | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const popupDoorRef = useRef<mapboxgl.Popup | null>(null);
  
  const [openModalGeocercar,setOpenModalGeocercar]=useState(false);
    const [currentZonePoints,setCurrentZonePoints]=useState([[]]);
    const [currentDoor,setCurrentDoor]=useState(0);
    const [selectedOption, setSelectedOption] = useState<{ label: string; value: number } | null>(null);
    const [zoomMap,setZoomMap]=useState(12);
    const [currentDistrict,setCurrentDistrict]=useState(1263);
    const [showBottonEditZone,setShowBottonEditZone] = useState(false); 
    const [showLayerZone,setShowLayerZone] = useState(true);
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

    const pointsDoor=useZoneMapStore(state=>state.pointsDoor);
    const  zonas=useZoneMapStore(state=>state.zones); 
    const  addZoneMap=useZoneMapStore(state=>state.addZoneMap);
    const  addOrUpdateDoor=useZoneMapStore(state=>state.addOrUpdateDoor);
    const  getZoneLayerByDistric=useZoneMapStore(state=>state.getZoneLayerByDistric);
    const  deleteZoneMap=useZoneMapStore(state=>state.deleteZoneMap); 
    const  commands= useZoneMapStore(state=>state.commands); 
    const getPointsLayerByZone=useZoneMapStore(state=>state.getPointsLayerByZone);

    const onSubmitDoor=async(data:any)=>{
      console.log(data)
      const door={
        geo_id: data.geo_id,
        ciu_id: data.ciu_id,
        geo_gps: data.gps,
        dir_calle: data.direccion,
        dir_puerta: data.nro_puerta,
        dir_urbaniz: data.urbanizacion,
        dir_bloque: data.bloque,
        dir_mza: data.manzana,
        dir_lote: data.lote,
        dir_referencia: data.referencia,
      }
      debugger
      addOrUpdateDoor(door);
      const points = await getPointsLayerByZone(currentDoor);
      console.log(pointsDoor)
      await handlerBuildMarketsGeoJsonLayer(points);
    };
    const  handlerSetCurrentDistric= async (value:any )=>{
      console.log(value)
      setCurrentDistrict(value); 
    };
    const handlerSearchCurrentDistrict= async (  )=>{  
      const geoJsonSource = map.getSource('src-markers') as GeoJSONSourceRaw; 
      geoJsonSource.setData({
        type: 'FeatureCollection',
        features: []
    });
      await handlerGetPoints(); 
    }; 
    const handlerGetPoints=async()=>{
      setShowLayerZone(true);
      const geocerca =await getZoneLayerByDistric(currentDistrict);
      await handlerBuildGeoJsonLayer(geocerca);
    };
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
      const geoJsonSource = map.getSource('geocercas') as GeoJSONSourceRaw; 
      geoJsonSource.setData(points);
    };
    const handlerBuildMarketsGeoJsonLayer= async(pointsDoor:any)=>{
      const geojsonData = {
        type: 'FeatureCollection',
        features: pointsDoor.map(point => {
           return  {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: point.gps.split(',').reverse(), 
            },
            properties: {
              name: 'marker1',
              imageExpr: 'market1', 
              textExpr: point.nro_puerta,  
              ...point
            },
          }
        })
         
      };
      const geoJsonSource = map.getSource('src-markers') as GeoJSONSourceRaw; 
      geoJsonSource.setData(geojsonData);
    };
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
    };
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
          const geocerca= await getZoneLayerByDistric(properties.ciu_id);
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
          }
          
          break;
        case 3:
          setOpenModalGeocercar(true);
          const geocerca_list=await getZoneLayerByDistric(properties.ciu_id); 
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
          const doors = await getPointsLayerByZone(properties.zona_id);
          setCurrentDoor(properties.zona_id); 
          await handlerBuildMarketsGeoJsonLayer(doors);
          break;
        case 5: 
          console.log(pointsDoor)
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
      console.log(zonas);
      await handlerGetPoints(); 
      drawPolygon.current.deleteAll();

    };
    useEffect(() => {
      if (map) {
        const draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
              polygon: true,
              trash: true,
              point: false, 
              line_string: false,
              combine_features: false,
              uncombine_features: false
          },
          keybindings: false,
          touchEnabled: false,
        });
        drawPolygon.current = draw; 
        map.addControl(draw);


        map.on('load', async() => {
          console.log('franco')
          const geocerca=await getZoneLayerByDistric(currentDistrict); 
          const geojsonData = {
            type: 'FeatureCollection',
            features: geocerca.map((zona) => ({
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [zona.puntos.map(point => point.map_point.split(',').reverse().map(Number))],
              },
              properties:zona,
            })),
          }; 
    
          const proms: Promise<void>[] = [];
          const  markerVehicule=[
            {code:'market1', url:Marker1},
            {code:'market2', url:Marker2},
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
          // Añadir la fuente única para todas las geocercas
          const geoJsonSource: GeoJSONSourceRaw = {
            type: 'geojson',
            data: geojsonData,
          }; 
          map.addSource('geocercas', geoJsonSource); 
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
          //Layer of mayers  
          
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
              'icon-size': 0.05 , // Tamaño del icono
              'text-size': 12,
            },
            paint: {
              'text-color': 'white', // Color del texto
              'text-halo-color': '#1C243C', // Color del halo (contorno) del texto
              'text-halo-width': 40, // Grosor del halo
            },
          });
    
    
          map.addControl(new mapboxgl.NavigationControl(), 'top-right');
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
          setOpenModalGeocercar(true);
          console.log(data.features[0])
          setCurrentZonePoints(data.features[0]);
        }); 
        map.on('draw.update', e => {
          let data = drawPolygon.current.getAll();
          setCurrentZonePoints(data.features[0]);
          console.log('draw.update',data);
        });
        // Evento para detectar clic en una geocerca
        map.on('click', 'geocercas-fill', (e) => {
          const coordinates = e.lngLat;
          const properties = e.features?.[0].properties;

          // Cerrar popup anterior si existe
          if (popupRef.current) {
            popupRef.current.remove();
          }
          
          const popupContent = document.createElement('div');
          const rootPopup = createRoot(popupContent);
          rootPopup.render(<CustomPopup properties={properties} onOptionZone={handleOptionsLayerZone} />);

          // Crear nuevo popup
          const popup = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat(coordinates)
            .setDOMContent(popupContent)
            .addTo(map);

          popupRef.current = popup; // Guardar referencia del popup
        }); 
        // Evento para detectar clic en una geocerca
        map.on('contextmenu', 'lyr-markers-symbols', (e) => {
          const coordinates = e.lngLat;
          const properties = e.features?.[0].properties;
          // Cerrar popup anterior si existe
          if (popupDoorRef.current) {
            popupDoorRef.current.remove();
          }

          const popupContent = document.createElement('div');
          const rootPopup = createRoot(popupContent);
          rootPopup.render(<PopupDoor properties={properties} onSubmit={onSubmitDoor} />);

          // Crear nuevo popup
          const popUpDoor = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat(coordinates)
            .setDOMContent(popupContent)
            .addTo(map);

            popupDoorRef.current = popUpDoor; // Guardar referencia del popup
        });  
        // Cerrar el popup si se hace clic fuera de una geocerca
        map.on('click', (e) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ['geocercas-fill'] });
          const markets = map.queryRenderedFeatures(e.point, { layers: ['lyr-markers-symbols'] });

          if (!features.length ) {
            if (popupRef.current) {
              popupRef.current.remove();
              popupRef.current = null;
            }
          }
          if (!markets.length) {
            if (popupDoorRef.current) {
              popupDoorRef.current.remove();
              popupDoorRef.current = null;
            }
          }
        });  
        // Detectar cuando el zoom ha terminado
        map.on('zoomend', () => {
          const finalZoom = map.getZoom();
          setZoomMap(finalZoom);
        });  
      }
 
  
    }, [map])
    
    return (
        <>
          <div className="absolute z-30 bg-white w-62.5 m-1.5 hidden">
            <SelectWithSearch options={commands} onOptionSelect={handleSelect} />
          </div>
          <div className="absolute z-30 bg-white w-62.5 m-1.5 right-0 bottom-0 p-3 rounded">
            <LeyerRouting 
              zoomMap={zoomMap} 
              onSelectedDistricZone={handlerSetCurrentDistric} 
              onClickSearch={handlerSearchCurrentDistrict}  
              handlerSwitchShowLayer={handlerSwitchShowLayer} 
              handlerSwitchShowDoors={handlerSwitchShowDoors} 
            />
          </div>
          <div className="absolute z-30   w-62.5 m-1.5 left-0 bottom-0 hidden">
            <ButtonPointRuteo/>
          </div>
          <div className={`absolute z-30   w-62.5 m-1.5 left-0 top-50`}>
            <Button
              component="label"
              variant="contained"
              tabIndex={-1}
              onClick={()=>console.log(zoomMap)}
              startIcon={<BeenhereIcon />}
            >
              Guardar Geocerca
            </Button> 
          </div>
          <div className={`absolute z-30   w-62.5 m-1.5 left-0 top-50 ${showBottonEditZone?'':'hidden'}`}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              onClick={handlerEditZone}
              startIcon={<BeenhereIcon />}
            >
              Guardar Geocerca
            </Button> 
          </div>   
          <Modal  
            open={openModalGeocercar} 
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
        </>
    );

}

export default SettingsMap;