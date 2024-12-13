import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'
import { OptionsSelect } from "../../interfaces/general/general.interfaces";
import { withBackdrop } from "../../helpers/general.helper";
import geo_back_api, { HERE_MAPS_ROUTING_API_KEY } from "../../api/ruteo_back.api";
import { FormPreRuta, GroupBatch, GroupBatchDetailList, GroupBatchDetailSchemaList, GroupBatchList, GroupBatchSchemaList, OptimalRoute, OptimalRoutechema, RoutesListType, RoutesSchemaList } from "../../types/preruta";
import { parse } from "valibot";
import axios from "axios";
 
interface PreRutaState { 
    agency:{
        data:OptionsSelect[],
        title:string,
    };
    area:{
        data:OptionsSelect[],
        title:string,
    };
    groupBatch:GroupBatchList ;
    groupBatchDetail:GroupBatchDetailList ;
    getAgencies:  () => Promise<void>; 
    getAreas:  () => Promise<void>; 
    getGroupBatches:  (data:FormPreRuta) => Promise<void>; 
    getGroupBatchesDetail:  (loteId:number) => Promise<void>; 
    optimalRoute:OptimalRoute,
    getOptimalRoute: (currentGroupBatch: GroupBatch) => Promise<void>
    routesPolyLine:RoutesListType
}


const preRutaStore:StateCreator<PreRutaState,[["zustand/devtools", never], ["zustand/immer", never]]>=(set,get)=>({  
    routesPolyLine:[],
    optimalRoute:{} as OptimalRoute,
    groupBatch:[],
    groupBatchDetail:[],
    agency:{
        data:[],
        title:'Agencia',
    },
    area:{
        data:[],
        title:'Área de Distribución',
    },  
    getAgencies:async ()=>{
        await withBackdrop(async () => {
            const response = await geo_back_api('/pre-ruta/listaSucursales'); 
            set(state=>{ state.agency.data= response.data.data.map((k:any)=> {return {label:k.sucursal_nombre,value:k.sucursal_id}}) });
          }); 
    },
    getAreas:async ()=>{
        await withBackdrop(async () => {
            const response = await geo_back_api('/pre-ruta/listaAreas'); 
            set(state=>{ state.area.data= response.data.data.map((k:any)=> {return {label:k.area_nombre,value:k.area_id}}) });
          }); 
    },
    getGroupBatches:async (dataRequest)=>{
        await withBackdrop(async () => {
            const { data:dataResponse } = await geo_back_api.post(`/pre-ruta/Consultar`,dataRequest); 
            const responseValibot=parse(GroupBatchSchemaList,dataResponse.data)
            set((state)=>{ state.groupBatch= responseValibot });
          }); 
    },
    getGroupBatchesDetail:async (loteId)=>{
        await withBackdrop(async () => {
            const {data:dataResponse} = await geo_back_api(`/pre-ruta/ConsultarDet/${loteId}`); 
            const responseValibot=parse(GroupBatchDetailSchemaList,dataResponse.data)
            set((state)=>{ state.groupBatchDetail= responseValibot });
             
        }); 
    },
    getOptimalRoute : async (currentGroupBatch:GroupBatch  ) => {
        const origin = `Inicio;${currentGroupBatch.paradas_posicion[0].lat},${currentGroupBatch.paradas_posicion[0].lng}`;
        const end = `Fin;${currentGroupBatch.paradas_posicion[0].lat},${currentGroupBatch.paradas_posicion[0].lng}`;
        const vias = currentGroupBatch.paradas_posicion.slice(1).map(({ lat, lng,geo_id } ) => `${geo_id};${lat},${lng}`);

        await withBackdrop(async () => {
            // Configurar los parámetros incluyendo cada `via` correctamente
            const params: Record<string, boolean|string|number >  = {
                mode: "fastest;car;traffic:disabled",
                start:origin ,
                end  ,
                departure: "2021-10-15T00:30:00-05:00", 
                transportMode: 'car', 
                optimizeWaypoints: true,
                apiKey: HERE_MAPS_ROUTING_API_KEY,
                improveFor: "TIME",
                restTimes: "disabled", 
            }; 
            vias.map((via,index)=>{ params[`destination${index+1}`]= via})

            const {data} = await axios.get('https://wps.hereapi.com/v8/findsequence2', { params }); 
            console.log(data)
            const responseValibot=parse(OptimalRoutechema,data.results[0])
            set((state)=>{ state.optimalRoute= responseValibot });
            //Obtener Polyline
            // Configurar los parámetros incluyendo cada `via` correctamente
            const paramsPolyLine  = {
                origin: responseValibot.waypoints[0].lat+','+responseValibot.waypoints[0].lng,
                destination: responseValibot.waypoints[responseValibot.waypoints.length-1].lat+','+responseValibot.waypoints[responseValibot.waypoints.length-1].lng,
                via:responseValibot.waypoints.slice(1,-1).map(k=>[k.lat,k.lng].join(',')).join("&via="),
                routingMode: 'fast',
                transportMode: 'car',
                departureTime: 'any',
                return: 'polyline,summary',
                apiKey: HERE_MAPS_ROUTING_API_KEY, 
            };   
            const baseUrl = "https://router.hereapi.com/v8/routes";
            const url = `${baseUrl}?origin=${paramsPolyLine.origin}&destination=${paramsPolyLine.destination}&via=${paramsPolyLine.via}&transportMode=${paramsPolyLine.transportMode}&return=${paramsPolyLine.return}&apiKey=${paramsPolyLine.apiKey}`;
            const {data:responsePolyLine} = await axios.get(url); 
            console.log(responsePolyLine)
            const responseRoutesValibot=parse(RoutesSchemaList,responsePolyLine.routes[0].sections)
            set((state)=>{ state.routesPolyLine= responseRoutesValibot });
        }); 
    },  
});


export const usePreRutaStore=create<PreRutaState>()(
  devtools( 
    immer(
        preRutaStore
    ) 
  )
);