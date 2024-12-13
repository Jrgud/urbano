import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'
import { OptionsSelect } from "../../interfaces/general/general.interfaces";
import { withBackdrop } from "../../helpers/general.helper";
import geo_back_api from "../../api/ruteo_back.api"; 
import { parse } from "valibot";
import {   FormPerformance, FormPerformanceActivities, FormPerformanceDetail, ListPerformance, ListPerformanceActivitiesUser, ListPerformanceActivitiesUserSchema, ListPerformanceDetailUser, ListPerformanceDetailUserSchema, ListPerformanceSchema } from "../../types/dashboard-performance";
import { ChangeEvent } from "react"; 
 
interface PerfomanceState {  
    users:{
        data:OptionsSelect[],
        title:string,
    }; 
    listPerformance:ListPerformance ; 
    listPerformanceDetail:ListPerformanceDetailUser ; 
    listPerformanceActivities:ListPerformanceActivitiesUser ; 
    getUsers:  () => Promise<void>;  
    getListPerformance:  (data:FormPerformance) => Promise<void>;  
    getListPerformanceDetail:  (data:FormPerformanceDetail) => Promise<void>;  
    getListACtivitiesPerformance:  (data:FormPerformanceActivities) => Promise<void>;  
    formPerformance:FormPerformance
    handleChangeValuesForm: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    handleSelectionChange: (selectedValues: OptionsSelect[]) => void
}
const INIT_DATE=new Date().toISOString().split('T')[0]


const performanceStore:StateCreator<PerfomanceState,[["zustand/devtools", never], ["zustand/immer", never]]>=(set,get)=>({  
    
    formPerformance:{
        initDate:INIT_DATE,
        endDate:INIT_DATE,
        users:[]
    },
    handleChangeValuesForm: (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        set((state)=>{
            state.formPerformance={...get().formPerformance,[e.target.name]:e.target.value}
        })
    },
    handleSelectionChange: (selectedValues) => {
        set((state)=>{
            state.formPerformance={...get().formPerformance,users:selectedValues.map(k=>{return {userId:+k.value} })}
        })
    },
    listPerformance:[],
    listPerformanceDetail:[],
    users:{
        data:[],
        title:'Usuarios',
    }, 
    getUsers:async ()=>{
        await withBackdrop(async () => {
            const response = await geo_back_api('/dashboardPerformance/listUsers'); 
            set(state=>{ state.users.data= response.data.data.map((k:any)=> {return {label:k.usu_nombre,value:k.usuario_id}}) });
          }); 
    }, 
    getListPerformance:async (dataRequest)=>{
      const dataSendApiRequest={
          fecha_ini:dataRequest.initDate,
          fecha_fin:dataRequest.endDate,
          usuarios:dataRequest.users.map(k=>{return {id_user :k.userId} })
      }
      await withBackdrop(async () => {
          const { data:dataResponse } = await geo_back_api.post(`/dashboardPerformance/listPerformanceUsers`,dataSendApiRequest); 
          const responseValibot=parse(ListPerformanceSchema,dataResponse.data)
          set((state)=>{ state.listPerformance= responseValibot }); 
        }); 
    }, 
    getListPerformanceDetail:async (dataRequest)=>{
      const dataSendApiRequest={
          fecha_ini:dataRequest.initDate,
          fecha_fin:dataRequest.endDate,
          id_user:dataRequest.userId
      }
      await withBackdrop(async () => {
        const { data:dataResponse } = await geo_back_api.post(`/dashboardPerformance/detailPerformanceUsers`,dataSendApiRequest); 
        const responseValibot=parse(ListPerformanceDetailUserSchema,dataResponse.data)
        set((state)=>{ state.listPerformanceDetail= responseValibot }); 
      }); 
    }, 
    listPerformanceActivities:[],
    getListACtivitiesPerformance:async (dataRequest)=>{
      const dataSendApiRequest={
          fecha:dataRequest.date, 
          id_user:dataRequest.userId
      }
      await withBackdrop(async () => {
        const { data:dataResponse } = await geo_back_api.post(`/dashboardPerformance/listActivitiesByUsers`,dataSendApiRequest); 
        const responseValibot=parse(ListPerformanceActivitiesUserSchema,dataResponse.data)
        set((state)=>{ state.listPerformanceActivities= responseValibot }); 
      }); 
    }, 
   
});


export const usePerformanceStore=create<PerfomanceState>()(
  devtools( 
    immer(
        performanceStore
    ) 
  )
);