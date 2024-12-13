import  { useEffect, useState } from 'react'; 
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'; 
import { Button, Dialog, DialogContent, IconButton, TextField } from '@mui/material';
import MultiSelectWithSearch from '../../components/Forms/SelectGroup/Selectmultiple';
import { usePerformanceStore } from '../../store/dashboard/performace.strore'; 
import { PerformanceDetailUser, PerformanceType } from '../../types/dashboard-performance';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
 

const ECommerce= () => {   
  const handleChangeValuesForm=usePerformanceStore(state=>state.handleChangeValuesForm)
  const handleSelectionChange=usePerformanceStore(state=>state.handleSelectionChange)
  const getUsers=usePerformanceStore(state=>state.getUsers)
  const formPerformance=usePerformanceStore(state=>state.formPerformance)
  const users=usePerformanceStore(state=>state.users)
  const getListPerformance=usePerformanceStore(state=>state.getListPerformance)
  const getListPerformanceDetail=usePerformanceStore(state=>state.getListPerformanceDetail)
  const listPerformanceDetail=usePerformanceStore(state=>state.listPerformanceDetail)
  const listPerformance=usePerformanceStore(state=>state.listPerformance) 

  const listPerformanceActivities=usePerformanceStore(state=>state.listPerformanceActivities)  
  const getListACtivitiesPerformance=usePerformanceStore(state=>state.getListACtivitiesPerformance)  
  const [dashboard,setDashboard]=useState<ApexOptions>({
    colors: ['#3C50E0' ],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    }, 
    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: '25%',
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: false,
    }, 
    xaxis: {
      categories: [ ],
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
  
      markers: {
        radius: 99,
      },
    },
    fill: {
      opacity: 1,
    },
    series: [
        {
            name: 'Total Procesado',
            data: [],
        }
    ],
  })
 
  const [showPerformanceDetailDialog,setShowPerformanceDetailDialog]=useState(false)
  const [showPerformanceActivitiesDialog,setShowPerformanceActivitiesDialog]=useState(false)
  const handleOpenDialogDetail=(deatil:PerformanceType)=>{
    setShowPerformanceDetailDialog(true) 
    const data={
      initDate:formPerformance.initDate,
      endDate:formPerformance.endDate,
      userId:deatil.usu_id
    }
    getListPerformanceDetail(data)
  }
  const handleOpenDialogActivities=(deatil:PerformanceDetailUser)=>{
    setShowPerformanceActivitiesDialog(true)
    const data={
      date:deatil.log_fecha, 
      userId:deatil.usu_id
    }
    getListACtivitiesPerformance(data)
  }
  useEffect(()=>{
    getUsers()
  },[])
  useEffect(()=>{
    if(listPerformance.length>0){ 
      const dashboardUpdated= {
        ...dashboard,
        xaxis: {...dashboard.xaxis, categories: listPerformance.map(k=>k.usu_nombre)  },
        series: [
            {
                name: 'Total Procesado',
                data: listPerformance.map(k=>k.total_procesado) ,
            }
        ]
      } 
      setDashboard(dashboardUpdated)
    }
  },[listPerformance])
  
  return (
    <>
    <Breadcrumb pageName="Dashboard Performance" /> 
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 align-middle bg-white rounded-lg p-2 mb-2">
          <MultiSelectWithSearch
            name="users"
            label={users.title}
            options={users.data}
            defaultValues ={users.data}
            onSelectionChange={handleSelectionChange} 
          />
          <TextField 
            type='date' 
            size='small' 
            name="initDate" 
            label="Fech.Ini" 
            variant="outlined" 
            onChange={handleChangeValuesForm}
            defaultValue={formPerformance.initDate}
            />
          <TextField 
            type='date' 
            size='small' 
            name="endDate" 
            label="Fech.Fin" 
            variant="outlined" 
            onChange={handleChangeValuesForm}
            defaultValue={formPerformance.endDate}
          />
          <Button 
            className='h-10'
            variant="contained" 
            color="primary" 
            type="button" 
            size='small'
            onClick={()=>getListPerformance(formPerformance)}>
              Buscar
          </Button>
      </div> 
      <div className="mt-4 bg-white rounded-lg p-2">
        <div >
          <h4 className="text-xl font-semibold text-slate-500 dark:text-white text-center uppercase">
            Total Procesado por Usuario
          </h4>
        </div>
        {dashboard ? (
            <ReactApexChart
              options={dashboard}
              series={dashboard.series}
              type="bar"
              width="100%"
              height={350}
            />
          ) : (
            <div>Cargando...</div>
          )
        }
      </div> 
      <div className="overflow-x-auto p-2 bg-white rounded-lg mt-4">
        <table className="min-w-full border-collapse border">
          <thead>
              <tr className="bg-black-2 text-white"> 
                  <th></th> 
                  <th  className='p-2 font-medium text-right' >Nombre Empleado</th> 
                  <th  className='p-2 font-medium text-right' >Días Trabajados</th> 
                  <th  className='p-2 font-medium text-right' >Tiempo Promedio</th> 
                  <th  className='p-2 font-medium text-right' >Promedio día</th> 
                  <th  className='p-2 font-medium text-right' >Total Procesado</th> 
              </tr>
          </thead>
          <tbody>
              {listPerformance.map((row, index) => (
                <tr className="odd:bg-slate-200  " key={index}> 
                  <td className="p-2 flex justify-center">
                    <button className='bg-purple-500 rounded-full text-white p-1 hover:bg-purple-600' onClick={()=>handleOpenDialogDetail(row)}>
                        <MenuIcon/>
                    </button>
                  </td>
                  <td className='px-4 py-2 text-sm font-bold text-right'>{row.usu_nombre} </td>
                  <td className='px-4 py-2 text-sm font-bold text-right'>{row.dias_trabajados} </td>
                  <td className='px-4 py-2 text-sm font-bold text-right'>{row.tiempo_promedio} </td>
                  <td className='px-4 py-2 text-sm font-bold text-right'>{row.tiempo_promedio_por_dia} </td>
                  <td className='px-4 py-2 text-sm font-bold text-right'>{row.total_procesado} </td>
              </tr>
              ))}
          </tbody>
        </table>
      </div> 
      {/* Detail  Dialog */}
      <Dialog open={showPerformanceDetailDialog} onClose={()=>setShowPerformanceDetailDialog(false)} fullWidth maxWidth="lg">
        <div className=' text-xl font-bold my-4 text-center uppercase'>
          Detalle Performance <span className='text-purple-500'>{listPerformanceDetail[0]?.usu_nombre??''}</span> 
        </div>
            <IconButton
            aria-label="close"
            onClick={()=>setShowPerformanceDetailDialog(false)}
            sx={(theme) => ({
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
            })}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent > 
              <table className="min-w-full border-collapse border">
                <thead>
                    <tr className="bg-black-2 text-white">   
                      <th  className='p-2 text-left font-medium' >Fecha</th> 
                      <th  className='p-2 text-left font-medium' >Hora inicio</th> 
                      <th  className='p-2 text-left font-medium' >Hora fin</th> 
                      <th  className='p-2 text-left font-medium' >Tiempo trabajado</th> 
                      <th  className='p-2 text-left font-medium' >Promedio por hora</th> 
                      <th  className='p-2 text-left font-medium' >Total procesado</th> 
                    </tr>
                </thead>
                <tbody>
                    {listPerformanceDetail.map((row, index) => (
                      <tr className="odd:bg-slate-200  " key={index}>   
                        <td  className='px-4 py-2 text-sm font-bold text-left'>{row.log_fecha} </td>
                        <td  className='px-4 py-2 text-sm font-bold text-left'>{row.hora_inicio} </td>
                        <td  className='px-4 py-2 text-sm font-bold text-left'>{row.hora_fin} </td>
                        <td  className='px-4 py-2 text-sm font-bold text-left'>{row.tiempo_dia} </td>
                        <td  className='px-4 py-2 text-sm font-bold text-left'>{row.promedio_por_hora} </td>
                        <td  className='px-4 py-2 text-sm font-bold text-left'>
                          <p className='underline font-extrabold cursor-pointer' onClick={()=>handleOpenDialogActivities(row)}>{row.total_procesado} </p> 
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </DialogContent>
      </Dialog>
      {/* Activities  Dialog */}
      <Dialog open={showPerformanceActivitiesDialog} onClose={()=>setShowPerformanceActivitiesDialog(false)} fullWidth maxWidth="lg">
        <div className=' text-xl font-bold my-4 text-center uppercase'>
          Detalle Actividades
        </div>
            <IconButton
            aria-label="close"
            onClick={()=>setShowPerformanceActivitiesDialog(false)}
            sx={(theme) => ({
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
            })}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent > 
              <table className="min-w-full border-collapse border">
                <thead>
                    <tr className="bg-black-2 text-white">  
                      <th  className='p-2 text-left font-medium' >Actividad</th> 
                      <th  className='p-2 text-left font-medium' >Tiempo Utlizado</th> 
                      <th  className='p-2 text-left font-medium' >Tiempo Promedio</th> 
                      <th  className='p-2 text-left font-medium' >Total</th>  
                    </tr>
                </thead>
                <tbody>
                    {listPerformanceActivities.map((row, index) => (
                      <tr className="odd:bg-slate-200  " key={index}>  
                        <td  className='px-4 py-2 text-sm font-bold text-left'>{row.actividad} </td>
                        <td  className='px-4 py-2 text-sm font-bold text-left'>{row.tiempo_utilizado} </td>
                        <td  className='px-4 py-2 text-sm font-bold text-left'>{row.tiempo_promedio} </td>
                        <td  className='px-4 py-2 text-sm font-bold text-left'>{row.total} </td> 
                      </tr>
                    ))}
                </tbody>
              </table>
            </DialogContent>
      </Dialog>
    </>
    
  );
};

export default ECommerce;
