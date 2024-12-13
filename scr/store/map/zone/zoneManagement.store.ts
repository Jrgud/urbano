import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'
import { PointsDoor, RouteDictionary, ZoneMap, Option, PolygonDistrict, ILayerDoors } from "../../../interfaces/map/zone.interface"; 
import geo_back_api from "../../../api/ruteo_back.api";
import {ToastCustom}  from "../../../helpers/toast.helper"; 
import { withBackdrop } from "../../../helpers/general.helper";
import {  GeorefPoints } from "../../../interfaces/georef/georef.interface"; 
import Marker1 from '../../../images/map/marker-1.png'
import Marker2 from '../../../images/map/marker-2.png'
import Marker3 from '../../../images/map/marker-3.png'
import Marker4 from '../../../images/map/marker-4.png'
import Marker5 from '../../../images/map/marker-5.png'
import Marker6 from '../../../images/map/marker-6.png'


interface ZoneMapState{ 
  pointsDoor:PointsDoor[];
  getPointsLayerByZone:  (id:number) => Promise<PointsDoor[]>; 
  addOrUpdateDoor:  (data:any) => Promise<void>; 
  zones:ZoneMap[];
  getZoneLayerByDistric:  (id:number,idTypeZone:number) => Promise<ZoneMap[]>; 
  addZoneMap:(zoneMap:ZoneMap)=> Promise<void>; 
  deleteZoneMap:(id:number)=> Promise<void>; 
  departament:{
    data:[],
    title:string,
  };
  getAllDepartament:()=>Promise<{}>; 
  province:{
    data:Option[],
    title:string,
  };
  getAllProvince:(id:number)=>Promise<{}>; 
  district:{
    data:Option[],
    title:string,
    name:string
  };
  getAllDistric:(id:number)=>Promise<{}>; 
  type_zone:{
    data:Option[],
    title:string,
    name:string
  };
  type_zone_all:{
    data:Option[],
    title:string,
    name:string
  };
  getTypeZone:(id:number)=>Promise<{}>; 
  commands:{
    data:Option[],
    title:string,
  };
  deleteInventary:(id:number,user_id:number)=> Promise<void>; 
  deleteDictionary:(id:number,user_id:number)=> Promise<void>; 
  deleteDoors:(id:number,user_id:number)=> Promise<void>; 
  addDictionary:(data:RouteDictionary)=> Promise<number>; 
  listTypeZone:()=> Promise<void>; 
  listTypeWithAllZone:()=> Promise<void>; 
  getDoorsByGeoref: (data:GeorefPoints) => Promise<any>; 
  //getPolygonDistrict: (data:GeorefPoints) => Promise<PolygonDistrict>; 
  polygonDistrict:PolygonDistrict;
  layersDoors:ILayerDoors[]; 
  setLayerDoors: (countTypeDoors: Record<string, number>) => void;
}


const storeApi:StateCreator<ZoneMapState,[["zustand/devtools", never], ["zustand/immer", never]]>=(set,get)=>({  
  setLayerDoors:(countTypeDoors: Record<string, number>)=>{
    const newLayerDoors= get().layersDoors.map(k=>{
      return {...k,countDoors:countTypeDoors[k.id]}
    });
    console.log(newLayerDoors)
    set((state)=>{ state.layersDoors= newLayerDoors });
  },
  layersDoors:[
    { id:'marker1',icon:Marker1,description:'0' ,countDoors:0 },
    { id:'marker6',icon:Marker6,description:'1<= a <=2' ,countDoors:0 },
    { id:'marker2',icon:Marker2,description:'3<= a <=4' ,countDoors:0 },
    { id:'marker3',icon:Marker3,description:'5<= a <=6' ,countDoors:0 },
    { id:'marker4',icon:Marker4,description:'7<= a <=8' ,countDoors:0 },
    { id:'marker5',icon:Marker5,description:'9>=' ,countDoors:0 },
  ],
  polygonDistrict:{
    ciu_id: 0,
    dep_id: 0,
    prv_id: 0,
    puntos:[],
  }, 
  getDoorsByGeoref: async (data:GeorefPoints) => {
    const dataResponse=await withBackdrop(async () => {
      const response = await geo_back_api.post(`/georef/listDoorsByGeoref`,data); 
      set((state)=>{ state.pointsDoor= response.data.data });
      return get().pointsDoor;
    }); 
    return dataResponse;  
  },
  commands:{
    data:[
      {label:'Gestion Geocerca',value:1},
    ],
    title:'Funcionalidad',
  },
  type_zone:{
    data:[],
    title:'Seleccione tipo de zona',
    name:'zona_tipo',
  },
  type_zone_all:{
    data:[],
    title:'Seleccione tipo de zona',
    name:'zona_tipo',
  },
  getTypeZone:async ()=>{
    await withBackdrop(async () => {
      const response = await geo_back_api.get(`/zone/getTypeZone`); 
      console.log(response)
      set(state=>{ state.type_zone.data= response.data.data.map((k:any)=> {return {label:k.dep_nombre,value:k.dep_id}}) });
    });
    return get().type_zone;
 
  },
  departament:{
    data:[],
    title:'Seleccione el departamento',
  },
  getAllDepartament:async ()=>{
    await withBackdrop(async () => {
      const response = await geo_back_api.get(`/zone/getDepartaments`);
      set(state=>{ state.departament.data= response.data.data.map((k:any)=> {return {label:k.dep_nombre,value:k.dep_id}}) });
    });
    return get().departament;
  },
  province:{
    data:[],
    title:'Seleccione el provincia',
  },
  getAllProvince:async (id:number)=>{
    await withBackdrop(async () => {
      const response = await geo_back_api.get(`/zone/getProvinces/${id}`);
      set(state=>{ state.province.data= response.data.data.map((k:any)=> {return {label:k.prv_nombre,value:k.prv_id}}) });
    });
    return get().province;
  },
  district:{
    data:[],
    title:'Seleccione el distrito',
    name:'ciu_id',
  },
  getAllDistric:async (id:number)=>{
    await withBackdrop(async () => {
      const response = await geo_back_api.get(`/zone/getDistrics/${id}`);
      set(state=>{ state.district.data= response.data.data.map((k:any)=> {return {label:k.ciu_nombre,value:k.ciu_id}}) });
 
    });
    return get().district;
  },
  zones:[], 
  getZoneLayerByDistric: async (id:number,idTypeZone:number) => {
    await withBackdrop(async () => {
      const response = await geo_back_api.get(`/zone/getZoneByDistric/${id}/${idTypeZone}`);
      const responsePolygonDistrict = await geo_back_api.get(`/zone/zoneDisticById/${id}`);
      set((state)=>{ 
        state.polygonDistrict= responsePolygonDistrict.data.data[0]
      });

      set((state)=>{ 
        state.zones= response.data.data
      });
    });
    return get().zones;
  },
  addZoneMap:async(zoneMap)=>{  
    await withBackdrop(async () => {
        const response = await geo_back_api.post('/zone/addZonesMap', zoneMap);   
        const message=response.data.sql_msn;
          
        ToastCustom.fire({
            icon: "success",
            title:message
          }); 
    });        
  },
  deleteZoneMap:async(id:number)=>{  
    await withBackdrop(async () => {
        const response = await geo_back_api.delete(`/zone/deleteZone/${id}`);   
        const message=response.data.sql_msn; 
        ToastCustom.fire({
            icon: "success",
            title:message
          }); 
    }); 
  },
  pointsDoor:[],
  getPointsLayerByZone: async (id:number) => {
    await withBackdrop(async () => {
      const response = await geo_back_api.get(`/zone/getPointsByZone/${id}`);
      set((state)=>{ state.pointsDoor= response.data.data });
    });
    return get().pointsDoor;
  },
  addOrUpdateDoor:async (data:any)=>{
    await withBackdrop(async () => {
      const response = await geo_back_api.post(`/zone/addOrUpdateDoor`,data);
      const message=response.data.sql_msn; 
      ToastCustom.fire({
          icon: "success",
          title:message
        }); 
    }); 
  },
  deleteInventary:async(id,user_id)=> {
    await withBackdrop(async () => {
      const response = await geo_back_api.delete(`/zone/deleteFromInventory/${id}/${user_id}`);   
      const message=response.data.sql_msn; 
      ToastCustom.fire({
          icon: "success",
          title:message
      }); 
    }); 
  }, 
  deleteDictionary:async(id,user_id)=> {
    await withBackdrop(async () => {
      const response = await geo_back_api.delete(`/zone/deleteAddressDictionary/${id}/${user_id}`);   
      const message=response.data.sql_msn; 
      ToastCustom.fire({
          icon: "success",
          title:message
      }); 
    }); 
  }, 
  deleteDoors:async(id,user_id)=> {
    await withBackdrop(async () => {
      const response = await geo_back_api.delete(`/zone/deleteDoor/${id}/${user_id}`);   
      const message=response.data.sql_msn; 
      ToastCustom.fire({
          icon: "success",
          title:message
      }); 
    }); 
  }, 
  addDictionary: async(data:RouteDictionary)=> {
    const dataResponse=await withBackdrop(async () => {
      const {data:reponseData} = await geo_back_api.put(`/zone/moveInventoryToDictionary`,data);  

      const message=reponseData.sql_msn; 
      ToastCustom.fire({
          icon: "success",
          title:message
        }); 
        return reponseData.id_diccionario
    }); 
    return dataResponse as number;
  }, 
  listTypeZone: async()=> {
    await withBackdrop(async () => {
      const response = await geo_back_api.get(`/zone/typeZone`);   
      set(state=>{ state.type_zone.data= response.data.data.map((k:any)=> {return {label:k.area_nombre,value:k.area_id}}) });  
    });
  }, 
  listTypeWithAllZone: async()=> {
    await withBackdrop(async () => {
      const response = await geo_back_api.get(`/zone/typeZone`);   
      const dataOption=[{label:'TODOS',value:0},...response.data.data.map((k:any)=> {return {label:k.area_nombre,value:k.area_id}}) ]
      set(state=>{ state.type_zone_all.data= dataOption });  
    });
  }, 
});


export const useZoneMapStore=create<ZoneMapState>()(
  devtools(
    // persist(
      immer(
        storeApi
      )
    //   ,{
    //     name:'zone-map-store',
    //   }
    // )
  )
);