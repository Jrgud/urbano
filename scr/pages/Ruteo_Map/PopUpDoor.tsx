import * as React from 'react';  
import { Autocomplete, Box, Button,  Divider, Grid,   Modal,   styled, Tab, Table, TableBody, TableCell,   TableHead, TableRow, Tabs, TextField } from '@mui/material'; 

import EditIcon from '@mui/icons-material/Edit';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Controller, useForm } from 'react-hook-form';
import { useZoneMapStore } from '../../store/map/zone/zoneManagement.store';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import TrackChangesIcon from '@mui/icons-material/TrackChanges'; 
interface RouteDictionary {
  geo_id: number;
  id_inventario: number;
  direccion: string 
  tipo:number
  ciu_id:number
}
interface OptionZoneProps {
    properties:any;
    onSubmit: (option: any ) => void; 
    optionInventory: (option: any) => Promise<number>;
    handlerDeleteAddresFromDictionary: (id_inventario: number) => void;
    setModalPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handlerDeleteDoors: (geoId: number) => Promise<void>;
}
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
 
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const PopupDoor: React.FC<OptionZoneProps>= ({ properties:initialProperties,onSubmit,optionInventory,handlerDeleteAddresFromDictionary,setModalPopupOpen,handlerDeleteDoors }) => { 
    const [value, setValue] = React.useState(0);
    const [properties, setProperties] = React.useState(initialProperties);
    const  departamentos=useZoneMapStore(state=>state.departament);
    const  getAllDepartament= useZoneMapStore(state=>state.getAllDepartament);

    const  provincias= useZoneMapStore(state=>state.province);
    const  getAllProvince= useZoneMapStore(state=>state.getAllProvince);

    const  distritos= useZoneMapStore(state=>state.district);
    const  getAllDistric= useZoneMapStore(state=>state.getAllDistric);
    const [fromInventory,setFromInventory]=React.useState({
        form_calle_inventario:'',
        form_id_inventario:0,
        form_geo_id:0,
        tipo:0,
        ciu_id:0
    })
    const [dictionary,setDictionary]=React.useState(JSON.parse(properties.diccionario))
    const [inventory,setInventory]=React.useState(JSON.parse(properties.inventario))

    const { control, handleSubmit, reset,formState: { errors } } = useForm({
        defaultValues: {...initialProperties, calle_inventario: fromInventory.form_calle_inventario},
      });
    React.useEffect(() => { 
        getAllDepartament();  
        if(initialProperties.prv_id){
        getAllProvince(initialProperties.dep_id)
        }
        if(initialProperties.prv_id){
        getAllDistric(initialProperties.prv_id)
        }
        reset({...initialProperties, calle_inventario: fromInventory.form_calle_inventario});
    }, [initialProperties, reset,fromInventory]);
 
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const handleFormSubmit = (data: any) => {
        setProperties(data); // Actualiza el estado de 'properties'
        onSubmit(data); // Llama la función onSubmit con los datos actualizados
    };

    const handleFormSubmitInventary = async(data: any) => {
        

        const dictionaryId= await optionInventory({
            direccion:data.calle_inventario,
            id_inventario:fromInventory.form_id_inventario,
            geo_id:fromInventory.form_geo_id,
            tipo:fromInventory.tipo,
            ciu_id:fromInventory.ciu_id
        }); // Llama la función onSubmit con los datos actualizados
        setModalInventory(false)
        setDictionary(prev=>[...prev,{id_diccionario:dictionaryId,calle_diccionario:data.calle_inventario}])
        setInventory(prev=>prev.filter(f=>f.id_inventario!==fromInventory.form_id_inventario))
    };
    const handlerDeleteInventory=(data:any)=>{
        setInventory(prev=>prev.filter(f=>f.id_inventario!==data.id_inventario))
        optionInventory({
            direccion:data.direccion,
            id_inventario:data.id_inventario,
            geo_id:data.geo_id,
            tipo:data.tipo,
            ciu_id:data.ciu_id
        }); 
    }
    const handlerDeleteDictionary=(id_diccionario:number)=>{
        setDictionary(prev=>prev.filter(f=>f.id_diccionario!==id_diccionario))
        handlerDeleteAddresFromDictionary(id_diccionario)
    }
    const handlerDeleteDoor=()=>{
        setModalPopupOpen(false)
        handlerDeleteDoors(properties.geo_id)
        // properties.geo_id
    }


    const validateNotZero = (value: number) => value !== 0 || 'Debe selecionar un vallor valido';
    const [modalInventory,setModalInventory]=React.useState(false)
    
    const  handlerOpenModalDoorInventory=(inventory:RouteDictionary)=>{
        console.log(inventory);
        setModalInventory(true)
        setFromInventory({
            form_calle_inventario:inventory.direccion,
            form_id_inventario:inventory.id_inventario,
            form_geo_id:inventory.geo_id,
            tipo:inventory.tipo,
            ciu_id:inventory.ciu_id
        })
    }
    const handlerShowStreetView=()=>{
        const [lat,lng]=properties.gps.split(',')
        const streetViewUrl = `https://www.google.com/maps/embed?pb=!4v1572951718108!6m8!1m7!1sCAoSLEFGMVFpcFB3YUlBaTh3d1lCWnFZQ01uRTBNRUxUam5od0JCUWlyTzY5aEZi!2m2!1d${lat.trim()}!2d${lng.trim()}!3f75!4f0!5f0.7820865974627469}`;
        console.log(streetViewUrl)
        // Abre la URL en una ventana flotante
        window.open(streetViewUrl, '_blank', 'width=800,height=600');
    }
    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{ p: 3 }}>
                <div>{children}</div>
              </Box>
            )}
          </div>
        );
    }

    return  (
        <>
        <Box  className='p-3' >
            <div className='flex justify-center items-center gap-1'>
                <p className='text-base  font-bold text-center'>Puerta: { properties.textExpr} {'('+(JSON.parse(properties.zonas) ).map(k=>k.zona_codigo).join('-')+')'}</p> 
                <button 
                    type='button' 
                    onClick={()=>handlerShowStreetView()}
                    className=' ms-3 p-1 bg-green-600 text-center font-bold hover:bg-green-700  text-white rounded-lg'>
                    <TrackChangesIcon/>
                </button>
                <button 
                    type='button' 
                    onClick={()=>handlerDeleteDoor()}
                    className=' ms-3 p-1 bg-red-600 text-center font-bold hover:bg-red-700  text-white rounded-lg'>
                    <DeleteIcon/>
                </button>

            </div>
            <Tabs value={value} onChange={handleChange} aria-label="options">
                <Tab icon={<RemoveRedEyeIcon />} aria-label="show" />
                <Tab icon={<EditIcon />} aria-label="edit" />
                <Tab icon={<FormatListBulletedIcon />} aria-label="list" />
            </Tabs>
            <TabPanel value={value} index={0} >
                <div style={{maxWidth:600, padding:'0px !important',margin:'0px !important'}}>
                    <div className='text-base'><strong>Calle:</strong> {properties.calle} </div>
                    <Divider></Divider>
                    <div className='text-base'><strong>Puerta:</strong> {properties.nro_puerta} </div>
                    <Divider></Divider>
                    <div className='text-base'><strong>Urbanización:</strong> {properties.urbanizacion} </div> 
                    <Divider></Divider>
                    <div className='text-base'><strong>Bloque:</strong> {properties.bloque} </div>
                    <Divider></Divider>
                    <div className='text-base'><strong>Manzana:</strong> {properties.manzana} </div>
                    <Divider></Divider>
                    <div className='text-base'><strong>Lote:</strong> {properties.lote} </div>
                    <Divider></Divider>
                    <div className='text-base hidden'><strong>Referencia:</strong> {properties.referencia} </div>
                    {/* <Divider></Divider> */}
                    <div className='text-base'><strong>Dirección:</strong> {properties.direccion} </div>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <form onSubmit={handleSubmit(handleFormSubmit)} style={{overflowY:'scroll'}}>
                    <Grid container spacing={2} sx={{maxWidth:600,maxHeight:400,paddingTop:1}} >   
                        {/* Select para Departamento */}
                        <Grid item xs={12} sm={6}>
                        <Controller
                            name="dep_id"
                            control={control}
                            rules={{ required: 'El departamento es obligatorio',validate:validateNotZero }} 
                            render={({ field }) => (
                                <Autocomplete
                                {...field}
                                disabled
                                size="small"
                                options={departamentos.data}
                                getOptionLabel={(option) => option?.label || ''}
                                value={departamentos.data.find((d) => d.value === field.value) || null}
                                onChange={(_, data) =>{
                                    field.onChange(data?.value??'')
                                    getAllProvince(data?.value)
                                } }
                                
                                isOptionEqualToValue={(option, value) => option.value === value}
                                renderInput={(params) => (
                                <TextField 
                                {...params} 
                                label="Departamento" 
                                variant="outlined" 
                                error={!!errors.dep_id} // Si hay error, cambia el estado a error
                                helperText={errors.dep_id?.message?.toString() || ''}
                                fullWidth />
                                )}
                            />
                            )}
                        />
                        </Grid> 
                        {/* Select para Provincia */}
                        <Grid item xs={12} sm={6}>
                        <Controller
                            name="prv_id"
                            control={control} 
                            rules={{ required: 'La provincia es obligatoria',validate:validateNotZero }}
                            render={({ field }) => (
                                <Autocomplete
                                {...field}
                                disabled
                                size="small"
                                options={provincias.data}
                                getOptionLabel={(option) => option?.label || ''}
                                value={provincias.data.find((d) => d.value === field.value) || null}
                                onChange={(_, data) => {
                                    field.onChange(data?.value??'')
                                    getAllDistric(data?.value)
                                }}
                                isOptionEqualToValue={(option, value) => option.value === value}
                                renderInput={(params) => (
                                <TextField 
                                {...params} 
                                label="Provincia" 
                                variant="outlined" 
                                error={!!errors.prv_id} // Si hay error, cambia el estado a error
                                helperText={errors.prv_id?.message?.toString() || ''}
                                fullWidth />
                                )}
                            />
                            )}
                        />
                        </Grid> 
                        {/* Select para Distrito */}
                        <Grid item xs={12} sm={6}>
                        <Controller
                            name={distritos.name}
                            control={control} 
                            rules={{ required: 'El distrito es obligatorio' ,validate:validateNotZero}}
                            render={({ field }) => (
                                <Autocomplete
                                {...field}
                                disabled
                                size="small"
                                options={distritos.data}
                                getOptionLabel={(option) => option?.label || ''}
                                onChange={(_, data) => field.onChange(data?.value??'')}
                                value={distritos.data.find((d) => d.value === field.value) || null}
                                isOptionEqualToValue={(option, value) => option.value === value}
                                renderInput={(params) => (
                                <TextField 
                                {...params} 
                                label="Distrito" 
                                variant="outlined" 
                                error={!!errors.ciu_id} // Si hay error, cambia el estado a error
                                helperText={errors.ciu_id?.message?.toString() || ''}
                                fullWidth />
                                )}
                            />
                            )}
                        />
                        </Grid>  
                        <Grid item xs={12} sm={6}>
                        <Controller
                            name="nro_puerta"
                            control={control}
                            render={({ field }) => (
                            <TextField 
                            {...field} 
                            size="small"
                            label="Puerta" 
                            variant="outlined" 
                            
                            fullWidth />
                            )}
                        />
                        </Grid> 
                        <Grid item xs={12} sm={6}>
                        <Controller
                            name="urbanizacion"
                            control={control}
                            render={({ field }) => (
                            <TextField 
                            size="small"
                            {...field} 
                            label="Urbanización"  
                            variant="outlined" 
                            fullWidth />
                            )}
                        />
                        </Grid> 
                        <Grid item xs={12} sm={6}>
                        <Controller
                            name="bloque" 
                            control={control}
                            render={({ field }) => (
                            <TextField 
                            {...field} 
                            size="small"
                            label="Bloque" 
                            variant="outlined" 
                            fullWidth />
                            )}
                        />
                        </Grid> 
                        <Grid item xs={12} sm={6}>
                        <Controller
                            name="manzana"
                            control={control}
                            render={({ field }) => (
                            <TextField 
                            {...field} 
                            size="small"
                            label="Manzana"  
                            variant="outlined" 
                            fullWidth />
                            )}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <Controller
                            name="lote"
                            control={control}
                            render={({ field }) => (
                            <TextField 
                            size="small"
                            {...field} 
                            label="Lote"  
                            variant="outlined" 
                            fullWidth />
                            )}
                        />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                        <Controller
                            name="calle"
                            control={control}
                            render={({ field }) => (
                            <TextField 
                            size="small"
                            {...field} 
                            label="Calle" 
                            variant="outlined" 
                            fullWidth 
                            />
                            )}
                        />
                        </Grid> 
                        <Grid item xs={12} sm={6} className='hidden'>
                        <Controller
                            name="referencia"
                            control={control} 
                            render={({ field }) => (
                            <TextField 
                            {...field} 
                            size="small"
                            label="Referecencia"  
                            variant="outlined" 
                            fullWidth />
                            )}
                        />
                        </Grid> 
                        <Grid item xs={12} sm={12} className='hidden'>
                        <Controller
                            name="direccion"
                            control={control} 
                            render={({ field }) => (
                            <TextField 
                            {...field} 
                            size="small"
                            label="Dirección"  
                            variant="outlined" 
                            fullWidth />
                            )}
                        />
                        </Grid> 
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </TabPanel>
            <TabPanel value={value} index={2}> 
            <Grid container spacing={2} sx={{maxWidth:700}} style={{overflowY:'scroll'}} > 
                <Grid item xs={12} sm={6} sx={{ maxHeight: 400 }}>
                    <Table    size="small" aria-label="sticky  table" >
                        <TableHead>
                        <TableRow className="bg-black-2"> 
                            <TableCell   align="left" style={{ width: '90%' }}> <p className='text-white'>Diccionario</p> </TableCell > 
                            <TableCell  align="center" style={{ width: '10%' }}> <SettingsApplicationsIcon className='text-white'/> </TableCell > 
                        </TableRow>
                        </TableHead>
                        <TableBody> 
                            {dictionary.map((k,i)=>
                                (<StyledTableRow  key={i} > 
                                    <TableCell  align="left">{k.calle_diccionario}</TableCell >
                                    <TableCell  align="right"> 
                                        <Button 
                                        className='hover:bg-primary hover:text-white' 
                                        onClick={()=>handlerDeleteDictionary(k.id_diccionario)}>
                                        <DeleteIcon/>
                                        </Button>   
                                    </TableCell >
                                </StyledTableRow> )
                            )} 
                        </TableBody>
                    </Table>  
                </Grid>
                <Grid item xs={12} sm={6} sx={{ maxHeight: 400 }}>
                    <Table  aria-label="sticky  table" size="small">
                        <TableHead>
                        <TableRow className="bg-black-2"> 
                            <TableCell  align="left" style={{ width: '90%' }}><p className='text-white'>Inventario</p> </TableCell > 
                            <TableCell  align="center" style={{ width: '10%' }}> <SettingsApplicationsIcon className='text-white'/> </TableCell > 
                        </TableRow>
                        </TableHead>
                        <TableBody> 
                        {inventory.map((k,i)=>
                            (<StyledTableRow  key={i} > 
                                <TableCell  align="left">{k.calle_inventario}</TableCell >
                                <TableCell  align="right">
                                    <Button 
                                        className='hover:bg-primary hover:text-white' 
                                        onClick={()=>handlerOpenModalDoorInventory({geo_id: properties.geo_id, id_inventario: k.id_inventario,  direccion: k.calle_inventario ,tipo:2,ciu_id:properties.ciu_id })}>  
                                        <ReplyIcon/>
                                    </Button>
                                    <Button 
                                    className='hover:bg-primary hover:text-white' 
                                    onClick={()=>handlerDeleteInventory({geo_id: properties.geo_id, id_inventario: k.id_inventario,  direccion: k.calle_inventario,tipo:1 ,ciu_id:properties.ciu_id})}>
                                    <DeleteIcon/>
                                    </Button>   
                                </TableCell >
                            </StyledTableRow> )
                        )} 
                        </TableBody>
                    </Table> 
                </Grid>
            </Grid>
            </TabPanel>
        </Box>
        <Modal
          open={modalInventory}
          onClose={() => setModalInventory(false)}
          aria-labelledby="popup-modal"
        >
            <Box className="bg-white p-3"  sx={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-35%, -50%)'}} >
            <p className='text-base  font-bold text-center'>Mover a diccionario</p> 
                <form onSubmit={handleSubmit(handleFormSubmitInventary)}  >
                    <Grid container spacing={2} sx={{minWidth:600, paddingTop:1}} >   
                        <input type="hidden" name="geo_id" value={fromInventory.form_geo_id} /> 
                        <input type="hidden" name="id_inventario" value={fromInventory.form_id_inventario} /> 
                        <input type="hidden" name="tipo" value={fromInventory.tipo} /> 
                        <Grid item xs={12} sm={12} >
                        <Controller
                            name="calle_inventario"
                            rules={{ required: 'La dirreción  debe ser obligatoria',
                                    minLength: {
                                        value: 10, 
                                        message: 'La dirección debe tener al menos 10 caracteres'
                            } }}
                            control={control} 
                            render={({ field }) => (
                            <TextField 
                            {...field} 
                            size="small"
                            label="Dirección"  
                            variant="outlined"  
                            multiline
                            // value={fromInventory.form_calle_inventario}
                            error={!!errors.calle_inventario} // Si hay error, cambia el estado a error
                            helperText={errors.calle_inventario?.message?.toString() || ''}
                            fullWidth />
                            )}
                        />
                        </Grid> 
                        <Grid item xs={12}>
                            <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"  
                            fullWidth>
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
        </>
    ); 
}
export default PopupDoor