 import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody'; 
import TableContainer from '@mui/material/TableContainer'; 
import Paper from '@mui/material/Paper';
import { GroupBatchDetailList, GroupBatchList } from '../../types/preruta';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { AppBar, Dialog,   IconButton,   Slide, Toolbar,   } from '@mui/material';
import { forwardRef, Fragment, useEffect, useState } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

 

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

 type TableGroupProps={
  groupBatch:GroupBatchList
  getGroupBatchesDetail: (loteId: number) => Promise<void>
  groupBatchDetail:GroupBatchDetailList 
 }
export default function TableGroup({groupBatch,getGroupBatchesDetail,groupBatchDetail}:TableGroupProps) {

  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [nameLoteGroup, setNameLoteGroup] = useState('');
  const handlerShowBatchDetail=(batchId:number)=>{
    setOpenModalDetail(true)
    getGroupBatchesDetail(batchId)
    setNameLoteGroup(groupBatch.filter(f=>f.lote_id===batchId)[0].localidad)
  }
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (groupBatch && groupBatch.length > 0) {
      const initialGroups = groupBatch.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.gru_nombre] = true; // Inicializa como abierto
        return acc;
      }, {});
      setOpenGroups(initialGroups);
    }
  }, [groupBatch]); // Actualiza cuando groupBatch cambie 

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small" sx={{ minWidth: 700 }} aria-label="grouped table">
        <thead className='bg-black-2 text-white'>
          <tr>
            <th rowSpan={2} className="text-xs border border-white font-bold ">#</th>
            <th rowSpan={2} className="text-xs border border-white text-center ">Menú</th>
            <th rowSpan={2} className="text-xs border border-white text-center ">Lote</th>
            <th rowSpan={2} className="text-xs border border-white text-center ">Tipo</th>
            <th rowSpan={2} className="text-xs border border-white text-center ">Localidad</th>
            <th rowSpan={2} className="text-xs border border-white text-center ">Guías</th>
            <th rowSpan={2} className="text-xs border border-white text-center ">Piezas</th>
            <th rowSpan={2} className="text-xs border border-white text-center ">Paradas</th>
            <th rowSpan={2} className="text-xs border border-white text-center ">Peso</th>
            <th rowSpan={2} className="text-xs border border-white text-center ">Sin X,Y</th>
            <th colSpan={2} className="text-xs border border-white text-center ">Para Entrega</th>
            <th colSpan={3} className="text-xs border border-white text-center ">Para Devolver</th>
            <th rowSpan={1} className="text-xs border border-white text-center ">Logística Inversa</th>
          </tr>
          <tr>
            <th className="text-xs border border-white text-center ">Guías</th>
            <th className="text-xs border border-white text-center ">Piezas</th>
            <th className="text-xs border border-white text-center ">Guías</th>
            <th className="text-xs border border-white text-center ">Piezas</th>
            <th className="text-xs border border-white text-center ">Liquidaciones</th>
            <th className="text-xs border border-white text-center ">Guías</th>
          </tr>
        </thead>
          <TableBody>
          {Object.entries(
            groupBatch.reduce<Record<string, { items: any[]; totals: Record<string, number> }>>(
              (acc, item) => {
                if (!acc[item.gru_nombre]) {
                  acc[item.gru_nombre] = { items: [], totals: {} };
                }
                acc[item.gru_nombre].items.push(item);

                // Sumar valores numéricos
                [
                  'guias',
                  'piezas',
                  'paradas',
                  'peso_pieza',
                  'sinxy',
                  'guias_entrega',
                  'pieza_entrega',
                  'guias_dev',
                  'pieza_dev',
                  'liq_dev',
                  'guia_inv',
                ].forEach((key) => {
                  acc[item.gru_nombre].totals[key] = (acc[item.gru_nombre].totals[key] || 0) + (item[key] || 0);
                });

                return acc;
              },
              {}
            )
          ).map(([group, { items, totals }]) => (
              <Fragment key={group}>
                {/* Fila del grupo */}
                <tr className="font-bold bg-slate-200">
                  <td className="text-left text-xs font-bold pr-2" colSpan={16} >
                      <IconButton size="small" onClick={() => toggleGroup(group)}>
                        {openGroups[group] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                      Grupo {group} 
                  </td> 
                </tr>
                {/* Filas dentro del grupo */}
                {openGroups[group] && (
                  items.map((batch, index) => ( 
                    <tr key={index} className={`${index%2===0? 'bg-white':'bg-slate-200'} hover:bg-slate-300`  }>
                      <td className="p-1 text-right  text-xs">{index + 1}</td>
                      <td className="p-1 text-center">
                        <button
                          className="bg-orange-500 text-white text-xs p-1 rounded-full hover:bg-orange-600"
                          onClick={() => handlerShowBatchDetail(batch.lote_id)}
                        >
                          <ManageSearchIcon className='text-sx' />
                        </button>
                      </td>
                      <td className="text-right text-xs font-bold pr-2">{batch.lote_id}</td>
                      <td className="text-right text-xs font-bold pr-2">{batch.area_nombre}</td>
                      <td className="text-right text-xs font-bold pr-2">{batch.localidad}</td>
                      <td className="text-right text-xs font-bold pr-2">{batch.guias}</td>
                      <td className="text-right text-xs font-bold pr-2">{batch.piezas}</td>
                      <td className="text-right text-xs font-bold pr-2">{batch.paradas}</td>
                      <td className="text-right text-xs font-bold pr-2">{batch.peso_pieza}</td>
                      <td className="text-right text-xs font-bold pr-2">{batch.sinxy}</td>
                      <td className="text-right text-xs font-bold pr-2">{batch.guias_entrega}</td>
                      <td className="text-right text-xs font-bold pr-2">{batch.pieza_entrega}</td>
                      <td className="text-right text-xs font-bold pr-2">{batch.guias_dev}</td>
                      <td className="text-right text-xs font-bold pr-2">{batch.pieza_dev}</td>
                      <td className="text-right text-xs font-bold pr-2">{batch.liq_dev}</td>
                      <td className="text-right text-xs font-bold pr-2">{batch.guia_inv}</td>
                    </tr>
                  ))
                )}
                <tr className="bg-black-2 text-white font-semibold">
                  <td colSpan={5} className="p-2 text-xs text-right font-bold">Totales</td>
                  <td className="p-2 text-xs text-right">{totals.guias}</td>
                  <td className="p-2 text-xs text-right">{totals.piezas}</td>
                  <td className="p-2 text-xs text-right">{totals.paradas}</td>
                  <td className="p-2 text-xs text-right">{totals.peso_pieza}</td>
                  <td className="p-2 text-xs text-right">{totals.sinxy}</td>
                  <td className="p-2 text-xs text-right">{totals.guias_entrega}</td>
                  <td className="p-2 text-xs text-right">{totals.pieza_entrega}</td>
                  <td className="p-2 text-xs text-right">{totals.guias_dev}</td>
                  <td className="p-2 text-xs text-right">{totals.pieza_dev}</td>
                  <td className="p-2 text-xs text-right">{totals.liq_dev}</td>
                  <td className="p-2 text-xs text-right">{totals.guia_inv}</td>
                </tr>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer> 

      <Dialog
        fullScreen
        open={openModalDetail}
        onClose={()=>setOpenModalDetail(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative',background:'white' }}>
          <Toolbar className='flex justify-between'>
            <div className='col-span-10'>
              <p className='text-2xl text-black-2  font-bold'>{nameLoteGroup}</p>
            </div>
            <div className='col-span-2'> 
                <button
                      onClick={()=>setOpenModalDetail(false)}
                      className=' p-2 bg-blue-600 text-white text-center font-bold rounded-lg text-sm'>
                      <KeyboardReturnIcon />
                      Regresar
                </button>
            </div> 
          </Toolbar>
        </AppBar> 
        <TableContainer component={Paper}>
        <table className="min-w-[700px] table-auto  text-sm m-2 rounded-lg">
        <thead className='bg-black-2 rounded-lg'>
          <tr>
            <th className="text-sm text-white border border-white font-bold px-2 py-1">#</th>
            <th className="text-sm text-white border border-white px-2 py-1 text-center">Orden Escaneo</th>
            <th className="text-sm text-white border border-white px-2 py-1 text-center">Tipo Servicio</th>
            <th className="text-sm text-white border border-white px-2 py-1 text-center">Pieza</th>
            <th className="text-sm text-white border border-white px-2 py-1 text-center">Guía</th>
            <th className="text-sm text-white border border-white px-2 py-1 text-center">N° Piezas</th>
            <th className="text-sm text-white border border-white px-2 py-1 text-center">Código Rastreo</th>
            <th className="text-sm text-white border border-white px-2 py-1 text-center">Shipper</th>
            <th className="text-sm text-white border border-white px-2 py-1 text-center">Cliente</th>
            <th className="text-sm text-white border border-white px-2 py-1 text-center">Dirección</th>
            <th className="text-sm text-white border border-white px-2 py-1 text-center">Distrito</th>
            <th className="text-sm text-white border border-white px-2 py-1 text-center">ID Parada</th>
            <th className="text-sm text-white border border-white px-2 py-1 text-center">Estado Pieza</th>
            <th className="text-sm text-white border border-white px-2 py-1 text-center">Fecha Estado</th>
          </tr>
        </thead>
          <tbody>
            {groupBatchDetail.map((batchDetail,i) => (
              <tr key={i} className={`${i%2===0? 'bg-white':'bg-slate-200'} hover:bg-slate-300`}>
                <td className="text-right text-xs font-bold pr-2">{i + 1}</td>
                <td className="text-right text-xs font-bold pr-2">{batchDetail.pza_orden}</td>
                <td className="text-right text-xs font-bold pr-2">{batchDetail.tipo_servicio}</td>
                <td className="text-right text-xs font-bold pr-2">{batchDetail.pieza}</td>
                <td className="text-right text-xs font-bold pr-2">{batchDetail.guia}</td>
                <td className="text-right text-xs font-bold pr-2">{batchDetail.numero_pieza}</td>
                <td className="text-right text-xs font-bold pr-2">{batchDetail.cod_rastreo}</td>
                <td className="text-right text-xs font-bold pr-2">{batchDetail.shipper}</td>
                <td className="text-right text-xs font-bold pr-2">{batchDetail.nombre_cliente}</td>
                <td className="text-right text-xs font-bold pr-2">{batchDetail.direccion}</td>
                <td className="text-right text-xs font-bold pr-2">{batchDetail.distrito}</td>
                <td className="text-right text-xs font-bold pr-2">{batchDetail.id_parada}</td>
                <td className="text-right text-xs font-bold pr-2">{batchDetail.estado_pieza}</td>
                <td className="text-right text-xs font-bold pr-2">{batchDetail.fecha_estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>
      </Dialog> 
    </>
  );
}