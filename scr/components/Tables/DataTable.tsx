import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { Address } from '../../interfaces/georef/georef.interface';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel,  Radio, RadioGroup } from '@mui/material';

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

interface HeadCell {
  disablePadding: boolean;
  id: keyof Address;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'streetAddress',
    numeric: false,
    disablePadding: true,
    label: 'Direcciiones',
  },
  {
    id: 'idAddress',
    numeric: true,
    disablePadding: false,
    label: '',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Address) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Address) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'Ordenar descendente' : 'Ordenar acendente'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
interface EnhancedTableToolbarProps {
  numSelected: number;
  total: number;
  setOpenModalDeleteAddress: React.Dispatch<React.SetStateAction<boolean>>
  setOpen: (value: React.SetStateAction<boolean>) => void;
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, total, setOpenModalDeleteAddress, setOpen } = props;
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
          className='border-b-4 border-b-violet-500 text-violet-500 uppercase'
        >
          Direcciones: {total}
        </Typography>
      )}
      {numSelected > 0 ? (
        <>
          <Tooltip title="Borrar">
            <IconButton onClick={() => setOpenModalDeleteAddress(true)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Gereferenciar">
            <IconButton onClick={() => setOpen(true)}>
              <MyLocationIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
      <IconButton>
        <CloseIcon />
      </IconButton> 
    </Toolbar>
  );
}

interface SmallTableWithButtonProps {
  data: Address[];
  buttonActionAddress: (row: Address, type: number) => void;
  selectedGroupAddress: number[];
  setSelectedGroupAddress: React.Dispatch<React.SetStateAction<number[]>>;
  setOpenModalDeleteAddress: React.Dispatch<React.SetStateAction<boolean>>;
}

const SmallTableWithButton: React.FC<SmallTableWithButtonProps> = ({ data, buttonActionAddress, selectedGroupAddress, setSelectedGroupAddress, setOpenModalDeleteAddress }) => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Address>('streetAddress');
  // const [selectedGroupAddress, setSelectedGroupAddress] = React.useState<readonly number[]>([]);
  const [openDialogSelectedGroup, setOpenDialogSelectedGroup] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Address,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
 

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.idAddress);
      setSelectedGroupAddress(newSelected);
      return;
    }
    setSelectedGroupAddress([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selectedGroupAddress.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedGroupAddress, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedGroupAddress.slice(1));
    } else if (selectedIndex === selectedGroupAddress.length - 1) {
      newSelected = newSelected.concat(selectedGroupAddress.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedGroupAddress.slice(0, selectedIndex),
        selectedGroupAddress.slice(selectedIndex + 1),
      );
    }
    setSelectedGroupAddress(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCancel = () => {
    setOpenDialogSelectedGroup(false);
  };

  const handleOk = () => {
    setOpenDialogSelectedGroup(false);
    buttonActionAddress(data.find(f => f.idAddress === valueGroupSelected)!, 2)
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(+(event.target as HTMLInputElement).value);
  };


  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...data]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, data],
  );
  const [valueGroupSelected, setValue] = React.useState(0);
  const radioGroupRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!openDialogSelectedGroup) {
      setValue(0);
    }
  }, [0, openDialogSelectedGroup]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  return (
    <>
      <Box role="presentation" className=" bg-white rounded-lg  border border-zinc-700 h-full" sx={{ maxWidth: 470 }}>
        <EnhancedTableToolbar numSelected={selectedGroupAddress.length} total={data.length} setOpenModalDeleteAddress={setOpenModalDeleteAddress} setOpen={setOpenDialogSelectedGroup} />
        <TableContainer style={{ height: '85%' }}>
          <Table
            sx={{ maxWidth: 470, overflowY: 'scroll' }}
            aria-labelledby="tableTitle"
            size='small'
          >
            <EnhancedTableHead
              numSelected={selectedGroupAddress.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody  >
              {visibleRows.map((row, index) => {
                const isItemSelected = selectedGroupAddress.includes(row.idAddress);
                const labelId = `enhanced-table-checkbox-${index}`;
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
                    <TableCell padding="checkbox">
                      <Checkbox
                      onClick={(event) => handleClick(event, row.idAddress)}
                      color="primary"
                      checked={isItemSelected}
                      size='small'
                      inputProps={{
                        'aria-labelledby': labelId,
                      }} 
                    />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      onClick={() => buttonActionAddress(row, 1)}
                      className='hover:underline hover:text-purple-600'
                    >
                      {row.streetAddress+' '+(row.numberAddress??'')+' '+(row?.mzaAddress??'')+' '+(row.loteAddress??'')+' '+(row.blockAddress??'')}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      padding="none"
                    >
                      <div className='flex justify-center hover:bg-purple-200 rounded-lg'>
                        <button className='text-purple-600 p-2' disabled={selectedGroupAddress.length > 0} onClick={() => buttonActionAddress(row, 2)}>
                          <MyLocationIcon />
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
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth="xs"
        TransitionProps={{ onEntering: handleEntering }}
        open={openDialogSelectedGroup}
      >
        <DialogTitle>Seleccione dirección </DialogTitle>
        <DialogContent dividers style={{ maxHeight: 400 }}>
          <RadioGroup
            ref={radioGroupRef}
            aria-label="ringtone"
            name="ringtone"
            value={valueGroupSelected}
            onChange={handleChange}
          >
            {selectedGroupAddress.map((option) => (
              <FormControlLabel
                value={option}
                key={option}
                control={<Radio />}
                label={data.find(f => f.idAddress === option)?.streetAddress ?? 'sin direción'}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel} color='error'>
            Cancelar
          </Button>
          <Button
            disabled={valueGroupSelected == 0}
            onClick={handleOk}>Georeferenciar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SmallTableWithButton;
