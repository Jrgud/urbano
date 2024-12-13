import React, { useState } from 'react';
import { Slider, TextField, Box, Typography } from '@mui/material';

const ColorPicker = () => {
  const [color, setColor] = useState({
    r: 0,
    g: 0,
    b: 0,
  });

  const handleSliderChange = (event, newValue, colorKey) => {
    setColor({
      ...color,
      [colorKey]: newValue,
    });
  };

  const rgbColor = `rgb(${color.r}, ${color.g}, ${color.b})`;

  return (
    <Box  > 
        <TextField
        label="Selected Color"
        value={rgbColor}
        InputProps={{
          readOnly: true,
          style: { color: rgbColor },
        }}
        fullWidth
        margin="normal"
      />
      <Box
        mt={2}
        p={2}
        sx={{ backgroundColor: rgbColor, height: 40, borderRadius: 1 }}
      > 
      <Typography className='bg-white text-center p-0 m-0'  >{rgbColor}</Typography>
      </Box>
      <Box >
        <Typography  >Red</Typography>
        <Slider
          value={color.r}
          onChange={(e, newValue) => handleSliderChange(e, newValue, 'r')}
          aria-labelledby="red-slider"
          valueLabelDisplay="auto"
          min={0}
          max={255}
        />
      </Box>

      <Box >
        <Typography  >Green</Typography>
        <Slider
          value={color.g}
          onChange={(e, newValue) => handleSliderChange(e, newValue, 'g')}
          aria-labelledby="green-slider"
          valueLabelDisplay="auto"
          min={0}
          max={255}
        />
      </Box>

      <Box >
        <Typography  >Blue</Typography>
        <Slider
          value={color.b}
          onChange={(e, newValue) => handleSliderChange(e, newValue, 'b')}
          aria-labelledby="blue-slider"
          valueLabelDisplay="auto"
          min={0}
          max={255}
        />
      </Box> 
    </Box>
  );
};

export default ColorPicker;
