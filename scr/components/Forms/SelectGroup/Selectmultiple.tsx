import React, { FC, useState, useEffect } from "react";
import { Autocomplete, TextField, Chip, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { OptionsSelect } from "../../../interfaces/general/general.interfaces";

interface MultiSelectProps {
  name: string; // El atributo 'name' del input
  label: string; // El texto del label
  options: OptionsSelect[]; // Array de opciones
  size?: "small" | "medium"; // Tamaño del input, por defecto 'small'
  defaultValues?: OptionsSelect[]; // Valores por defecto
  onSelectionChange?: (selectedValues: OptionsSelect[]) => void; // Función callback
}

const MultiSelectWithSearch: FC<MultiSelectProps> = ({
  name,
  label,
  options,
  size = "small",
  defaultValues = [], // Valores por defecto como array vacío
  onSelectionChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<OptionsSelect[]>([]); // Estado inicial vacío

  // Efecto para inicializar el estado con los valores predeterminados
  useEffect(() => {
    if(defaultValues.length>0){
      setSelectedOptions(defaultValues);
      onSelectionChange?.(defaultValues);
    }
  }, [defaultValues]);

  const handleChange = (_: React.SyntheticEvent, value: OptionsSelect[]) => {
    setSelectedOptions(value);
    onSelectionChange?.(value); // Llama al callback si está definido
  };

  const handleRemoveOption = (optionToRemove: OptionsSelect) => {
    const updatedOptions = selectedOptions.filter((option) => option.value !== optionToRemove.value);
    setSelectedOptions(updatedOptions);
    onSelectionChange?.(updatedOptions);
  };

  const handleOpenDetail = () => setDetailOpen(true);
  const handleCloseDetail = () => setDetailOpen(false);

  const [isDetailOpen, setDetailOpen] = useState(false); // Control del modal de detalle

  return (
    <Box sx={{ width: "100%" }}>
      <Autocomplete
        multiple
        options={options}
        getOptionLabel={(option) => option.label || ""}
        value={selectedOptions}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            name={name}
            placeholder={`Seleccione ${label.toLowerCase()}...`}
            variant="outlined"
            size={size}
          />
        )}
        renderTags={(value) =>
          value.length > 0 ? (
            <Chip
              label={`${value.length} seleccionado(s)`}
              onClick={handleOpenDetail} // Abre el detalle al hacer clic
            />
          ) : null
        }
        isOptionEqualToValue={(option, value) => option.value === value.value}
      />

      {/* Modal para mostrar detalles */}
      <Dialog open={isDetailOpen} onClose={handleCloseDetail}>
        <DialogTitle>Seleccionados</DialogTitle>
        <DialogContent>
          {selectedOptions.length > 0 ? (
            <List>
              {selectedOptions.map((option) => (
                <ListItem
                  key={option.value}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveOption(option)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  {option.label}
                </ListItem>
              ))}
            </List>
          ) : (
            <p>No hay seleccionados.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MultiSelectWithSearch;
