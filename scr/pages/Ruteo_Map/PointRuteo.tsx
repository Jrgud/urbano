import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab'; 
import NavigationIcon from '@mui/icons-material/Navigation';

const ButtonPointRuteo=()=> {
  


  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}> 
      <Fab variant="extended">
        <NavigationIcon sx={{ mr: 1 }} />
        Puertas Ruteo
      </Fab> 
    </Box>
  );
}

export default ButtonPointRuteo;

