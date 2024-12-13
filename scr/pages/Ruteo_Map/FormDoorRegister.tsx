import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Autocomplete, Grid, Modal, Box, IconButton } from '@mui/material';
import { useZoneMapStore } from '../../store/map/zone/zoneManagement.store';
import CloseIcon from '@mui/icons-material/Close'; 


interface SelectWithSearchProps {
  initialValues?:any;
  onSubmit: (option: any ) => void; 
  setOpenFormDoorValues: (option: any ) => void;  
  open:boolean;
}


const FormDoorRegister: React.FC<SelectWithSearchProps>  = ({ initialValues={}, onSubmit,open,setOpenFormDoorValues }) => {
     
  const  departamentos=useZoneMapStore(state=>state.departament);
    const  getAllDepartament= useZoneMapStore(state=>state.getAllDepartament);

    const  provincias= useZoneMapStore(state=>state.province);
    const  getAllProvince= useZoneMapStore(state=>state.getAllProvince);

    const  distritos= useZoneMapStore(state=>state.district);
    const  getAllDistric= useZoneMapStore(state=>state.getAllDistric); 

    const { control, handleSubmit, reset,formState: { errors } } = useForm({
        defaultValues: initialValues,
    });
 
  const validateNotZero = (value: number) => value !== 0 || 'Debe selecionar un vallor valido'; 
  useEffect(() => {
    getAllDepartament();  
    if(initialValues.prv_id){
      getAllProvince(initialValues.dep_id)
    }
    if(initialValues.prv_id){
      getAllDistric(initialValues.prv_id)
    }
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <Modal  
          open={open}
          // onClose={handlerCloseModalGeocerca}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="bg-white" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',  width: 400 }}>
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
                <h3 className="font-medium text-black dark:text-white">Configuración Puerta </h3>
                <IconButton color="primary" aria-label="add to shopping cart" onClick={()=>setOpenFormDoorValues(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="p-6.5">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="hidden" name="gps" value={initialValues.gps} />
                        <input type="hidden" name="geo_id" value={initialValues.geo_id} />
                        <Grid container spacing={2}  >   
                            {/* Select para Departamento */}
                            <Grid item xs={12} sm={6}>
                            <Controller
                                name="dep_id"
                                control={control}
                                rules={{ required: 'El departamento es obligatorio',validate:validateNotZero }} 
                                render={({ field }) => (
                                    <Autocomplete
                                    {...field} 
                                    size="small"
                                    disabled
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
                                    size="small"
                                    disabled
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
                                    size="small"
                                    disabled
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
                            <Grid item xs={12} sm={6} class="hidden">
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
                  </div>
              </div> 
          </Box>
        </Modal>  
    
  );
};

export default FormDoorRegister;
