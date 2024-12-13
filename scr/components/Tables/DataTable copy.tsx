import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TablePagination
} from '@mui/material';
import { Address } from '../../interfaces/georef/georef.interface';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DeleteIcon from '@mui/icons-material/Delete';
 
interface SmallTableWithButtonProps {
  data: Address[];
  buttonAction: (row: Address,type:number) => void;
}

const SmallTableWithButton: React.FC<SmallTableWithButtonProps> = ({ data, buttonAction }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper  style={{maxWidth:550  } }     >
      <TableContainer component={Paper}   style={{maxHeight:500 } }   >
        <Table size="small" aria-label="small table" style={{overflowY:'scroll'}}>
          <TableHead>
            <TableRow>
              <TableCell>Calle</TableCell> 
              <TableCell  >Opciones </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.idAddress}>
                  <TableCell style={{width:300}}>{row.streetAddress}</TableCell> 
                  <TableCell align="right"   >
                    <div className='row flex flex-nowrap'>
                      <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded px-2 py-1 me-2" 
                        type='button'
                        onClick={() => buttonAction(row,1)}>
                        <RemoveRedEyeIcon/>
                      </button>
                      <button 
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded px-2 py-1 me-2" 
                        type='button'
                        onClick={() => buttonAction(row,2)}>
                        <MyLocationIcon/>
                      </button>
                      <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold rounded  px-2 py-1" 
                        type='button'
                        onClick={() => buttonAction(row,3)}>
                        <DeleteIcon/>
                      </button> 
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas por página" 
      />
    </Paper>
  );
};

export default SmallTableWithButton;
