import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { OptionsSelect } from '../../../interfaces/general/general.interfaces';

 
interface SelectWithSearchProps {
  options: {
    data: OptionsSelect[],
    title: String,
    type?: "outlined" | "filled" | "standard";
    name?: string;
  };
  onOptionSelect: (option: OptionsSelect|null) => void;
  defaultValue?: number; // Agregamos el prop defaultValue como número
}

const SelectWithSearch: React.FC<SelectWithSearchProps> = ({
  options,
  onOptionSelect,
  defaultValue, // Agregamos el prop opcional
}) => {
  const [value, setValue] = React.useState<OptionsSelect| null>(null);
  React.useEffect(() => {
    if (typeof defaultValue === 'number') {
      const option = options.data.find((option) => option.value === defaultValue);
      if(option) setValue(option);
    }
  }, [defaultValue, options.data]);

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: OptionsSelect|null) => {
    setValue(newValue);
    onOptionSelect(newValue); // Retorna la opción seleccionada al componente padre
  };

  return (
    <>
      <Autocomplete
        value={value}
        size="small"
        onChange={handleChange}
        options={options.data}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <TextField
            {...params}
            label={options.title}
            variant={options.type}
          />
        )}
      />
      {value && options.name && (
        <input
          type="hidden"
          id={options.name}
          name={options.name}
          value={value.value}
        />
      )}
    </>
  );
};

export default SelectWithSearch;