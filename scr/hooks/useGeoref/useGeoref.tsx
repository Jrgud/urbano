import { useEffect,  useRef, useState } from "react";
import { useGeorefMapStore } from "../../store/map/georef/georef.store";
import mapboxgl, { Marker } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import WorkspacesIcon from '@mui/icons-material/Workspaces';
import BusinessIcon from '@mui/icons-material/Business';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { Address, AddressAuto, DoorsGeoref } from "../../interfaces/georef/georef.interface";
import { createRoot } from "react-dom/client";
import AddressPopup from "../../components/Georef/PopUpAddress";
import Marker1 from '../../images/map/marker-1.png'
import Marker2 from '../../images/map/marker-2.png'
import { OptionsSelect } from "../../interfaces/general/general.interfaces";
import { useGeneralStore } from "../../store/general/genetal.store";
import { useUserStore } from "../../store/user/User.store";

const useGeoref = () => {
  //Constans Variables
  const currentDate = new Date();
  const currentMarkerPosition = new mapboxgl.LngLat(0, 0);
  const initAddress = {
    idAddress: 0,
    ciuId: 0,
    gps: '',
    streetAddress: '',
    numberAddress: '',
    urbanizationAddress: '',
    blockAddress: '',
    mzaAddress: '',
    loteAddress: '',
    referenceAddress: '',
    id_bot_log: 0,
    city: '',
    addressNormalized: '',
    distric: '',
    cliente: '',
    guia: '',
    shipper: '',
    cli_email:'',
    cli_tel:'',
    cli_direcciones:[],
    cli_id:0
  }
  const formattedDate = currentDate.toISOString().split('T')[0];
  const actionsCommands = [
    { icon: <WorkspacesIcon />, name: 'Lotes', isActive: false, value: 1 },
    { icon: <BusinessIcon />, name: 'Direcciones', isActive: false, value: 2 },
    { icon: <MyLocationIcon />, name: 'Georeferenciación', isActive: false, value: 3 },
    // { icon: <ShareIcon  />, name: 'Share',isActive:false },
  ];

  //Hooks
  const [initDate, setInitDate] = useState(formattedDate);
  const [endDate, setEndDate] = useState(formattedDate);
  const [openModalContentAddress, setOpenModalContentAddress] = useState(false);
  const [openModalDeleteAddress, setOpenModalDeleteAddress] = useState(false);
  const [openModalWthReferencesAddress, setOpenModalWthReferencesAddress] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(currentMarkerPosition);

  const [currentAddressWithoutReference, setCurrentAddressWithoutReference] = useState<Address>(initAddress);

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const drawPolygon = useRef<MapboxDraw | null>(null);
  const markerRef = useRef<Marker>(null);
  const mapGeoref = useRef< any | null>(null);

  const [openDrawerBatch, setOpenDrawerBatch] = useState(false);
  const [openModalAddress, setOpenModalAddress] = useState(false);
  const [currentDistrict, setCurrentDistrict] = useState(0);
  const [openCommands, setOpenCommands] = useState(false);
  const [openModalAddressGeoref, setOpenModalAddressGeoref] = useState(false);

  const [showButtonGetDoors, setShowButtonGetDoors] = useState(false);
  const [shipperSelected, setShipperSelected] = useState(0);
  const [typeErrorSelected, setTypeErrorSelected] = useState(0);
  const [stateSelected, setStateSelected] = useState(0);
  const [provinceSelected, setProvinceSelected] = useState(0);
  const [departamentSelected, setDepartamentSelected] = useState(0);
  const [districtSelected, setDistrictSelected] = useState(0);
  const [currentGeorefPoints, setCurrentGeorefPoints] = useState([]);

  const [inputSearchAddress, setInputSearchAddress] = useState('');
  const [addressGeoredSelected, setAddressGeoredSelected] = useState('');
  const [descriptionTypeError, setDescriptionTypeError] = useState('');
  const [radiusMarkerInMeters, setRadiusMarkerInMeters] = useState(50);
  const [currentStyleMap, setCurrentStyleMap] = useState('default');

  const [selectedGroupAddress, setSelectedGroupAddress] = useState<number[]>([]);

  const [currentSelectedDoor, setCurrentSelectedDoor] = useState<DoorsGeoref>({ direccion: '', geo_id: 0, gps: '0,0', puerta: '',manzana:'',lote:''});

  //Zustand General Stores
  const setBackdrop = useGeneralStore(state => state.setBackdrop);

  //Zustand USER
  const authorization = useUserStore(state => state.authorization);


  //Zustand Georef Stores
  const listDataClient = useGeorefMapStore(state => state.listDataClient);
  const getListDataClient = useGeorefMapStore(state => state.getListDataClient);

  const listDistrictSearch = useGeorefMapStore(state => state.listDistrictSearch);
  const searchDistrict = useGeorefMapStore(state => state.searchDistrict);
  const setListDistrictSearch = useGeorefMapStore(state => state.setListDistrictSearch);

  const anulateAddress = useGeorefMapStore(state => state.anulateAddress);

  const batches = useGeorefMapStore(state => state.batches);
  const address = useGeorefMapStore(state => state.address);
  const addressAuto = useGeorefMapStore(state => state.addressAuto);
  const getBatches = useGeorefMapStore(state => state.getBatches);
  const getAddress = useGeorefMapStore(state => state.getAddress);
  const getAddressAuto = useGeorefMapStore(state => state.getAddressAuto);
  const setAddress = useGeorefMapStore(state => state.setAddress);
  const setAddressAuto = useGeorefMapStore(state => state.setAddressAuto);
  const searchAddres = useGeorefMapStore(state => state.searchAddres);
  const validateAddressGeoref = useGeorefMapStore(state => state.validateAddressGeoref);
  const getDoorsByGeoref = useGeorefMapStore(state => state.getDoorsByGeoref);
  const doors = useGeorefMapStore(state => state.doors);
  const manualGeoref = useGeorefMapStore(state => state.manualGeoref);
  const setDoors = useGeorefMapStore(state => state.setDoors);
  const getDoorsByRadius = useGeorefMapStore(state => state.getDoorsByRadius);

  const getListState = useGeorefMapStore(state => state.getListState);
  const getListShipper = useGeorefMapStore(state => state.getListShipper);
  const getListTypesErrors = useGeorefMapStore(state => state.getListTypesErrors);

  const getAllDepartament = useGeorefMapStore(state => state.getAllDepartament);
  const getAllProvince = useGeorefMapStore(state => state.getAllProvince);
  const getAllDistric = useGeorefMapStore(state => state.getAllDistric);

  const shippers = useGeorefMapStore(state => state.shippers);
  const states = useGeorefMapStore(state => state.states);
  const departament = useGeorefMapStore(state => state.departament);
  const province = useGeorefMapStore(state => state.province);
  const district = useGeorefMapStore(state => state.district);
  const typesErrors = useGeorefMapStore(state => state.typesErrors);

  //Functions
  const handlerManualGeoref = async () => {
    let addressSelected = address.filter(f => selectedGroupAddress.some(s => s == f.idAddress)).map(k => { return { dir_id: k.idAddress, dir_calle: k.streetAddress } })
    if (addressSelected.length <= 0) {
      addressSelected = [{ dir_id: currentAddressWithoutReference.idAddress, dir_calle: currentAddressWithoutReference.streetAddress }]
    }
    const data = {
      geo_id: currentSelectedDoor.geo_id,
      ciu_id: currentDistrict?currentDistrict:currentAddressWithoutReference.ciuId,
      direcciones: addressSelected,
      // dir_id: currentAddressWithoutReference.idAddress,
      // dir_calle: addressGeoredSelected,
      bot_log_id: currentAddressWithoutReference.id_bot_log,
      tipo_ope: 1,
      id_user: authorization.userPostgreId,
    };
    await manualGeoref(data);
    setOpenModalAddressGeoref(false);
    setInputSearchAddress('');
    setAddressGeoredSelected('');
    setDoors([]);
    setSelectedGroupAddress([]);
    setCurrentAddressWithoutReference(initAddress);
    setCurrentSelectedDoor(
      {
        direccion: '',
        geo_id: 0,
        gps: '0,0',
        puerta: '',
        manzana: '',
        lote: '',
      }
    )
    if (markerRef.current) {
      markerRef.current.remove();  // Eliminar el marcador del mapa
      markerRef.current = null;    // Limpiar la referencia
      handlerSetDoorsReference([]);
    }
    if (mapGeoref.current!.getLayer('circle-layer')) {
      mapGeoref.current!.removeLayer('circle-layer'); // Elimina la capa
    }
    if (mapGeoref.current!.getSource('circle')) {
      mapGeoref.current!.removeSource('circle'); // Elimina la fuente
    }
  }

  const handlerManualGeorefModal = async (geo_id: number) => {
    let addressSelected = address.filter(f => selectedGroupAddress.some(s => s == f.idAddress)).map(k => { return { dir_id: k.idAddress, dir_calle: k.streetAddress } })
    if (addressSelected.length <= 0) {
      addressSelected = [{ dir_id: currentAddressWithoutReference.idAddress, dir_calle: currentAddressWithoutReference.streetAddress }]
    }
    const data = {
      geo_id: geo_id,
      ciu_id:currentDistrict?currentDistrict: currentAddressWithoutReference.ciuId,
      direcciones: addressSelected,
      bot_log_id: currentAddressWithoutReference.id_bot_log,
      tipo_ope: 1,
      id_user: authorization.userPostgreId,
    };
    await manualGeoref(data);
    setOpenModalAddressGeoref(false);
    setInputSearchAddress('');
    setAddressGeoredSelected('');
    setDoors([]);
    setSelectedGroupAddress([]);
    setCurrentAddressWithoutReference(initAddress);
    setCurrentSelectedDoor(
      {
        direccion: '',
        geo_id: 0,
        gps: '0,0',
        puerta: '',
        manzana: '',
        lote: '',
      }
    )
    if (markerRef.current) {
      markerRef.current.remove();  // Eliminar el marcador del mapa
      markerRef.current = null;    // Limpiar la referencia
      handlerSetDoorsReference([]);
    }
    if (mapGeoref.current!.getLayer('circle-layer')) {
      mapGeoref.current!.removeLayer('circle-layer'); // Elimina la capa
    }
    if (mapGeoref.current!.getSource('circle')) {
      mapGeoref.current!.removeSource('circle'); // Elimina la fuente
    }
  }

  const toggleDrawerBatch = (newOpen: boolean) => () => {
    setOpenDrawerBatch(newOpen);
  }

  const handlerOptionAddressMarket = async (type: number) => {
    switch (type) {
      case 1:
        if (mapGeoref.current && drawPolygon.current) {
          if (markerRef.current && markerRef.current.getPopup()) {
            const latLng = markerRef.current.getLngLat();
            markerRef.current.getPopup()?.remove(); // Cierra el popup 

            const doorsResponse = await getDoorsByRadius({ ciu_id: (currentDistrict?currentDistrict:currentAddressWithoutReference.ciuId), coordenadas: latLng.lat + ',' + latLng.lng, radio: radiusMarkerInMeters })
            handlerSetDoorsReference(doorsResponse);
          }
          // if(drawPolygon.current.changeMode) drawPolygon.current.changeMode('draw_polygon');
        }
        break;
      case 2:
        handlerDeleteMarkets()
        break;
      case 3:
        if (mapGeoref.current && drawPolygon.current) {
          if (markerRef.current && markerRef.current.getPopup()) {
            const latLng = markerRef.current.getLngLat();
            const streetViewUrl = `https://www.google.com/maps/embed?pb=!4v1572951718108!6m8!1m7!1sCAoSLEFGMVFpcFB3YUlBaTh3d1lCWnFZQ01uRTBNRUxUam5od0JCUWlyTzY5aEZi!2m2!1d${latLng.lat}!2d${latLng.lng}!3f75!4f0!5f0.7820865974627469`;
            // Abre la URL en una ventana flotante
            window.open(streetViewUrl, '_blank', 'width=800,height=600');
          }
        }
        break;
    }
  }
  const handlerDeleteMarkets=()=>{
    setAddressGeoredSelected('')
    setCurrentSelectedDoor(
      {
        direccion: '',
        geo_id: 0,
        gps: '0,0',
        puerta: '',
        manzana: '',
        lote: '',
      }
    )
    if (markerRef.current) {
      markerRef.current.remove();  // Eliminar el marcador del mapa
      markerRef!.current = null;    // Limpiar la referencia
      handlerSetDoorsReference([]);
      if (mapGeoref.current!.getLayer('circle-layer')) {
        mapGeoref.current!.removeLayer('circle-layer'); // Elimina la capa
      }
      if (mapGeoref.current!.getSource('circle')) {
        mapGeoref.current!.removeSource('circle'); // Elimina la fuente
      }
    }
  }

  const handleClickShowMarket = (lat: number, lng: number, sub_tet: string,searchTypeAddresses:number,geoId:number) => {
    //Tipo 4 si es que es busqueda por urbano demos por defecto el valor que obtenemos de la busqueda
    if(searchTypeAddresses===4){
      setCurrentSelectedDoor(
        {
          direccion: sub_tet,
          geo_id: geoId,
          gps: lat+','+lng,
          puerta: '',
          manzana: '',
          lote: '',
        }
      )
    }
    if (markerRef.current) {
      markerRef.current.remove();  // Eliminar el marcador del mapa
      markerRef!.current = null;    // Limpiar la referencia
      handlerSetDoorsReference([]);
      if (mapGeoref.current!.getLayer('circle-layer')) {
        mapGeoref.current!.removeLayer('circle-layer'); // Elimina la capa
      }
      if (mapGeoref.current!.getSource('circle')) {
        mapGeoref.current!.removeSource('circle'); // Elimina la fuente
      }
    }
    const references=currentAddressWithoutReference.streetAddress+' '+(currentAddressWithoutReference.numberAddress??'')+' '+(currentAddressWithoutReference?.mzaAddress??'')+' '+(currentAddressWithoutReference.loteAddress??'')+' '+(currentAddressWithoutReference.blockAddress??'')
    setAddressGeoredSelected(references);
    const newPosition = new mapboxgl.LngLat(lat, lng);
    setMarkerPosition(newPosition)
    // Crear el contenido del popup
    const popupContent = document.createElement('div');
    const rootPopup = createRoot(popupContent);
    // Renderizar el contenido en el popup
    rootPopup.render(<AddressPopup properties={markerPosition} handlerOptionAddressMarket={handlerOptionAddressMarket} />);
    // if (!markerRef.current) {
      const marker = new mapboxgl.Marker({ draggable: true, color: 'black' })
        .setLngLat(newPosition) // Establecemos la posición inicial
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent)
        )
        .addTo(mapGeoref!.current!);
      markerRef!.current! = marker;

      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        setMarkerPosition(lngLat)
        // rootPopup.render(<AddressPopup properties={{lat:lngLat.lat,lng:lngLat.lng}}    handlerOptionAddressMarket={handlerOptionAddressMarket} />);
        // marker.setPopup(
        //   new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent) 
        // );
        // updateCircle(lngLat,radius)
      });
    // } else {
    //   markerRef.current.setLngLat(markerPosition);
    //   markerRef.current.getPopup()?.setDOMContent(popupContent);
    // }

    updateCircle(newPosition, radiusMarkerInMeters)
    handleMoveCamera(lat, lng)
  };
  const handleMoveCamera=(lat:number,lng:number)=>{
    const newPosition = new mapboxgl.LngLat(lat, lng);
    mapGeoref!.current!.flyTo({ 
      center: newPosition,
      zoom: 18, // Ajusta el nivel de zoom (por ejemplo, 14)
      speed: 1.2, // Velocidad de la animación (opcional)
      curve: 1.42, // Suavidad del vuelo (opcional)
      essential: true, // Esto asegura que el movimiento sea accesible 
    });
  }

  // Función para actualizar el círculo en el mapa
  const updateCircle = (center: { lat: number, lng: number }, radiusInMeters: number) => {
    const circleData = createCircleGeoJSON(center, radiusInMeters);

    if (mapGeoref.current && mapGeoref.current!.getSource('circle')) {
      mapGeoref.current!.getSource('circle').setData(circleData);
    } else {
      // Agrega la fuente y la capa si aún no existen
      mapGeoref.current!.addSource('circle', {
        type: 'geojson',
        data: circleData
      });

      mapGeoref.current!.addLayer({
        id: 'circle-layer',
        type: 'fill',
        source: 'circle',
        paint: {
          'fill-color': 'blue',
          'fill-opacity': 0.2
        }
      });
    }
  };

  // Función para generar el GeoJSON del círculo
  const createCircleGeoJSON = (center: { lat: number, lng: number }, radiusInMeters: number) => {
    const points = 64; // Cantidad de puntos para hacer el círculo suave
    const coords = {
      latitude: center.lat,
      longitude: center.lng
    };

    const km = radiusInMeters / 1000;
    const ret = [];
    const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
    const distanceY = km / 110.574;

    let theta, x, y;
    for (let i = 0; i < points; i++) {
      theta = (i / points) * (2 * Math.PI);
      x = distanceX * Math.cos(theta);
      y = distanceY * Math.sin(theta);

      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [ret]
          }
        }
      ]
    };
  };




  const handlerSearchAddressWithoutReference = (bacthId: number, stateId: number, shipperId: number, ciuId: number) => {
    getAddress(bacthId, stateId, shipperId, ciuId);
    setOpenDrawerBatch(false);
    setOpenModalAddress(true);
    setOpenModalWthReferencesAddress(false)
    handlerShowAddressWithReferences([])
    setAddressAuto([]);
    handlerDeleteMarkets() 

    setCurrentAddressWithoutReference(initAddress); 
    setOpenModalAddressGeoref(false)
    setInputSearchAddress('')
    setCurrentDistrict(0)
  };
  const handlerSearchAddressWithReference = async(bacthId: number, stateId: number, shipperId: number, ciuId: number) => {
    const responseAddress=await getAddressAuto(bacthId, stateId, shipperId, ciuId);
    setOpenModalWthReferencesAddress(true)
    setOpenModalAddress(false) 
    setOpenDrawerBatch(false)
    handlerShowAddressWithReferences(responseAddress)
    handlerDeleteMarkets()
    setCurrentAddressWithoutReference(initAddress); 
    setOpenModalAddressGeoref(false)
    setInputSearchAddress('')
    setCurrentDistrict(0)
  }; 
  const handlerClickShowCommands = (command: number) => {
    switch (command) {
      case 1:
        setOpenDrawerBatch(true);
        break;
      case 2:
        setOpenModalAddress(!openModalAddress);
        break;
      case 3:
        setOpenModalAddressGeoref(prev => !prev)
        break;
    }
  }

  const buttonActionAddress = async (row: Address, type: number) => {
    switch (type) {
      case 1:
        setCurrentAddressWithoutReference(row);
        setOpenModalContentAddress(true);
        break;
      case 2:
        setCurrentAddressWithoutReference(row);
        // const dataAdressGeoref = {
        //   dir_calle: row.streetAddress ?? '',
        //   dir_numero: row.numberAddress ?? '',
        //   dir_urbaniz: row.urbanizationAddress ?? '',
        //   dir_bloque: row.blockAddress ?? '',
        //   dir_mza: row.mzaAddress ?? '',
        //   dir_lote: row.loteAddress ?? '',
        //   dir_id: row.idAddress ?? '',
        //   ciu_id: row.ciuId ?? '',
        //   dir_point: row.gps ?? '',
        // }
        // const validate = await validateAddressGeoref(dataAdressGeoref);
        // if (!validate) {
          setOpenModalAddressGeoref(true)
          setInputSearchAddress(row.addressNormalized)
          setCurrentDistrict(0)
          handlerDeleteMarkets()
        // } else {

        // }
        break;
      case 3:
        setCurrentAddressWithoutReference(row);
        setOpenModalDeleteAddress(true);
        break; 
    }
  }
  const handlerShowPointWithAddressClient=(row: Address,lat:number,lng:number,sub_tet: string)=>{ 
    setCurrentAddressWithoutReference(row); 
    setOpenModalAddressGeoref(true)
    setInputSearchAddress(row.addressNormalized)
    setOpenModalContentAddress(false);
    handleClickShowMarket(lat,lng,sub_tet, 0, 0)
  }

  const handlerGetCurrentPoints = (data: any) => {
    setShowButtonGetDoors(true);
    setCurrentGeorefPoints(data);
  }

  const handlerGetDoorsByGeoref = async () => {
    console.log(currentGeorefPoints.length);
    const georef = {
      ciu_id: currentAddressWithoutReference.ciuId,
      puntos: currentGeorefPoints.map(k => { return { map_point: `${k[1]},${k[0]}` } })
    }
    const doorsResponse = await getDoorsByGeoref(georef)
    handlerSetDoorsReference(doorsResponse);
    setShowButtonGetDoors(false);
    drawPolygon!.current!.deleteAll();
  }

  const handlerSetDoorsReference = (pointsDoor: DoorsGeoref[]) => { 
    const geojsonData = {
      type: 'FeatureCollection',
      features: pointsDoor.map(point => {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: point.gps.split(',').reverse(),
          },
          properties: {
            name: 'marker1',
            imageExpr: 'market1',
            textExpr:(point.puerta.length>0 && +point.puerta>0)?point.puerta:point.manzana+'-'+point.lote  ,
            ...point
          },
        }
      })

    };
    const geoJsonSource = mapGeoref.current.getSource('src-markers');
    geoJsonSource.setData(geojsonData);
  }
  const handlerShowAddressWithReferences = (addressAutoReferences: AddressAuto[]) => { 
    if(!mapGeoref.current) return 
    const geojsonData = {
      type: 'FeatureCollection',
      features: addressAutoReferences.map(point => {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: point.coordenada_puerta.split(',').reverse(),
          },
          properties: {
            name: 'marker1',
            imageExpr: point.flag_geo==='market1'?point.flag_geo:'market1' , 
            ...point
          },
        }
      })
    };
    const geoJsonSource = mapGeoref.current.getSource('src-markers-references');
    geoJsonSource.setData(geojsonData);
  }

  const handleOpenCommands = () => setOpenCommands(true);
  const handleCloseCommands = () => setOpenCommands(false);

  const handlerDeleteAddress = async (tbad_id: number, dir_apunts: string) => {
    let addressSelected = address.filter(f => selectedGroupAddress.some(s => s == f.idAddress)).map(k => { return { dir_id: k.idAddress, dir_calle: k.streetAddress } })
    if (addressSelected.length <= 0) {
      addressSelected = [{ dir_id: currentAddressWithoutReference.idAddress, dir_calle: currentAddressWithoutReference.streetAddress }]
    }
    const data = {
      direcciones: addressSelected,
      // dir_id: currentAddressWithoutReference.idAddress,
      dir_apunts,
      tbad_id,
      tipo_ope: 2,
      id_user: authorization.userPostgreId,
    };
    await manualGeoref(data);
    setDescriptionTypeError('');
    setTypeErrorSelected(0);
    setOpenModalDeleteAddress(false);
    setSelectedGroupAddress([]);
    setCurrentAddressWithoutReference(initAddress);

  }

  const handlerSelectTypeError = (option: OptionsSelect) => {
    if (option) setTypeErrorSelected(option.value);
  }
  const handlerSelectShipper = (option: OptionsSelect | null) => {
    if (option) setShipperSelected(option.value);
  }
  const handlerSelectState = (option: OptionsSelect | null) => {
    if (option) setStateSelected(option.value);
  }
  const handlerSelectDepartament = (option: OptionsSelect | null) => {
    if (option) {
      getAllProvince(option.value);
      setDepartamentSelected(option.value)
    }

  }
  const handlerSelectProvince = (option: OptionsSelect | null) => {
    if (option) {
      getAllDistric(option.value);
      setProvinceSelected(option.value)
    }
  }
  const handlerSelectDistrict = (option: OptionsSelect | null) => {
    if (option) setDistrictSelected(option.value);
  }

  const handleAnulateAddress=(row:AddressAuto)=>{
    const data={
      idAddress:row.idAddress,
      botLogId: row.id_bot_log,
      userId: authorization.userPostgreId
    }
    anulateAddress(data)
  }

  //Use Effect
  useEffect(() => {
    if (markerRef!.current!) {
      const latLng = markerRef!.current!.getLngLat();
      const popupContent = document.createElement('div');
      const rootPopup = createRoot(popupContent);
      rootPopup.render(<AddressPopup properties={latLng} handlerOptionAddressMarket={handlerOptionAddressMarket} />);
      markerRef!.current!.setPopup(
        new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent)
      );
      updateCircle(latLng, radiusMarkerInMeters)
    }
  }, [radiusMarkerInMeters, markerPosition]);

  useEffect(() => {
    setBackdrop(true);
    getBatches(initDate, endDate, shipperSelected, stateSelected, districtSelected)
    setAddress([]);
    setAddressAuto([]);
    getListState();
    getListShipper();
    getAllDepartament();
    getListTypesErrors();
    setBackdrop(false);
  }, []);
 
  const TILES_MAP = {
    default: 'https://mt.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
    satelite: 'https://mt.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    secondary: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
  }
  const switchBaseMap = (newSource: 'default' | 'satelite' | 'secondary') => {
    if (!mapGeoref!.current!) return;

    const sourceId = 'osm-tiles';
    const layerId = 'osm-tiles-layer';

    // Si la fuente y capa ya existen, elimínalas primero
    if (mapGeoref!.current!.getLayer(layerId)) {
      mapGeoref!.current!.removeLayer(layerId);
    }
    if (mapGeoref!.current!.getSource(sourceId)) {
      mapGeoref!.current!.removeSource(sourceId);
    }

    // Agrega la nueva fuente con las tiles actualizadas
    mapGeoref!.current!.addSource(sourceId, {
      type: 'raster',
      tiles: [TILES_MAP[newSource]],
      tileSize: 256,
    });

    // Agrega la capa con la nueva fuente
    mapGeoref!.current!.addLayer({
      id: layerId,
      type: 'raster',
      source: sourceId,
      minzoom: 0,
    });
    const layers = mapGeoref!.current!.getStyle().layers;
    if (layers && layers.length > 0) {
      mapGeoref!.current!.moveLayer(layerId, layers[0].id); // Mover debajo de la primera capa existente
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
        center: [-77.07954854547359, -12.042083040537804],
        zoom: 12,
      });
      mapGeoref!.current = map;

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
        keybindings: false,
        touchEnabled: false,
      });
      drawPolygon.current = draw;

      map.on('load', async () => {
        const proms: Promise<void>[] = [];
        const markerVehicule = [
          { code: 'market1', url: Marker1 },
          { code: 'market2', url: Marker2 },
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
        map.addSource('src-markers-references', {
          type: 'geojson',
          data: null,
        });
        // Añadir el layer de símbolos al mapa
        map.addLayer({
          id: 'lyr-markers-symbols-references',
          type: 'symbol',
          source: 'src-markers-references', // Fuente que acabamos de añadir
          layout: {
            visibility: 'visible',
            'icon-image': ['get', 'imageExpr'], // Obtiene el icono de la propiedad 'imageExpr'
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

      });


      // Agregar el evento de clic para el layer de Direcciones con referencia
      map.on('click', 'lyr-markers-symbols-references', (e) => {
        // Obtener las coordenadas del punto clicado
        const coordinates = e.features[0].geometry.coordinates.slice();

        // Obtener las propiedades asociadas al marcador
        const properties = e.features[0].properties as any;
        // Crear el contenido del popup
        const popupContent = `
          <div class="m-1 p-2 border rounded-lg">
            <p class="text-purple-500 border-b-2">Calle: <span class="font-bold text-black-2"> ${properties.streetAddress}</span></p>
            <p class="text-purple-500 border-b-2">Distrito: <span class="font-bold text-black-2"> ${properties.distric}</span></p>
            <p class="text-purple-500 border-b-2">Bloque: <span class="font-bold text-black-2"> ${properties.blockAddress}</span></p>
            <p class="text-purple-500 border-b-2">Lote: <span class="font-bold text-black-2"> ${properties.loteAddress}</span></p>
            <p class="text-purple-500 border-b-2">Manzana: <span class="font-bold text-black-2"> ${properties.mzaAddress}</span></p>
            <p class="text-purple-500 border-b-2">Número: <span class="font-bold text-black-2"> ${properties.numberAddress}</span></p>
            <p class="text-purple-500 border-b-2">Dir.Norm.: <span class="font-bold text-black-2"> ${properties.addressNormalized}</span></p>
          </div>
        `;

        // Crear y mostrar el popup
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(popupContent)
          .addTo(map);
      });



      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      // Agregar eventos de ratón para la capa de símbolos
      map.on('mouseenter', 'lyr-markers-symbols', (e) => {
        // Cambiar el cursor del ratón a un puntero cuando está sobre un símbolo
        map.getCanvas().style.cursor = 'pointer';

        // Asegúrate de que haya una característica bajo el puntero
        if (e.features.length > 0) {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = `<p class='text-dark'> ${e.features[0].properties.textExpr}</p>`; // Aquí pones lo que deseas mostrar

          // Ajustar las coordenadas para evitar el salto del popup
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          // Configurar el popup y añadirlo al mapa
          popup.setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
        }
      });

      map.on('mouseleave', 'lyr-markers-symbols', () => {
        // Restablecer el cursor cuando no está sobre un símbolo
        map.getCanvas().style.cursor = '';

        // Eliminar el popup
        popup.remove();
      }); 
      map.on('draw.create', (e) => {
        handlerGetCurrentPoints(e.features[0].geometry.coordinates[0]);

      });

      // Evento para detectar clic en una geocerca
      map.on('contextmenu', 'lyr-markers-symbols', (e) => {
        const properties = e.features?.[0].properties as DoorsGeoref;
        setCurrentSelectedDoor(
          {
            direccion: properties.direccion,
            geo_id: properties.geo_id,
            gps: properties.gps,
            puerta: properties.puerta,
            manzana: properties.manzana,
            lote: properties.lote,
          }
        )
      });

      map.addControl(draw, 'top-left');
      // Add zoom controls 
      return () => map.remove();
    }
  }, []);


  return {
    mapContainer,
    openDrawerBatch,
    setOpenDrawerBatch,
    toggleDrawerBatch,
    batches,
    address,
    getBatches,
    handlerSearchAddressWithoutReference,
    initDate,
    setInitDate,
    endDate,
    setEndDate,
    setAddress,
    searchAddres,
    markerRef,
    mapGeoref,
    handleClickShowMarket,
    actionsCommands,
    openCommands,
    handleOpenCommands,
    handleCloseCommands,
    handlerClickShowCommands,
    openModalAddress,
    openModalAddressGeoref,
    setOpenModalAddress,
    buttonActionAddress,
    openModalContentAddress,
    setOpenModalContentAddress,
    currentAddressWithoutReference,
    inputSearchAddress,
    showButtonGetDoors,
    handlerGetDoorsByGeoref,
    handlerManualGeoref,
    handlerManualGeorefModal,
    addressGeoredSelected,
    currentSelectedDoor,
    handlerSelectShipper,
    handlerSelectState,
    shippers,
    states,
    shipperSelected,
    stateSelected,
    districtSelected,
    departament,
    province,
    district,
    handlerSelectDepartament,
    handlerSelectProvince,
    handlerSelectDistrict,
    openModalDeleteAddress,
    setOpenModalDeleteAddress,
    handlerDeleteAddress,
    typesErrors,
    handlerSelectTypeError,
    typeErrorSelected,
    descriptionTypeError,
    setDescriptionTypeError,
    selectedGroupAddress,
    setSelectedGroupAddress,
    provinceSelected,
    departamentSelected,
    radiusMarkerInMeters,
    setRadiusMarkerInMeters,
    currentStyleMap,
    switchBaseMap,
    handlerShowPointWithAddressClient,
    handlerSearchAddressWithReference,
    addressAuto,
    openModalWthReferencesAddress, 
    setOpenModalWthReferencesAddress,
    handlerShowAddressWithReferences,
    handleMoveCamera,
    getListDataClient,
    listDataClient,
    currentDistrict,
    listDistrictSearch,
    searchDistrict,
    setCurrentDistrict,
    setListDistrictSearch,
    handleAnulateAddress
  }
}

export default useGeoref;