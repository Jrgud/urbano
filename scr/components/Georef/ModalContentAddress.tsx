import * as React from 'react';
import {Box, Dialog, DialogContent,     Button,  Tabs,  Tab,  Accordion,   AccordionSummary,  AccordionDetails,} from '@mui/material';
import { Address, AddressAsigned, AddressAuto, Client } from '../../interfaces/georef/georef.interface'; 
import { ToastCustom } from '../../helpers/toast.helper'; 
import SignpostIcon from '@mui/icons-material/Signpost';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'; 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactNode, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface ModalContentAddressProps {
    openModalContentAddress: boolean;
    setOpenModalContentAddress: (open: boolean) => void;
    currentAddressWithoutReference: Address;
    handlerManualGeorefModal: (geo_id: number) => Promise<void>
    handlerShowPointWithAddressClient: (row: Address, lat: number, lng: number, sub_tet: string) => void
    getListDataClient: (cli_id: number) => Promise<void>
    listDataClient: Client
    addressAuto: AddressAuto[]
}

function TabPanel({ children, value, index, ...other }:{children:ReactNode,value:number,index:number}) {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <div>{children}</div>
          </Box>
        )}
      </div>
    );
}
  

const ModalContentAddress = ({
    openModalContentAddress,
    setOpenModalContentAddress,
    currentAddressWithoutReference,
    handlerManualGeorefModal,
    handlerShowPointWithAddressClient,
    getListDataClient,
    listDataClient,
    addressAuto
}:ModalContentAddressProps) => {
    const [selectedAddress, setSelectedAddress] = useState<AddressAsigned | null>(null); 
    const [valueTab, setValueTab] = useState(0);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        event.preventDefault()
        setValueTab(newValue);
        if(valueTab==0) getListDataClient(currentAddressWithoutReference.cli_id)
      };
 

    const handleClose = () => {
        setOpenModalContentAddress(false);
        setSelectedAddress(null);
    };

    const handleAddressClick = (direccion: AddressAsigned) => {
        if (selectedAddress === direccion) setSelectedAddress(null);
        else setSelectedAddress(direccion);
    }; 
    useEffect(()=>{
        setValueTab(0)
    },[currentAddressWithoutReference])
    
    const DireccionDetail=( label:string,value:string)=>{
        return (
            <div className='flex border border-dotted rounded-lg my-0.5 p-1'>
                <h4 className="font-medium text-black dark:text-white flex items-center">
                    <strong>{label}:</strong>
                    <span className="ms-2 text-black-2 font-medium">{value ?? '...'}</span>
                </h4>
            </div>)
    }

    const hasDirections = Boolean(currentAddressWithoutReference.cli_direcciones) &&  currentAddressWithoutReference.cli_direcciones.length > 0;
    

    return (
        <Dialog open={openModalContentAddress} onClose={handleClose} fullWidth maxWidth="lg">
            <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
            })}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                <Tabs value={valueTab} onChange={handleChangeTab}>
                    <Tab icon={< SignpostIcon />} label="Direcciones" />
                    <Tab icon={<SupervisorAccountIcon />} label="Cliente" /> 
                </Tabs>

                <TabPanel value={valueTab} index={0}>
                    <div className='grid grid-cols-2 gap-2'> 
                            <div className='p-2 border border-slate-900/45 rounded-lg' >  
                                <p className='border-b-4 border-b-violet-500 text-violet-500 uppercase  text-xl'>
                                    Dirección
                                </p>
                                <div className='flex flex-col gap-1 mb-2' >
                                    {DireccionDetail('Calle',currentAddressWithoutReference.streetAddress)}
                                    <div className='flex border border-dotted rounded-lg my-0.5 p-1'>
                                        <div className="flex items-center my-1 w-full">
                                            <h4 className="font-medium text-black dark:text-white flex items-center">
                                                <strong>Lote:</strong>
                                            </h4>
                                            <span className="ms-2 text-black-2 font-medium">{currentAddressWithoutReference.loteAddress ?? ''}</span>
                                        </div>
                                        <div className="flex items-center my-1 w-full">
                                            <h4 className="font-medium text-black dark:text-white flex items-center">
                                                <strong>Mz:</strong>
                                            </h4>
                                            <span className="ms-2 text-black-2 font-medium">{currentAddressWithoutReference.mzaAddress ?? ''}</span>
                                        </div>
                                        <div className="flex items-center my-1 w-full">
                                            <h4 className="font-medium text-black dark:text-white flex items-center">
                                                <strong>Nª Puerta:</strong>
                                            </h4>
                                            <span className="ms-2 text-black-2 font-medium">{currentAddressWithoutReference.numberAddress ?? ''}</span>
                                        </div>
                                        <div className="flex items-center my-1 w-full">
                                            <h4 className="font-medium text-black dark:text-white flex items-center" style={{ flex: 1, marginBottom: '4px' }}>
                                                <strong>Bloque:</strong>
                                            </h4>
                                            <span className="ms-2 text-black-2 font-medium">{currentAddressWithoutReference.blockAddress ?? ''}</span>
                                        </div>
                                    </div>
                                    {DireccionDetail('Referencia',currentAddressWithoutReference.referenceAddress)} 
                                    {DireccionDetail('Urbanizacion',currentAddressWithoutReference.urbanizationAddress)} 
                                    {DireccionDetail('Distrito',currentAddressWithoutReference.distric)}  
                                    {DireccionDetail('Direc.Normal.',currentAddressWithoutReference.addressNormalized)}  
                                </div>
                            </div>   
                        <div className='space-y-2'> 
                            <div className='p-2 border border-slate-900/45 rounded-lg' >  
                                <p className='border-b-4 border-b-violet-500 text-violet-500 uppercase mt-2 text-xl'>
                                    Direcciones del Cliente
                                </p>
                                {!hasDirections ? (
                                    <p className='text-center my-2'>No hay direcciones disponibles para este cliente.</p>
                                ) : ( 
                                    <div className=' max-h-[100px] overflow-y-scroll mt-2'>
                                        <table className="w-full  rounded-lg p-2 ">
                                            <tbody className='max-h-30 m-2'>
                                            {currentAddressWithoutReference.cli_direcciones.map((row, rowIndex) => (
                                                <tr
                                                    key={rowIndex}
                                                    className="hover:bg-slate-100 transition duration-200 rounded-lg  "
                                                >
                                                    <td className="text-sm text-gray-700 font-extrabold p-1">
                                                        {row?.dir_calle+' '+(row.dir_puerta??'')+' '+(row?.dir_mza??'')+' '+(row.dir_lote??'')+' '+(row.dir_bloque??'')}
                                                    </td>
                                                    <td className="text-sm text-gray-700 py-1">
                                                        <button
                                                        className="border border-purple-500 p-1 rounded transition duration-200 hover:bg-purple-200"
                                                        onClick={() => handleAddressClick(row)}
                                                        >
                                                        <SignpostIcon className='text-purple-500 '/>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                
                                {selectedAddress ? (
                                    <div className='p-2  ' >  
                                        {DireccionDetail('Calle',selectedAddress.dir_calle!)}  
                                        <div className='flex border border-dotted rounded-lg my-0.5 p-1'>
                                            <div className="flex items-center my-1 w-full">
                                                <h4 className="font-medium text-black dark:text-white flex items-center">
                                                    <strong>Lote:</strong>
                                                </h4>
                                                <p className="ms-2 text-black-2 font-medium">{selectedAddress.dir_lote || ' '}</p>
                                            </div>
                                            <div className="flex items-center my-1 w-full">
                                                <h4 className="font-medium text-black dark:text-white flex items-center">
                                                    <strong>Mz:</strong>
                                                </h4>
                                                <p className="ms-2 text-black-2 font-medium">{selectedAddress.dir_mza || ' '}</p>
                                            </div>
                                            <div className="flex items-center my-1 w-full">
                                                <h4 className="font-medium text-black dark:text-white flex items-center">
                                                    <strong>Nª Puerta:</strong>
                                                </h4>
                                                <p className="ms-2 text-black-2 font-medium">{selectedAddress.dir_puerta || ' '}</p>
                                            </div>
                                            <div className="flex items-center" style={{ flex: 1, marginBottom: '4px' }}>
                                                <h4 className="font-medium text-black dark:text-white flex items-center">
                                                    <strong>Bloque:</strong>
                                                </h4>
                                                <p className="ms-2 text-black-2 font-medium">{selectedAddress.dir_bloque || ' '}</p>
                                            </div>
                                        </div>
                                        {DireccionDetail('Referencia',selectedAddress.dir_referencia!)}  
                                        {DireccionDetail('Urbanización',selectedAddress.dir_urbaniz!)}  
                                        {DireccionDetail('Distrito',selectedAddress.dir_distrito!)}   
                                        {DireccionDetail('Direc.Normal.',selectedAddress.dir_normalizada!)}   
                                    </div>
                                ) : (
                                    <div className='mt-4   text-center' > No hay dirección seleccionada.  </div>
                                )}


                            </div>  
                            {(addressAuto.length<=0 &&selectedAddress) && (
                                <div className='p-2 border border-slate-900/45 rounded-lg' >
                                    <div className=' flex justify-between'>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={async () => { 
                                                    await handlerManualGeorefModal(selectedAddress.dir_geo_id!);
                                                    ToastCustom.fire({
                                                        icon: 'success',
                                                        title: 'Georreferenciación completa con exito',
                                                    });
                                                    setOpenModalContentAddress(false); 
                                            }} 
                                        >
                                            Georreferenciar
                                        </Button>
                                        <Button color='primary' variant='contained' onClick={()=>handlerShowPointWithAddressClient(currentAddressWithoutReference,selectedAddress.dir_lng,selectedAddress.dir_lat!,currentAddressWithoutReference.streetAddress )}>
                                            Ubicar
                                        </Button>
                                    </div> 
                                </div> 
                            )} 
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value={valueTab} index={1}>
                    <div className='gap-3 grid grid-cols-2' >
                        <div className='border border-slate-900/45 p-2 rounded grid grid-cols-1 gap-2'>
                            <p  className='border-b-4 border-b-violet-500 text-violet-500 uppercase  text-xl' >
                                CLIENTE INGRESADO
                            </p>
                                {/* Nombre Cliente (Siempre Visible) */}
                                {DireccionDetail('Nombre Cliente',currentAddressWithoutReference.cliente)}  
                                {DireccionDetail('Shipper',currentAddressWithoutReference.shipper)}   
                                {DireccionDetail('Numero Guía',currentAddressWithoutReference.guia)}   
                                {DireccionDetail('Email',currentAddressWithoutReference.cli_email)}  
                                {DireccionDetail('Telefono',currentAddressWithoutReference.cli_tel)}  
                            <p  className='border-b-4 border-b-violet-500 text-violet-500 uppercase  text-xl' >
                                CLIENTE PROCESADO
                            </p>
                            {DireccionDetail('Nombre Cliente',listDataClient.nombre_cliente)}  
                        </div>
                        <div className='border border-slate-900/45 p-2 rounded'> 
                            <Accordion>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                className='text-xl text-purple-500'
                                >
                                Nombres del Cliente
                                </AccordionSummary>
                                <AccordionDetails>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border-collapse border border-gray-200">
                                        <thead>
                                        <tr className="bg-black-2 text-white">
                                            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600 font-bold">
                                            Nombres
                                            </th> 
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {listDataClient.data_nombres&&listDataClient.data_nombres.length>0 ? listDataClient.data_nombres.map((clientName,i)=> 
                                                (<tr className="hover:bg-gray-50" key={i}>
                                                    <td className="border border-gray-300 px-4 py-2">{clientName.nombre_cliente}</td>
                                                </tr> )
                                            ):(<tr className="hover:bg-gray-50">
                                                <td className="px-4 py-2 text-center" colSpan={4}>Sin Datos</td> 
                                            </tr>)}
                                        
                                        </tbody>
                                    </table>
                                </div>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2-content"
                                id="panel2-header"
                                className='text-xl text-purple-500'
                                >
                                Telefonos del Cliente
                                </AccordionSummary>
                                <AccordionDetails>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border-collapse border border-gray-200">
                                        <thead>
                                        <tr className="bg-black-2 text-white">
                                            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600 font-bold">
                                            Celular 
                                            </th> 
                                            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600 font-bold">
                                            Fecha Creación 
                                            </th> 
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {listDataClient.data_telefonos && listDataClient.data_telefonos.length>0 ? listDataClient.data_telefonos.map((clientPhone,i)=> 
                                                (<tr className="hover:bg-gray-50" key={i}>
                                                    <td className="border border-gray-300 px-4 py-2">{clientPhone.telefono}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{clientPhone.fecha}</td>
                                                </tr> )
                                            ):(<tr className="hover:bg-gray-50">
                                                <td className="px-4 py-2 text-center" colSpan={4}>Sin Datos</td> 
                                            </tr>)}
                                        
                                        </tbody>
                                    </table>
                                </div>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion >
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel3-content"
                                id="panel3-header"
                                className='text-xl text-purple-500'
                                >
                                Emails del Cliente
                                </AccordionSummary>
                                <AccordionDetails>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border-collapse border border-gray-200">
                                        <thead>
                                        <tr className="bg-black-2 text-white">
                                            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600 font-bold">
                                            Email 
                                            </th> 
                                            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600 font-bold">
                                            Fecha Creación 
                                            </th> 
                                        </tr>
                                        </thead>
                                        <tbody>
                                            { listDataClient.data_emails && listDataClient.data_emails.length>0 ? listDataClient.data_emails.map((clientEmail,i)=> 
                                                (<tr className="hover:bg-gray-50" key={i}>
                                                    <td className="border border-gray-300 px-4 py-2">{clientEmail.email}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{clientEmail.fecha}</td>
                                                </tr> )
                                            ):(<tr className="hover:bg-gray-50">
                                                <td className="px-4 py-2 text-center" colSpan={4}>Sin Datos</td> 
                                            </tr>)}
                                        
                                        </tbody>
                                    </table>
                                </div>
                                </AccordionDetails> 
                            </Accordion>      
                        </div>
                    </div> 
                </TabPanel>  
            </DialogContent>
        </Dialog>
    );
};

export default ModalContentAddress;
