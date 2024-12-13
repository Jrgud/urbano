import * as React from 'react';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup'; 
import Switch from '@mui/material/Switch';
import { useZoneMapStore } from '../../store/map/zone/zoneManagement.store';
import SelectWithSearch from '../../components/Forms/SelectGroup/SelectSearch';
import { Button, Grid } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DrawIcon from '@mui/icons-material/Draw';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import { PolygonDistrict } from '../../interfaces/map/zone.interface';


interface Options{
  zoomMap:number;
  onSelectedDistricZone: (option: any | null) => void;
  onClickSearch: ( typeZone:number) => void;
  handlerSwitchShowLayer:(value:boolean)=>void; 
  handlerSwitchShowDoors:(value:boolean)=>void; 
  showLayerPolygonDistict: boolean
  setShowLayerPolygonDistict: React.Dispatch<React.SetStateAction<boolean>>
  handlerChangeModeEdit: () => void;
  addMarkerAddAddress: () => void;
  polygonDistrict: PolygonDistrict;
  stateTypeZone: number;
  setStateTypeZone: React.Dispatch<React.SetStateAction<number>>;
}

const LeyerRouting:React.FC<Options>=({zoomMap,stateTypeZone,setStateTypeZone,polygonDistrict,addMarkerAddAddress,onSelectedDistricZone,onClickSearch,handlerSwitchShowLayer,handlerSwitchShowDoors,handlerChangeModeEdit,showLayerPolygonDistict,setShowLayerPolygonDistict })=> {
  
  const  departaments=useZoneMapStore(state=>state.departament);
  const  getAllDepartament= useZoneMapStore(state=>state.getAllDepartament);

  const  province= useZoneMapStore(state=>state.province);
  const  getAllProvince= useZoneMapStore(state=>state.getAllProvince);

  const  district= useZoneMapStore(state=>state.district);
  const  getAllDistric= useZoneMapStore(state=>state.getAllDistric);
  
  const  tiposZona= useZoneMapStore(state=>state.type_zone_all);  
  const  listTypeWithAllZone= useZoneMapStore(state=>state.listTypeWithAllZone);

  const handleSelectDepartament = (option: { label: string; value: number } | null) => {
    if(option)  getAllProvince(option.value);
  };
  const handleSelectDistrict = (option: { label: string; value: number } | null) => {
    if(option) getAllDistric(option.value);
  }; 

  const [state, setState] = React.useState({
    layer: true,
    door: true, 
  }); 
  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };
  const handlerSendDistricSelected=(option: { label: string; value: number } | null)=>{
    onSelectedDistricZone(option?.value);
  }
  const handlerSendTypeZoneSelected=(option: { label: string; value: number } | null)=>{
   if(option) setStateTypeZone(option?.value);
  }
  React.useEffect(()=>{
    getAllDepartament(); 
    listTypeWithAllZone(); 
  },[]);

  return (
    <>
      <div className='grid grid-cols-2 gap-1 mb-4'>
          <Button disabled={!(polygonDistrict.puntos.length>0)} variant="contained" endIcon={<DrawIcon />} color='warning'  onClick={handlerChangeModeEdit}>
            Dibujar Zona
          </Button>
          <Button disabled={!(polygonDistrict.puntos.length>0)} variant="contained" endIcon={<RoomPreferencesIcon />} color='success'  onClick={addMarkerAddAddress}>
            Agregar Puerta
          </Button>
      </div>
      <Grid container spacing={2} className='mb-2'>
        <Grid item xs={4}> 
          <FormControl component="fieldset" variant="standard">
            <FormGroup> 
              <FormLabel component="legend">Zonas</FormLabel>
              <Switch size="small" checked={state.layer} onChange={(e)=>{handleChange(e),handlerSwitchShowLayer(!state.layer)}} name="layer" />
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid item xs={4}> 
          <FormControl component="fieldset" variant="standard">
            <FormGroup> 
              <FormLabel component="legend">Puertas</FormLabel>
              <Switch size="small" checked={state.door} onChange={(e)=>{handleChange(e),handlerSwitchShowDoors(!state.door)}} name="door" />
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid item xs={4}> 
          <FormControl component="fieldset" variant="standard">
            <FormGroup> 
              <FormLabel component="legend">Distrito</FormLabel>
              <Switch size="small" checked={showLayerPolygonDistict} onChange={(e)=>{setShowLayerPolygonDistict(!showLayerPolygonDistict)}} name="pollygonDisctrict" />
            </FormGroup>
          </FormControl>
        </Grid>  
      </Grid>
      <div className="flex flex-col gap-2">
        <FormControl fullWidth>
          <SelectWithSearch options={departaments} onOptionSelect={handleSelectDepartament} />
        </FormControl>
        <FormControl fullWidth>
          <SelectWithSearch options={province} onOptionSelect={handleSelectDistrict} />
        </FormControl>
        <FormControl fullWidth>
          <SelectWithSearch options={district} onOptionSelect={handlerSendDistricSelected} />
        </FormControl> 
        <FormControl fullWidth>
          <SelectWithSearch options={tiposZona} onOptionSelect={handlerSendTypeZoneSelected} defaultValue={stateTypeZone} />
        </FormControl> 
        <FormControl fullWidth>
        <Button variant="contained" endIcon={<MyLocationIcon />} onClick={()=>{setState({...state, ['layer']: true,['door']: true, }),onClickSearch(stateTypeZone)}}>
          Buscar
        </Button>
        </FormControl> 
      </div> 
    </>
  );
}

export default LeyerRouting ;