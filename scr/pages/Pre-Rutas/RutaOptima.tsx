import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import './../../css/map.css';  
import usePreRuta from '../../hooks/RutaOptima/usePreRuta';
import { Button, ButtonGroup } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import SatelliteIcon from '@mui/icons-material/Satellite';
import RouteIcon from '@mui/icons-material/Route';
import MenuIcon from '@mui/icons-material/Menu'; 
import { ListZoneDrawer } from '../../components/PreRuta/ListZoneDrawer';
import { formatSecondsToTimeString } from '../../helpers/time.helper';


const RutaOptima = () => { 
    
    const { 
        switchBaseMap,
        groupBatch,
        handleCheckboxChange,
        mapContainerRef,
        currentStyleMap,
        handleGetOptimalRoute,
        currentGroupBatch,
        drawerOpen, 
        setDrawerOpen,
        optimalRoute
      }=usePreRuta();
    
    return (
        <div id="map-container" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}> 
            <div className={`absolute top-1 left-1 z-99 bg-white rounded-lg ${Object.values(optimalRoute).length>0   ?'':'hidden'}`} >
                <div className='m-2 border border-dotted rounded-lg'>
                    <div className="grid gap-1 m-2">
                        <p className="mx-1 text-black-2 text-xs my-1 font-extrabold uppercase text-center"> Ruta Optima</p> 
                        <div className="text-xs bg-purple-600/20  rounded-lg border-2 border-purple-600 ">
                            <p className="mx-2 text-black-2 font-extrabold">&#128666; &#10148; {(+optimalRoute?.distance /1000).toFixed(2)}km</p>
                            <p className="mx-2 text-black-2 font-extrabold">&#9200; &#10148; {formatSecondsToTimeString(optimalRoute?.time ? +optimalRoute?.time:0)}</p>
                        </div>  
                        <button className='bg-blue-300 hover:bg-blue-600 p-1 rounded-lg text-black-2 hover:text-white font-bold border-2 border-blue-800'>
                            Guardar
                        </button>
                    </div>
                </div>
            </div >
            <div className='absolute top-5 right-5 z-99 grid gap-2' >
                <button 
                    type='button'
                    onClick={() => setDrawerOpen(true)} 
                    className='bg-purple-600 text-white p-2 rounded-full'
                >
                    <MenuIcon />
                </button>
                <button 
                    className={`bg-blue-500 text-white rounded-full hover:bg-blue-600 p-2 ${Object.values(currentGroupBatch).length>0  ?'':'hidden'}`} 
                    type='button' 
                    onClick={handleGetOptimalRoute}
                >
                    <RouteIcon/>
                </button>
            </div>
            <ListZoneDrawer groupBatch={groupBatch} handleCheckboxChange={handleCheckboxChange} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}></ListZoneDrawer> 
            <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} /> 
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
        </div>
    );
}

export default RutaOptima;
