import { Box, Button, Modal, TextField } from '@mui/material'
import MapIcon from '@mui/icons-material/Map';
import { Address } from '../../interfaces/georef/georef.interface';
import { OptionsSelect } from '../../interfaces/general/general.interfaces';
import SelectWithSearch from '../Forms/SelectGroup/SelectSearch';


interface ModalDeleteAddressProps {
    openModalDeleteAddress: boolean;
    setOpenModalDeleteAddress: (open: boolean) => void;
    handlerDeleteAddress: (tbad_id: number, dir_apunts: string) => void;
    currentAddressWithoutReference:Address;
    typeErrorSelected: number;
    typesErrors: {
        data: OptionsSelect[];
        title: string;
    };
    handlerSelectTypeError: (option: OptionsSelect) => void;
    descriptionTypeError: string;
    setDescriptionTypeError: React.Dispatch<React.SetStateAction<string>>;
    selectedGroupAddress:number[];
    address:Address[];
}


const ModalDeleteAddress = ({
        openModalDeleteAddress,
        setOpenModalDeleteAddress,
        currentAddressWithoutReference,
        handlerDeleteAddress,
        typesErrors,
        handlerSelectTypeError,
        typeErrorSelected,
        descriptionTypeError,
        setDescriptionTypeError,
        selectedGroupAddress,
        address
    }:ModalDeleteAddressProps) => {
  return (
    <Modal
        open={openModalDeleteAddress}
        onClose={()=>setOpenModalDeleteAddress(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box className='rounded-md' sx={{ position: 'absolute', top: '50%',left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, }}>
            <div className="border border-stroke bg-white shadow-default rounded-md  p-4">
                <div className="gad items-end gap-1 ">
                    <div className='text-center align-items '> 
                        <h4 className="text-2xl  mb-4 font-medium text-black dark:text-white">
                            Eliminar Dirección
                        </h4>
                    </div>
                    <div className='grid grid-cols-1 gap-2 ' style={{maxHeight:200,overflowY:'scroll'}}>
                        {
                            selectedGroupAddress.length<=0
                            ?(<div className='border border-dotted rounded-lg my-1 p-2'  > 
                                <h4 className="font-medium text-black dark:text-white flex items-center">
                                    <MapIcon></MapIcon>
                                    Calle:
                                    <p className="ms-2 text-black-2 text-xs font-medium">{currentAddressWithoutReference.streetAddress}</p> 
                                </h4> 
                            </div> )
                            :(
                                address.filter(f=>selectedGroupAddress.some(s=>s==f.idAddress)).map(k=>{ return (
                                    <div className='border border-dotted rounded-lg my-1 p-2'  key={k.idAddress} > 
                                        <h4 className="font-medium text-black dark:text-white flex items-center">
                                            <MapIcon></MapIcon>
                                            Calle:
                                            <p className="ms-2 text-black-2 text-xs font-medium">{k.streetAddress}</p> 
                                        </h4> 
                                    </div>
                                ) })
                            )
                        }
                           
                    </div>
                    <div className='grid grid-cols-1 gap-2 mt-4'>
                        <div>
                            <SelectWithSearch options={typesErrors} onOptionSelect={handlerSelectTypeError} />
                        </div>
                        <div>
                        <TextField
                            className='w-full'
                            label="Detalle del error"
                            multiline
                            onChange={(e)=>setDescriptionTypeError(e.target.value)}
                            rows={4}
                        />
                        </div> 
                        <div>
                        <Button 
                            disabled={(descriptionTypeError.length>0 && typeErrorSelected!==0 ) ?false :true}
                            variant="contained" color="error" className='w-full'
                            onClick={()=>handlerDeleteAddress(typeErrorSelected,descriptionTypeError)}
                        >
                            Eliminar
                        </Button> 
                        </div>
                    </div>
                </div> 
            </div>
        </Box>
    </Modal>
  )
}

export default ModalDeleteAddress
