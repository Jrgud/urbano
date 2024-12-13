import { Badge, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Radio, RadioGroup, Slide, TextField } from '@mui/material';
import  { ChangeEvent, Dispatch, forwardRef, ReactElement, SetStateAction, useEffect, useMemo, useRef , useState } from 'react' 
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import { Address, searchAddres as InterfaceSearchAddres, ListSearchDistrict } from '../../interfaces/georef/georef.interface';
import { TransitionProps } from '@mui/material/transitions';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import ReplyIcon from '@mui/icons-material/Reply';
import NearMeIcon from '@mui/icons-material/NearMe';
interface SearchBarProps {
    searchAddres: (address: string, type: number, ciu_id: number) => Promise<InterfaceSearchAddres[]>
    handleClickShowMarket:(lat:number,lng:number,sub_tet:string,searchTypeAddresses:number,geoId:number)=>void;
    inputSearchAddress:string;
    currentAddressWithoutReference:Address;
    radiusMarkerInMeters: number;
    setRadiusMarkerInMeters: Dispatch<SetStateAction<number>>
    currentDistrict: number;
    listDistrictSearch:ListSearchDistrict;
    searchDistrict: (text: string) => Promise<void>;
    setCurrentDistrict: Dispatch<SetStateAction<number>>;
    setListDistrictSearch: (data: ListSearchDistrict) => void;
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
      children: ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


const SearchBar = ({
        searchAddres,
        handleClickShowMarket,
        inputSearchAddress,
        currentAddressWithoutReference,
        radiusMarkerInMeters,
        setRadiusMarkerInMeters,
        currentDistrict,
        listDistrictSearch,
        searchDistrict,
        setCurrentDistrict,
        setListDistrictSearch
    }:SearchBarProps) => {
    const debonceRef=useRef<NodeJS.Timeout>();
    const [searchAddresses,setSearchAddresses]=useState<InterfaceSearchAddres[]>([]);
    const [searchTypeAddresses,setSearchTypeAddresses]=useState(4);
    const [inputAddress, setInputAddress] = useState(inputSearchAddress);
    const [inputDistrict, setInputDistrict] = useState('');
    
    const [showDialogDistrict,setShowDialogDistrict]=useState(false);

    const [inputLng,setInputLng]=useState(0);
    const [inputLat,setInputLat]=useState(0);
     

    // Sincroniza inputSearchAddress con el estado local inputAddress
    useEffect(() => {
        setInputAddress(inputSearchAddress);
        handlerSearchByAddress(inputSearchAddress,searchTypeAddresses,(currentDistrict?currentDistrict:currentAddressWithoutReference.ciuId))
    }, [inputSearchAddress]);

    const onQueryChanged=(event:ChangeEvent<HTMLInputElement>) => {
        setInputAddress(event.target.value)
        setInputLng(0) 
        setInputLat(0) 
        if(debonceRef.current) {
            clearTimeout(debonceRef.current);   
        }
        debonceRef.current = setTimeout(async () => { 
            handlerSearchByAddress(event.target.value,searchTypeAddresses,(currentDistrict?currentDistrict:currentAddressWithoutReference.ciuId))
        }, 600); 
    }
    const onQueryChangedDistrict=(event:ChangeEvent<HTMLInputElement>) => {
        setInputDistrict(event.target.value) 
        if(debonceRef.current) {
            clearTimeout(debonceRef.current);   
        }
        debonceRef.current = setTimeout(async () => { 
            searchDistrict(event.target.value)
        }, 600); 
    }
    const onQueryChangedLatLng=(event:ChangeEvent<HTMLInputElement>) => {
        const [lng,lat]= event.target.value.split(',').reverse();
        setInputLng(+lng) 
        setInputLat(+lat) 
    } 
    const handlerSearchByAddress = async (address:string,typeOption:number, ciu_id: number)=>{
        if(address.trim().length <= 0) return
        const data=await searchAddres(address,typeOption,ciu_id);
        setSearchAddresses(data);
    }
    const handlerChangeOptionTypeSearch=(typeOption:number)=>{ 
        setSearchTypeAddresses(typeOption);
        handlerSearchByAddress(inputAddress,typeOption,currentAddressWithoutReference.ciuId);
    }
    const handlerSelectedNewDistrict=(districtId:number)=>{
        setShowDialogDistrict(false)
        setCurrentDistrict(districtId)
        handlerSearchByAddress(inputSearchAddress,searchTypeAddresses,(districtId?districtId:currentAddressWithoutReference.ciuId))
    }
    const handlerOpenDialog=()=>{
        setShowDialogDistrict(true)
        setInputDistrict('')
        setListDistrictSearch([])
    }
    const handlerReverseDistrict=()=>{
        setCurrentDistrict(0)
        handlerSearchByAddress(inputSearchAddress,searchTypeAddresses,( currentAddressWithoutReference.ciuId))
    }

    // const selectedDistrictName=useMemo(()=>{ 
    //     return currentDistrict
    //     ?listDistrictSearch.filter(f=>f.ciu_id===currentDistrict)[0].nombre_distrito
    //     :currentAddressWithoutReference.distric
    // },[currentDistrict])
    // console.log(selectedDistrictName)
    return (
        <>
        <Box className="p-3 bg-white" role="presentation" >
            <div className='mb-5 w-full'>
                <h2 className='font-bold text-lg text-center text-dark text-violet-500'>Georeferenciar</h2>
                <p className='font-bold text-sm text-start my-4 border-b-4 border-b-violet-500 text-violet-500 uppercase'>Distrito: {currentAddressWithoutReference.distric}</p>
                <p className='font-bold text-sm text-start border-b-4 border-b-violet-500 text-violet-500 uppercase'>{currentAddressWithoutReference?.streetAddress+' '+(currentAddressWithoutReference.numberAddress??'')+' '+(currentAddressWithoutReference.mzaAddress??'')+' '+(currentAddressWithoutReference.loteAddress??'')+' '+(currentAddressWithoutReference.blockAddress??'')}</p>
            </div>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={searchTypeAddresses}
                onChange={(e)=>handlerChangeOptionTypeSearch(+e.target.value)}
            >
                {/* <FormControlLabel value={1} control={<Radio size="small"  />} label="MapBox" className='text-sm' /> */}
                <FormControlLabel value={2} control={<Radio size="small"  />} label="HearMap"  className='text-sm' />
                <FormControlLabel value={3} control={<Radio size="small"  />} label="Google"  className='text-sm' />
                <FormControlLabel value={4} control={<Radio size="small"  />} label="Urbano"  className='text-sm' />
            </RadioGroup>
            <label htmlFor="radiusAddress">Radio de Dirección</label>
            <RadioGroup
                id='radiusAddress'
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={radiusMarkerInMeters}
                onChange={(e)=>setRadiusMarkerInMeters(+e.target.value)}
            >
                {/* <FormControlLabel value={1} control={<Radio size="small"  />} label="MapBox" className='text-sm' /> */}
                <FormControlLabel value={50} control={<Radio size="small"  />} label="50"  className='text-sm' />
                <FormControlLabel value={100} control={<Radio size="small"  />} label="100"  className='text-sm' />
                <FormControlLabel value={200} control={<Radio size="small"  />} label="200"  className='text-sm' />
            </RadioGroup>
            {searchTypeAddresses===4&&(
                <div className='flex my-4 justify-between gap-2'>
                    <p className=' w-full text-left p-2 border border-purple-500 rounded-lg text-purple-500 text-sm'>
                        {currentDistrict?listDistrictSearch.filter(f=>f.ciu_id===currentDistrict)[0].nombre_distrito:currentAddressWithoutReference.distric}
                    </p>
                    {currentDistrict
                        ?(<button className=' bg-yellow-500 rounded-full p-2 text-white' onClick={()=>handlerReverseDistrict()}><ReplyIcon/></button>)
                        :(<button className=' bg-blue-500 rounded-full p-2 text-white' onClick={()=>handlerOpenDialog()}><FlipCameraAndroidIcon/></button>) 
                    }
                </div>
            )}
            <div className='mb-5 w-full'>
                <TextField 
                className='w-full'
                value={inputAddress}
                id="outlined-required"
                label="Buscador.." 
                onChange={onQueryChanged}
                /> 
            </div>
            <Divider className="mb-3" /> 
            {searchTypeAddresses!==3
            ?(<List dense={true} style={{maxHeight:300}} className={`overflow-y-scroll `}>
                {searchAddresses.map((item,index) => (
                <ListItem key={index} className='border border-l-strokedark rounded-lg mt-1'  >
                    <ListItemButton onClick={()=>handleClickShowMarket(item.gps[0],item.gps[1],item.sub_tet,searchTypeAddresses,item.geoId)}>
                        <ListItemIcon>
                            <Badge color="primary" variant="dot">
                            <LocationSearchingIcon/>
                            </Badge>
                        </ListItemIcon> 
                        <ListItemText primary={item.text}  secondary={searchTypeAddresses===4?'':item.sub_tet} primaryTypographyProps={{ style: { color: 'black',fontSize:15 } }} />   
                    </ListItemButton>
                </ListItem>
                ))}
            </List>   )
            :(
                <div className='my-5 grid gap-2 grid-cols-1'>
                    <div className='grid'>
                        <a className='bg-black text-center text-white p-2 rounded-md' href={`https://www.google.com/maps?q=${inputAddress}`} target="_blank">Ir a Google Map</a>
                    </div>
                    <div className='grid gap-2 grid-cols-1'>
                        <TextField id="outlined-basic" label="Latitud,Longitud" variant="outlined" onChange={onQueryChangedLatLng} /> 
                        <Button className='col-span-2' variant="contained" onClick={()=>handleClickShowMarket(inputLng,inputLat,inputAddress,searchTypeAddresses,0)}>Encontrar</Button>
                    </div>
                </div>
            )}
            
        </Box> 
        <Dialog
            open={showDialogDistrict}
            TransitionComponent={Transition}
            keepMounted  
        >
            <DialogTitle>Cambiar Distrito</DialogTitle>
            <DialogContent> 
                <div className='grid grid-cols-1 space-y-3 pt-2 w-125'>
                    <TextField 
                        className='w-full mt-2' 
                        id="outlined-required"
                        label="Distrito" 
                        value={inputDistrict}
                        onChange={onQueryChangedDistrict}
                    /> 
                    <List dense={true} style={{maxHeight:300}} className={`overflow-y-scroll `}>
                    {listDistrictSearch.slice(0,50).map((item,index) => (
                        <ListItem key={index} className='border border-l-strokedark rounded-lg mt-1'  >
                            <ListItemButton onClick={()=>handlerSelectedNewDistrict(item.ciu_id)} >
                                <ListItemIcon>
                                    <Badge color="primary" variant="dot">
                                        <NearMeIcon/>
                                    </Badge>
                                </ListItemIcon> 
                                <ListItemText primary={item.nombre_distrito}  secondary={item.distrito}  primaryTypographyProps={{ style: { color: 'black',fontSize:15 } }} />   
                            </ListItemButton>
                        </ListItem>
                    ))}
                    </List> 
                </div> 
            </DialogContent>
            <DialogActions>
            <Button onClick={()=>setShowDialogDistrict(false)}>Cerrar</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}

export default SearchBar ;
