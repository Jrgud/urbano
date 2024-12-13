import { useEffect, useState } from 'react'; 
import {
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import TableGroup from '../../components/PreRuta/TableGroup';
import { usePreRutaStore } from '../../store/pre-ruta/preruta.store';
import SelectWithSearch from '../../components/Forms/SelectGroup/SelectSearch';
import { OptionsSelect } from '../../interfaces/general/general.interfaces';

type  SearchFormType = {
    agencyId:number
    areaId:number
    date:string
}

const PreRutaDelDia  = () => { 
    //CONST
    const currentDate=new Date().toISOString().substr(0, 10);
    //CONST
    
    //STORE ZUSTAND
    //PRE RUTA STORE
    const getAgencies=usePreRutaStore(state=>state.getAgencies)
    const getAreas=usePreRutaStore(state=>state.getAreas)
    const getGroupBatches=usePreRutaStore(state=>state.getGroupBatches)
    const getGroupBatchesDetail=usePreRutaStore(state=>state.getGroupBatchesDetail)
    const groupBatchDetail=usePreRutaStore(state=>state.groupBatchDetail)
    const groupBatch=usePreRutaStore(state=>state.groupBatch)
    const area=usePreRutaStore(state=>state.area)
    const agency=usePreRutaStore(state=>state.agency)
    //PRE RUTA STORE
    //STORE ZUSTAND
    
    //HOOKS REACT
    const [searchForm, setSearchForm] = useState<SearchFormType>({
        agencyId:1,
        areaId:1,
        date:currentDate
    }); 
    useEffect(() => { 
        getAgencies()
        getAreas()
    }, []);
    //HOOKS REACT

    //HANDLERS
    const handletChangeSearchForm=(option:OptionsSelect|null,name:string)=>{
        setSearchForm({...searchForm,[name]:option?.value})
    }
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        getGroupBatches({
            agencia_id: searchForm.agencyId,
            area_id: searchForm.areaId,
            fecha: searchForm.date
        })
    };
    //HANDLERS

    return (
        <>
            <form onSubmit={ onSubmit} className='grid grid-flow-col-dense gap-2 align-middle bg-white rounded-lg p-2'  >
                <SelectWithSearch options={agency} onOptionSelect={(option)=>handletChangeSearchForm(option,'agencyId')} defaultValue={1} />
                <SelectWithSearch options={area} onOptionSelect={(option)=>handletChangeSearchForm(option,'areaId')} defaultValue={1} />
                    <TextField
                    error={false}
                    size='small'
                        type='date'
                        id="outlined-error-helper-text"
                        label="Fecha"
                        defaultValue={searchForm.date}
                    onChange={(e)=>setSearchForm({...searchForm,date:e.target.value})}
                    // helperText="no ingreso la fecha"
                    />
                <Button variant="contained" color="primary" type="submit">
                    Buscar
                </Button>
            </form>
            <div className='bg-white w-full h-full mt-2 rounded-lg p-2'>
                <TableGroup 
                    groupBatch={groupBatch} 
                    getGroupBatchesDetail={getGroupBatchesDetail}
                    groupBatchDetail={groupBatchDetail}
                />
            </div>
        </>
    );
};

export default PreRutaDelDia;
