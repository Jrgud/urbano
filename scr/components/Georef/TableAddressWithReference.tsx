import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer'; 
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow'; 
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography'; 
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip'; 
import NearMeIcon from '@mui/icons-material/NearMe';
import { Address, AddressAuto, AnulateAddress } from '../../interfaces/georef/georef.interface'; 
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
 

 

 
interface EnhancedTableToolbarProps {
  numSelected: number;
  total: number;
  setOpenModalWthReferencesAddress: React.Dispatch<React.SetStateAction<boolean>>
  setOpen: (value: React.SetStateAction<boolean>) => void;
  handlerShowAddressWithReferences: (addressAutoReferences: AddressAuto[]) => void
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, total, setOpenModalWthReferencesAddress, setOpen,handlerShowAddressWithReferences } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          height: '5%'
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} seleccionado
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
          className='border-b-4 border-b-violet-500 text-violet-500 uppercase font-extrabold'
        >
          Georeferenciado: {total}
        </Typography>
      )} 
      <Tooltip title="Cerrar" onClick={()=>{
        setOpenModalWthReferencesAddress(false)
        handlerShowAddressWithReferences([])
      }
      }>
        <IconButton>
          <CloseIcon />
        </IconButton>
      </Tooltip> 
    </Toolbar>
  );
}

interface TableAddressWithReferenceProps {
  data: AddressAuto[]; 
  selectedGroupAddress: number[]; 
  setOpenModalWthReferencesAddress: React.Dispatch<React.SetStateAction<boolean>>;
  handlerShowAddressWithReferences: (addressAutoReferences: AddressAuto[]) => void
  handleMoveCamera: (lat: number, lng: number) => void
  buttonActionAddress: (row: Address, type: number) => Promise<void>
  handleAnulateAddress: (row: AddressAuto) => void
}

const TableAddressWithReference= ({ 
  buttonActionAddress, 
  data,   
  selectedGroupAddress,   
  setOpenModalWthReferencesAddress,
  handlerShowAddressWithReferences,
  handleMoveCamera ,
  handleAnulateAddress
}:TableAddressWithReferenceProps) => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof AddressAuto>('streetAddress'); 
  const [openDialogSelectedGroup, setOpenDialogSelectedGroup] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

   
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
 
  const visibleRows = React.useMemo(
    () =>
      [...data]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, data],
  );
  
  const handleSendAddress=(row:AddressAuto)=>{
    const address:Address={
      idAddress: row.idAddress,
      ciuId: row.ciuId,
      gps: row.gps,
      streetAddress: row.streetAddress,
      numberAddress: row.numberAddress,
      urbanizationAddress: row.urbanizationAddress,
      blockAddress: row.blockAddress,
      mzaAddress: row.mzaAddress,
      loteAddress: row.loteAddress,
      referenceAddress: row.referenceAddress,
      id_bot_log: row.id_bot_log,
      city: row.city,
      addressNormalized: row.addressNormalized,
      distric: row.distric,
      cliente: row.cliente,
      guia: row.guia,
      shipper: row.shipper,
      cli_id:row.cli_id,
      cli_email:row.cli_email,
      cli_tel:row.cli_tel,
      cli_direcciones:row.cli_direcciones,
    }
    buttonActionAddress(address,1)
  } 
 
  return (
    <>
      <Box role="presentation" className=" bg-white rounded-lg  border border-zinc-700 h-full" sx={{ maxWidth: 470 }}>
        <EnhancedTableToolbar 
          numSelected={selectedGroupAddress.length} 
          total={data.length} 
          setOpenModalWthReferencesAddress={setOpenModalWthReferencesAddress} 
          setOpen={setOpenDialogSelectedGroup} 
          handlerShowAddressWithReferences={handlerShowAddressWithReferences}
        />
        <TableContainer style={{ height: '85%' }}>
          <Table
            sx={{ maxWidth: 470, overflowY: 'scroll' }}
            aria-labelledby="tableTitle"
            size='small'
          > 
            <TableBody  >
              {visibleRows.map((row, index) => {
                const isItemSelected = selectedGroupAddress.includes(row.idAddress);
                const labelId = `enhanced-table-checkbox-${index}`;
                const [lat,lng]=row.coordenada_puerta.split(',').reverse()
                return (
                  <TableRow
                    hover 
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.idAddress}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  > 
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      className='p-2'  
                    >
                      {row.streetAddress+' '+(row.numberAddress??'')+' '+(row?.mzaAddress??'')+' '+(row.loteAddress??'')+' '+(row.blockAddress??'')}
                    </TableCell> 
                    <TableCell  
                    >
                      <div  className='gap-2 flex'  >
                        <button className='bg-purple-500 rounded-lg p-1 hover:bg-purple-600' onClick={()=>handleMoveCamera(+lat,+lng)}>
                          <NearMeIcon className='text-white'/>
                        </button>
                        <button className='border-purple-500 border rounded-lg p-1' onClick={()=>handleSendAddress(row)}>
                          <InfoIcon className='text-purple-500 hover:text-purple-600'/>
                        </button> 
                        <button className='border-purple-500 border rounded-lg p-1' onClick={()=>handleAnulateAddress(row)}>
                          <DeleteIcon className='text-purple-500 hover:text-purple-600'/>
                        </button> 
                      </div>
                    </TableCell> 
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination style={{ height: '5%', overflow: 'hidden' }}
          rowsPerPageOptions={[25, 10, 5]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="página"
          size='small'
        />
      </Box> 
    </>
  );
}

export default TableAddressWithReference;
