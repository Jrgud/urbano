import * as React from 'react'; 
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box } from '@mui/material';
  
interface OptionZoneProps {
    properties:any; 
    showBottomAddAddress?:Boolean;
    handlerOptionAddressMarker: (type: number) => void
}

const AddressPopup: React.FC<OptionZoneProps>= ({ properties,handlerOptionAddressMarker,showBottomAddAddress=true }) => {
    const handleClick = (id:number) => {
        handlerOptionAddressMarker(id) 
    }; 
    return  (
        <Box  >
            <div className='border rounded-lg  p-2'>
                <p>Lat: {properties?.lat}, Lng: {properties?.lng}</p>
            </div>
            <List
                sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader" 
            >
                {showBottomAddAddress?(<ListItemButton onClick={()=>handleClick(1)}>
                    <ListItemIcon>
                        <MyLocationIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Agregar Puerta" />
                </ListItemButton>  ):(<></>)}
                
                <ListItemButton onClick={()=>handleClick(2)}>
                    <ListItemIcon>
                        <DeleteForeverIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Eliminar marcador" />
                </ListItemButton>  
            </List>
        </Box>
    ); 
}
export default AddressPopup