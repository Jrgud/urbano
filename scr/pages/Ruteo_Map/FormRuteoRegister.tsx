import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Autocomplete, Grid } from '@mui/material';
import { useZoneMapStore } from '../../store/map/zone/zoneManagement.store';
 

interface SelectWithSearchProps {
  initialValues:any;
  onSubmit: (option: any ) => void; 
}


const MyForm: React.FC<SelectWithSearchProps>  = ({ initialValues, onSubmit }) => {
     
  const  departamentos=useZoneMapStore(state=>state.departament);
  const  getAllDepartament= useZoneMapStore(state=>state.getAllDepartament);

  const  provincias= useZoneMapStore(state=>state.province);
  const  getAllProvince= useZoneMapStore(state=>state.getAllProvince);

  const  distritos= useZoneMapStore(state=>state.district);
  const  getAllDistric= useZoneMapStore(state=>state.getAllDistric);

  const  listTypeZone= useZoneMapStore(state=>state.listTypeZone);

  const  tiposZona= useZoneMapStore(state=>state.type_zone);  

  const { control, handleSubmit, reset,formState: { errors } } = useForm({
    defaultValues: initialValues,
  });
 
  const validateNotZero = (value: number) => value !== 0 || 'Debe selecionar un vallor valido';
 
  useEffect(() => {
    getAllDepartament();  
    listTypeZone();   
    if(initialValues.prv_id){
      getAllProvince(initialValues.dep_id)
    }
    if(initialValues.prv_id){
      getAllDistric(initialValues.prv_id)
    }
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {/* Input Hidden para Zona ID */}
        <input type="hidden" name="zona_id" value={initialValues.zona_id} />

        {/* Select para Departamento */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="dep_id"
            control={control}
            rules={{ required: 'El departamento es obligatorio',validate:validateNotZero }} 
            render={({ field }) => (
              <Autocomplete
                {...field}
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

        {/* Select para Tipo de Zona */}
        <Grid item xs={12} sm={6}>
          <Controller
            name={tiposZona.name}
            control={control}
            rules={{ required: 'El tipo de zona es obligatorio',validate:validateNotZero }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={tiposZona.data}
                getOptionLabel={(option) => option?.label || ''}
                value={tiposZona.data.find((d) => d.value === field.value) || null}
                onChange={(_, data) => field.onChange(data?.value)}
                renderInput={(params) => (
                  <TextField 
                  {...params} 
                  label="Tipo de Zona" 
                  variant="outlined" 
                  fullWidth 
                  error={!!errors.zona_tipo} // Si hay error, cambia el estado a error
                  helperText={errors.zona_tipo?.message?.toString() || ''}
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* Input para Código de Geocerca */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="zona_codigo"
            control={control}
            rules={{
              required: 'El código de geocerca es obligatorio',
              minLength: {
                value: 4,
                message: 'El código debe tener más de 4 caracteres',
              },
              maxLength: {
                value: 8,
                message: 'El código debe tener menos de 8 caracteres',
              },
            }} 
            render={({ field }) => (
              <TextField 
              {...field} 
              label="Código de Geocerca" 
              variant="outlined" 
              error={!!errors.zona_codigo} // Si hay error, cambia el estado a error
              helperText={errors.zona_codigo?.message?.toString() || ''}
              fullWidth />
            )}
          />
        </Grid>

        {/* Input para Descripción */}
        <Grid item xs={12} sm={6}>
          <Controller
            rules={{ required: 'La descripción de la zona es obligatorio' }}
            name="zona_descri"
            control={control}
            render={({ field }) => (
              <TextField 
              {...field} 
              label="Descripción" 
              variant="outlined" 
              fullWidth 
              error={!!errors.zona_descri} // Si hay error, cambia el estado a error
              helperText={errors.zona_descri?.message?.toString() || ''}
              />
            )}
          />
        </Grid>

        {/* Input para Color */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="zona_color"
            control={control}
            rules={{ required: 'El color de la zona es obligatorio' }}
            render={({ field }) => (
              <TextField 
              {...field} 
              label="Color" 
              type="color" 
              variant="outlined" 
              error={!!errors.zona_color} // Si hay error, cambia el estado a error
              helperText={errors.zona_color?.message?.toString() || ''}
              fullWidth />
            )}
          />
        </Grid>

        {/* Botón de Guardar */}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Guardar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default MyForm;
