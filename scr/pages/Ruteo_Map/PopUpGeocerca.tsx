import * as React from 'react'; 
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse'; 
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore'; 
import { Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import EditRoadIcon from '@mui/icons-material/EditRoad';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
  
interface OptionZoneProps {
    properties:any;
    onOptionZone: (option: any | null) => void;
}

const CustomPopup: React.FC<OptionZoneProps>= ({ properties,onOptionZone }) => {
    const [open, setOpen] = React.useState(false);
    const handleClick = (id:number) => {
        onOptionZone({properties,action:id}) 
    }; 
    return  (
        <Box  >
            <p>
                <strong>Zona:</strong> {properties?.zona_codigo}
            </p> 
            <List
                sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader" 
            >
                <ListItemButton onClick={()=>handleClick(1)}>
                    <ListItemIcon>
                        <  DeleteIcon  />
                    </ListItemIcon>
                    <ListItemText primary="Eliminar" />
                </ListItemButton> 
                <ListItemButton  onClick={()=>setOpen(!open)} >
                    <ListItemIcon>
                    <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Editar" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton> 
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={()=>handleClick(2)}>
                            <ListItemIcon >
                                <EditRoadIcon />
                            </ListItemIcon>
                            <ListItemText primary="Puntos" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={()=>handleClick(3)}> 
                            <ListItemIcon>
                                <EditIcon />
                            </ListItemIcon>
                            <ListItemText primary="Caracteristicas" />
                        </ListItemButton>
                    </List>
                </Collapse>
                <ListItemButton onClick={()=>handleClick(4)}>
                    <ListItemIcon>
                        <MyLocationIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Ver puertas" />
                </ListItemButton> 
                <ListItemButton onClick={()=>handleClick(5)}>
                    <ListItemIcon>
                        <AddLocationAltIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Agregar Puerta" />
                </ListItemButton> 
            </List>
        </Box>
    ); 
}
export default CustomPopup