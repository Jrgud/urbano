import mapboxgl from 'mapbox-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'; // Importar estilos de Mapbox Draw
import 'mapbox-gl/dist/mapbox-gl.css';
import './../../css/map.css'; 
import { Badge, Box, Button, ButtonGroup, Divider, Drawer,  List, ListItem, ListItemButton, ListItemIcon, ListItemText,     SpeedDial,  SpeedDialAction,  TextField } from '@mui/material';
import useGeoref from '../../hooks/useGeoref/useGeoref'; 
import SearchBar from '../../components/Georef/SearchBar'; 
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import ModalContentAddress from '../../components/Georef/ModalContentAddress'; 
import SelectWithSearch from '../../components/Forms/SelectGroup/SelectSearch';
import ModalDeleteAddress from '../../components/Georef/ModalDeleteAddress';
import SmallTableWithButton from '../../components/Tables/DataTable';
import ForwardIcon from '@mui/icons-material/Forward';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import MapIcon from '@mui/icons-material/Map';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import SatelliteIcon from '@mui/icons-material/Satellite';
import GetAppIcon from '@mui/icons-material/GetApp';
import TableAddressWithReference from '../../components/Georef/TableAddressWithReference';

mapboxgl.accessToken = 'pk.eyJ1Ijoid2lsLWFwdSIsImEiOiJja2oyM25menQxNDB2MnR0ZHFveGgzZmcyIn0.92hQDorrYHX50YdP_zajZg';

// pruebas const markerRef = useRef(null);

const GeorefManual = () => {
    const {
      mapContainer,
      openDrawerBatch, 
      setOpenDrawerBatch, 
      batches,
      address,
      getBatches,
      handlerSearchAddressWithoutReference,
      initDate, 
      setInitDate,
      endDate, 
      setEndDate,
      searchAddres, 
      handleClickShowMarket,
      actionsCommands,
      openCommands,
      handleOpenCommands,
      handleCloseCommands,
      handlerClickShowCommands,
      openModalAddress, 
      openModalAddressGeoref,
      buttonActionAddress,
      openModalContentAddress, 
      setOpenModalContentAddress,
      currentAddressWithoutReference,
      inputSearchAddress,
      showButtonGetDoors,
      handlerGetDoorsByGeoref,
      handlerManualGeoref,
      addressGeoredSelected,
      currentSelectedDoor,
      handlerSelectShipper,
      handlerSelectState, 
      shippers,      
      states,
      shipperSelected,  
      stateSelected,
      districtSelected,
      departament,
      province,
      district,
      handlerSelectDepartament,
      handlerSelectProvince,
      handlerSelectDistrict,
      openModalDeleteAddress, 
      setOpenModalDeleteAddress,
      handlerDeleteAddress,
      typesErrors,
      handlerSelectTypeError,
      typeErrorSelected,
      descriptionTypeError, 
      setDescriptionTypeError,
      selectedGroupAddress, 
      setSelectedGroupAddress,
      provinceSelected,
      departamentSelected,
      radiusMarkerInMeters, 
      setRadiusMarkerInMeters,
      handlerManualGeorefModal,
      currentStyleMap,
      switchBaseMap,
      handlerShowPointWithAddressClient,
      handlerSearchAddressWithReference,
      addressAuto,
      openModalWthReferencesAddress, 
      setOpenModalWthReferencesAddress,
      handlerShowAddressWithReferences,
      handleMoveCamera,
      getListDataClient,
      listDataClient,
      currentDistrict,
      listDistrictSearch,
      searchDistrict,
      setCurrentDistrict,
      setListDistrictSearch,
      handleAnulateAddress
    }= useGeoref();  
  return (
    <div  id="mapRuteo" className="p-0 m-0 h-screen" style={{ width: '100%' }} >  
        <div ref={mapContainer}       style={{ width: '100%', height: '100%' }}   />  
        <div className={`absolute max-w-94 z-30 m-1.5 right-0 top-0 bg-white rounded-lg  border border-zinc-700 p-3 ${openModalAddressGeoref?'':'hidden'}`}>
          <SearchBar 
            radiusMarkerInMeters={radiusMarkerInMeters}      
            setRadiusMarkerInMeters={setRadiusMarkerInMeters} 
            currentAddressWithoutReference={currentAddressWithoutReference} 
            searchAddres={searchAddres} 
            handleClickShowMarket={handleClickShowMarket} 
            inputSearchAddress={inputSearchAddress} 
            currentDistrict={currentDistrict}
            listDistrictSearch={listDistrictSearch}
            searchDistrict={searchDistrict}
            setCurrentDistrict={setCurrentDistrict}
            setListDistrictSearch={setListDistrictSearch}
          />
        </div>
        <div className={`absolute z-30  left-1/2   top-0  m-2 `}>
          <ButtonGroup size="small" aria-label="Small button group" variant="contained" >
            <Button color={currentStyleMap==='default'?'warning':'primary'} key="one" onClick={()=>switchBaseMap('default')}>
              <MapIcon/>
            </Button>
            <Button key="two" color={currentStyleMap==='satelite'?'warning':'primary'} onClick={()=>switchBaseMap('satelite')}>
              <SatelliteAltIcon/>
            </Button>
            <Button key="three" color={currentStyleMap==='secondary'?'warning':'primary'} onClick={()=>switchBaseMap('secondary')}>
              <SatelliteIcon/>
            </Button>
          </ButtonGroup> 
        </div> 
        <div className={`h-screen absolute z-30 left-0 top-0   ${openModalAddress?'':'hidden'}`}>
          <SmallTableWithButton setOpenModalDeleteAddress={setOpenModalDeleteAddress} data={address} buttonActionAddress={buttonActionAddress} selectedGroupAddress={selectedGroupAddress} setSelectedGroupAddress={setSelectedGroupAddress}  />
        </div>  
        <div className={`h-screen absolute z-30 left-0 top-0   ${openModalWthReferencesAddress?'':'hidden'}`}>
          <TableAddressWithReference 
            setOpenModalWthReferencesAddress={setOpenModalWthReferencesAddress} 
            data={addressAuto}  
            buttonActionAddress={buttonActionAddress}
            selectedGroupAddress={selectedGroupAddress}  
            handlerShowAddressWithReferences={handlerShowAddressWithReferences}  
            handleMoveCamera={handleMoveCamera}
            handleAnulateAddress={handleAnulateAddress}
          />
        </div>  
        <div className={`absolute z-30  left-1/2   top-0  mt-2  ${showButtonGetDoors?'':'hidden'}`}>
          <Button variant="contained" size='small' onClick={handlerGetDoorsByGeoref} className='bg-sky-500 text-white hover:bg-sky-700'>Traer Puertas</Button>
        </div> 
        <div className={`absolute z-30  left-1/2  w-100 bottom-0 ${addressGeoredSelected.length>0 || currentSelectedDoor.direccion.length>0 ?'':'hidden'}`}>
          <div className='flex m-2 items-center'>
            <div className='my-2 border border-purple-800 border-dotted rounded-md p-2 bg-white' style={{maxHeight:100, width:200, overflowY:'scroll'}}>
              <p className='text-black text-sm font-bold'>Georeferencia:</p>
              <p className='text-black-2 text-sm'>{addressGeoredSelected}</p>
            </div>
            <div className='text-center'>
              <ForwardIcon  className=' text-red-600' />
            </div>
            <div className='my-2 border border-purple-800 border-dotted rounded-md p-2 bg-white' style={{maxHeight:100,width:200, overflowY:'scroll'}}>
              <p className='text-black text-sm font-bold'>Puerta:</p>
              <p className='text-black-2'>{currentSelectedDoor.direccion}</p>
            </div>
            <div className={`ms-2 ${(addressGeoredSelected.length>0 && currentSelectedDoor.direccion.length>0) ?'':'hidden'}`}>
              <Button 
                variant="contained" 
                size='small' 
                color='error'
                onClick={handlerManualGeoref}  
              >
                <MultipleStopIcon/>
              </Button>
            </div>
          </div>
        </div> 
        <Drawer open={openDrawerBatch} onClose={()=>setOpenDrawerBatch(false)}  anchor='right'  >
          <Box className="bg-white  p-3"  sx={{ flexGrow: 1 }} style={{maxHeight:250,maxWidth:450}}>
            <div className='mb-5'>
              <h2 className='font-bold text-2xl'>Grupo de Lotes</h2>
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <div>
                <TextField 
                className='w-full'
                  label='Fech.Ini'
                  id="filled-hidden-label-small"
                  defaultValue={initDate}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  onChange={(e)=>setInitDate(e.target.value)}
                  size="small"
                  type='date'
                />
              </div>
              <div>
                <TextField 
                className='w-full'
                  label='Fech.Fin'
                  id="filled-hidden-label-small"
                  defaultValue={endDate} 
                  onChange={(e)=>setEndDate(e.target.value)}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  size="small"
                  type='date'
                />
              </div>
              <div>
                <SelectWithSearch options={shippers} onOptionSelect={handlerSelectShipper} defaultValue={shipperSelected} />
              </div>
              <div>
                <SelectWithSearch options={states} onOptionSelect={handlerSelectState} defaultValue={stateSelected}/>
              </div>
              <div>
                <SelectWithSearch options={departament} onOptionSelect={handlerSelectDepartament} defaultValue={departamentSelected}/>
              </div>
              <div>
                <SelectWithSearch options={province} onOptionSelect={handlerSelectProvince} defaultValue={provinceSelected} />
              </div>
              <div>
                <SelectWithSearch options={district} onOptionSelect={handlerSelectDistrict} defaultValue={districtSelected}/>
              </div>
              <div  >
                <Button   className="w-full h-full" onClick={()=>getBatches(initDate,endDate,shipperSelected, stateSelected,districtSelected)} size='small' variant="contained">Buscar</Button>
              </div> 
            </div> 
          </Box>
          <Divider />
          <Box className="w-full p-3" role="presentation" >
            <div className='mb-5 w-full'>
              <h2 className='font-bold text-2xl text-center'>Lotes</h2>
            </div>
            <Divider />
            <List>
              {batches.map((batch) => (
                <ListItem key={batch.batchId} className='border border-l-strokedark rounded-lg mt-1' >
                  <ListItemButton onClick={()=>handlerSearchAddressWithoutReference(batch.batchId,stateSelected,shipperSelected,districtSelected)}>
                    <ListItemIcon  >
                    <Badge badgeContent={batch.total} color="primary" max={9999}>
                      <GetAppIcon  />
                    </Badge>
                    </ListItemIcon> 
                    <ListItemText primary={batch.batchDate+'-'+batch.hour} />
                  </ListItemButton>
                    <Badge 
                    className='cursor-pointer hover:bg-slate-500 p-2 rounded-lg'
                    onClick={()=>handlerSearchAddressWithReference(batch.batchId,stateSelected,shipperSelected,districtSelected)}
                    badgeContent={batch.total_geo} color="warning" max={9999} >
                      <GetAppIcon  className='rotate-180' />
                    </Badge>
                </ListItem>
              ))}
            </List> 
          </Box>
        </Drawer> 

        <SpeedDial
            ariaLabel="Commands"
            className="absolute z-30 m-1.5 right-0 bottom-0"
            icon={<SpeedDialIcon />}
            onClose={handleCloseCommands}
            onOpen={handleOpenCommands}
            // direction='down'
            open={openCommands}
          >
            {actionsCommands.map((action) => (
              <SpeedDialAction 
                sx={{
                  bgcolor: '#3b82f6',  
                  color:'white',  // Cambia el color del texto (icono)
                  '&:hover': {
                    bgcolor: '#3b82f6', // Cambia el color al hacer hover
                  }
                }}
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                // tooltipOpen
                // TooltipClasses={bg}
                onClick={()=>handlerClickShowCommands(action.value)}
              />
            ))}
        </SpeedDial>

        <ModalContentAddress 
          handlerShowPointWithAddressClient={handlerShowPointWithAddressClient}
          openModalContentAddress={openModalContentAddress} 
          setOpenModalContentAddress={setOpenModalContentAddress}
          handlerManualGeorefModal={handlerManualGeorefModal}
          currentAddressWithoutReference={currentAddressWithoutReference}
          getListDataClient={getListDataClient}
          listDataClient={listDataClient}
          addressAuto={addressAuto}
        />
        <ModalDeleteAddress
          openModalDeleteAddress={openModalDeleteAddress} 
          setOpenModalDeleteAddress={setOpenModalDeleteAddress}
          currentAddressWithoutReference={currentAddressWithoutReference}
          handlerDeleteAddress={handlerDeleteAddress}
          typesErrors={typesErrors}
          handlerSelectTypeError={handlerSelectTypeError}
          typeErrorSelected={typeErrorSelected}
          descriptionTypeError={descriptionTypeError}
          setDescriptionTypeError={setDescriptionTypeError}
          selectedGroupAddress={selectedGroupAddress}
          address={address}
        />

    </div>
  );
};

export default GeorefManual;
