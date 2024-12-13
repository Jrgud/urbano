import {  Collapse, Drawer } from '@mui/material';
import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications'; 
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import {  GroupBatch, GroupBatchList } from '../../types/preruta';
import TurnSharpLeftIcon from '@mui/icons-material/TurnSharpLeft';
type ListZoneDrawerProps ={
    groupBatch:GroupBatchList
    handleCheckboxChange: (groupBatch: GroupBatch) => Promise<void>
    drawerOpen: boolean
    setDrawerOpen: Dispatch<SetStateAction<boolean>>
}
export const ListZoneDrawer = ({groupBatch,handleCheckboxChange,drawerOpen,setDrawerOpen}:ListZoneDrawerProps) => {
    
    const [totalesOpen, setTotalesOpen] = useState(false);
    const [planetasOpen, setPlanetasOpen] = useState(false);
    const [pesosOpen, setPesosOpen] = useState(false);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
    const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({
        ...prev,
        [group]: !prev[group],
    }));
    };
  return ( 
        <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            ModalProps={{
                keepMounted: true,
                BackdropProps: {
                    style: { backgroundColor: 'transparent' },
                },
            }}
        >
            <div
                className='w-100 h-full bg-purple-800 p-5 text-white space-y-1 ' 
             >
                {/* Sección TOTALES */} 
                <div className=' flex align-middle p-2 bg-slate-50/10' >
                    <p className='font-bold flex-grow text-sm' >
                        TOTALES
                    </p>
                    <button type='button' className='text-white' onClick={() => setTotalesOpen(!totalesOpen)}>
                        {totalesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </button>
                </div>
                <Collapse in={totalesOpen}>
                    <p>Validando...</p>
                </Collapse> 

                {/* Sección PLANETAS */}
                <div className=' flex align-middle p-2 bg-slate-50/10' >
                    <p className='font-bold flex-grow text-sm' >
                        ZONAS
                    </p> 
                    <button type='button' className='text-white' onClick={() => setPlanetasOpen(!planetasOpen)}>
                        {planetasOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </button>
                </div>
                <Collapse in={planetasOpen}>
                    <div className="grid grid-cols-1 gap-0 mt-2 bg-white p-2 rounded">
                        <div className="overflow-y-auto max-h-[300px] mt-2">
                            <table className="table-auto w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-600">
                                    <th className="text-xs border text-white text-center"><SettingsApplicationsIcon/></th>
                                    <th className="text-xs border text-white text-center">Guías</th>
                                    <th className="text-xs border text-white text-center">Paradas</th>
                                    <th className="text-xs border text-white text-center">Pendientes</th>
                                </tr>
                            </thead>
                            <tbody> 
                            {Object.entries(
                                groupBatch.reduce<Record<string, { items: GroupBatchList;  }>>(
                                (acc, item) => {
                                    if (!acc[item.gru_nombre]) {
                                    acc[item.gru_nombre] = { items: []  };
                                    }
                                    acc[item.gru_nombre].items.push(item); 

                                    return acc;
                                }, {})
                                ).map(([group, { items }]) => (
                                    <Fragment key={group}>
                                        {/* Fila del grupo */}
                                        <tr className="font-bold bg-slate-300">
                                        <td className="text-left text-xs font-bold pr-2 text-slate-700" colSpan={16} >
                                            <button  onClick={() => toggleGroup(group)}>
                                                {openGroups[group] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                            </button>
                                            Grupo {group} 
                                        </td> 
                                        </tr>
                                        {/* Filas dentro del grupo */}
                                        {openGroups[group] && (
                                        items.map((batch, index) => ( 
                                            <tr key={index} className={'even:bg-slate-200 hover:bg-slate-300'  }> 
                                                <td className="text-right text-xs font-bold pr-2 text-slate-700"> 
                                                    <button className='bg-purple-500 rounded-lg p-0' onClick={()=>handleCheckboxChange(batch)}>
                                                        <TurnSharpLeftIcon className='text-xs text-white'/> 
                                                    </button>
                                                </td>
                                                <td className="text-right text-xs font-bold pr-2 text-slate-700">{batch.guias}</td> 
                                                <td className="text-right text-xs font-bold pr-2 text-slate-700">{batch.paradas}</td>
                                                <td className="text-right text-xs font-bold pr-2 text-slate-700">{batch.pendientes}</td> 
                                            </tr>
                                            ))
                                        )} 
                                    </Fragment>
                                ))
                            }
                            </tbody>
                            </table>
                        </div>
                    </div> 
                </Collapse>

                {/* Sección PESOS */} 
                <div className=' flex align-middle p-2 bg-slate-50/10' >
                    <p className='font-bold flex-grow text-sm' >
                        PESOS
                    </p>
                    <button type='button' className='text-white' onClick={() => setPesosOpen(!pesosOpen)}>
                    {pesosOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </button> 
                </div>
                <Collapse in={pesosOpen}>
                    <p>Validando...</p>
                </Collapse> 
            </div>
        </Drawer> 
  )
}
