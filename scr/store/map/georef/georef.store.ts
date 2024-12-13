import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'
import { Batch,   Address, searchAddres, AddressGeoref, GeorefPoints, DoorsGeoref, ManualGeoref, GeorefDoorsRadius, AddressAuto, Client, ListSearchDistrict, ListSearchDistrictSchema, AnulateAddress } from "../../../interfaces/georef/georef.interface"; 
import geo_back_api, { api_map_box } from "../../../api/ruteo_back.api";
import {  ToastCustom }  from "../../../helpers/toast.helper";
import { JsonDataClientToDataClientMapper, JsonDoorsToDoorsMapper, JsonHearToAddresMapper, JsonMapBoxToAddresMapper, JsonToAddressAutoMapper, JsonToAddressMapper, JsonToBatchMapper, JsonUrbanoToAddresMapper } from "../../../mapper/georef.mapper";
import {  MapBoxResponse } from "../../../interfaces/georef/responseMapBox.interface";
import axios from "axios";
import { ResponseHearMap } from "../../../interfaces/georef/responsesHearMap.interface";
import { OptionsSelect } from "../../../interfaces/general/general.interfaces"; 
import { withBackdrop } from "../../../helpers/general.helper";
import { parse } from "valibot";
const tokenHearMap=import.meta.env.VITE_HERE_MAPS_API_KEY;


 
interface GeorefState { 
  getDoorsByRadius:(data:GeorefDoorsRadius) => Promise<DoorsGeoref[]>; 
  batches:Batch[];
  getBatches:  (initDate:string,endDate:string ,shipperSelected:number, stateSelected:number,districtSelected:number) => Promise<void>; 
  address:Address[];
  addressAuto:AddressAuto[];
  doors:DoorsGeoref[];
  getAddress:  (bacthId:number,stateId:number,shipperId:number,ciuId:number) => Promise<void>; 
  getAddressAuto:  (bacthId:number,stateId:number,shipperId:number,ciuId:number) => Promise<AddressAuto[]>; 
  setDoors:(doors:DoorsGeoref[])=>void;
  setAddress:  (data:Address[]) => void; 
  setAddressAuto:  (data:AddressAuto[]) => void; 
  searchAddres: (address:string,type:number,ciu_id:number) => Promise<searchAddres[]>; 
  searchDistrict: (text:string) => Promise<void>; 
  setListDistrictSearch: (data:ListSearchDistrict) => void; 
  listDistrictSearch:ListSearchDistrict;
  validateAddressGeoref: (data:AddressGeoref) => Promise<boolean>; 
  getDoorsByGeoref: (data:GeorefPoints) => Promise<DoorsGeoref[]>; 
  manualGeoref: (data:ManualGeoref) => Promise<void>; 

  getListState: () => Promise<void>; 
  getListShipper: () => Promise<void>; 
  getAllDepartament:()=>Promise<void>; 
  getAllProvince:(id:number)=>Promise<void>; 
  getAllDistric:(id:number)=>Promise<void>; 
  getListTypesErrors:()=>Promise<void>; 
  province:{
    data:OptionsSelect[],
    title:string,
  };
  district:{
    data:OptionsSelect[],
    title:string,
  };
  departament:{
    data:OptionsSelect[],
    title:string,
  };
  shippers:{
    data:OptionsSelect[],
    title:string,
  };
  states:{
    data:OptionsSelect[],
    title:string,
  };
  typesErrors:{
    data:OptionsSelect[],
    title:string,
  };
  listDataClient:Client;
  getListDataClient: (cli_id: number) => Promise<void>
  anulateAddress: (data: AnulateAddress) => Promise<void>
}



const georefStore:StateCreator<GeorefState,[["zustand/devtools", never], ["zustand/immer", never]]>=(set,get)=>({  
  anulateAddress: async (data:AnulateAddress) => {
    await withBackdrop(async () => {
      const dataForm={
        dir_id:data.idAddress,
        bot_log_id:data.botLogId,
        id_user:data.userId
      }
      await geo_back_api.put(`/georef/anulateAddress`,dataForm);
      const dataAddressAuto=get().addressAuto.filter(f=>f.idAddress!==data.idAddress)
      set((state)=>{ state.addressAuto=  dataAddressAuto });
    });  
  },
  listDataClient:{} as Client,
  getListDataClient: async (cli_id:number) => {
    await withBackdrop(async () => {
      const {data:dataResponse} = await geo_back_api(`/georef/listDataClient/${cli_id}`);
      const mapper=JsonDataClientToDataClientMapper(dataResponse.data)
      set((state)=>{ state.listDataClient=  mapper[0] }); 
    });  
  },
  getDoorsByRadius: async (data:GeorefDoorsRadius) => {
    const dataResponse=await withBackdrop(async () => {
      const response = await geo_back_api.post(`/georef/listDoorsByRadius`,data);
      set((state)=>{ state.doors= JsonDoorsToDoorsMapper(response.data.data)  });
      return JsonDoorsToDoorsMapper(response.data.data)
    }); 
    return dataResponse??[];  
  },
  listDistrictSearch:[],
  searchDistrict:async(text)=>{
    try {
      const search={texto:text}
      const {data:dataResponse} =  await geo_back_api.post(`/georef/searchDistrict`,search);
      const responseValibot=parse(ListSearchDistrictSchema,dataResponse.data)
      get().setListDistrictSearch(responseValibot)
        set((state)=>{ state.listDistrictSearch= responseValibot }); 
      } catch (error) { 
        ToastCustom.fire({
          icon: "error",
          title: "Sin resultados..!"
        });
        get().setListDistrictSearch([])
      }
  },
  setListDistrictSearch:(data:ListSearchDistrict)=>{
    set((state)=>{ state.listDistrictSearch= data }); 
  },
  searchAddres:async(address:string,type:number,ciu_id:number)=>{  
    let data:searchAddres[];
    switch(type){
      case 1: 
          const responseMapBox = await api_map_box.get<MapBoxResponse>(`/geocoding/v5/mapbox.places/${address}.json`); 
          data= JsonMapBoxToAddresMapper(responseMapBox.data); 
        break;
        case 2: // Urbanización
          const responseHear = await axios.get<ResponseHearMap>(`https://geocode.search.hereapi.com/v1/geocode?q=${address}&in=countryCode:PER&apiKey=${tokenHearMap}`); 
          data= JsonHearToAddresMapper(responseHear.data); 
        break;
        case 4: // Urbanización
          const sendSearchUrbano={
            ciu_id:ciu_id,
            dir_calle:address
          };
          try {
            const responseUrbano = await geo_back_api.post(`/georef/searchAddress`,sendSearchUrbano);
            data= JsonUrbanoToAddresMapper(responseUrbano.data.data.splice(0,100)); 
          } catch (error) { 
            ToastCustom.fire({
              icon: "error",
              title: "Sin resultados..!"
            });

            data=JsonUrbanoToAddresMapper([]); 
          }
        break;
      default:
        data=[];
        break;
    }
    return data;
  },
  batches:[],
  getBatches: async (initDate:string,endDate:string,shipperSelected:number, stateSelected:number,districtSelected:number) => {
    const data={
      fecha_ini:initDate,
      fecha_fin:endDate,
      shi_id:shipperSelected??null,
      ciu_id:districtSelected??null,
      id_estado:stateSelected??null,
    } 
    await withBackdrop(async () => {
      const response = await geo_back_api.post(`/georef/listBatchByDate`,data);
      set((state)=>{ state.batches= JsonToBatchMapper(response.data.data)  });
    });
  },
  address:[],
  addressAuto:[],
  getAddress: async (bacthId:number,stateId:number,shipperId:number,ciuId:number) => {
    const data={
      id_lote: bacthId,
      id_estado: stateId,
      shi_id: shipperId,
      ciu_id: ciuId
    }
    await withBackdrop(async () => {
      const response = await geo_back_api.post(`/georef/listAddressByBatch`,data);
      set((state)=>{ state.address= JsonToAddressMapper(response.data.data,bacthId)  });
    }); 
  },  
  getAddressAuto: async (bacthId:number,stateId:number,shipperId:number,ciuId:number) => {
    const data={
      id_lote: bacthId,
      id_estado: stateId,
      shi_id: shipperId,
      ciu_id: ciuId
    }
    const responseAddressAuto= await withBackdrop(async () => {
      const response = await geo_back_api.post(`/georef/listAddressAutoByBatch`,data);
      const dataMapper=JsonToAddressAutoMapper(response.data.data,bacthId)
      set((state)=>{ state.addressAuto=  dataMapper });
      return dataMapper
    }); 
    return responseAddressAuto as AddressAuto[]
  },  
  setAddress(data:Address[]){
    set((state)=>{ state.address=data  });
  },
  setAddressAuto(data:AddressAuto[]){
    set((state)=>{ state.addressAuto=data  });
  },
  validateAddressGeoref: async (data:AddressGeoref) => {
    const responseData=await withBackdrop(async () => {
      const response = await geo_back_api.post(`/georef/validateGeorefByAddress`,data);
      const message=response.data.sql_msn;  
        ToastCustom.fire({
            icon: "success",
            title:message
          });
        set((state)=>{ state.address= state.address.filter(address => address.idAddress!==data.dir_id) });
        return true;
    }); 
    return responseData ?? false;
    
  },
  getDoorsByGeoref: async (data:GeorefPoints) => {
    const dataResponse=await withBackdrop(async () => {
      const response = await geo_back_api.post(`/georef/listDoorsByGeoref`,data);
      set((state)=>{ state.doors= JsonDoorsToDoorsMapper(response.data.data)  });
      return JsonDoorsToDoorsMapper(response.data.data)
    }); 
    return dataResponse??[];  
  },
  setDoors(doors) {
    set((state)=>{ state.doors= doors  });
  },
  doors:[],
  manualGeoref: async(data:ManualGeoref) =>{
    await withBackdrop(async () => {
      const response = await geo_back_api.post(`/georef/generateManualGeoref`,data); 
      set((state)=>{ state.address= state.address.filter(f => !data.direcciones?.map(s=>s.dir_id!==f.idAddress).includes(false) ) });
      const message=response.data.sql_msn;  
        ToastCustom.fire({
            icon: "success",
            title:message
          });

    }); 
  },
  getListState: async() => {
    try {
      const response = await geo_back_api.get(`/georef/listState`);   
      const dataOption=[{label:'TODOS',value:0},...response.data.data.map((k:any)=> {return {label:k.descri_objeto,value:k.cod_objeto}}) ]
      set(state=>{ state.states.data= dataOption });  
    } catch (error) {
        console.log(error)
    }
  }, 
  getListShipper: async() =>{
    try {
      const response = await geo_back_api.get(`/georef/listShipper`);   
      const dataOption=[{label:'TODOS',value:0},...response.data.data.map((k:any)=> {return {label:k.shi_nombre,value:k.shi_id}}) ]
      set(state=>{ state.shippers.data= dataOption });  
    } catch (error) {
        console.log(error)
    }
  },
  getListTypesErrors: async() =>{
    try {
      const response = await geo_back_api.get(`/georef/listTypesErros`);   
      set(state=>{ state.typesErrors.data= response.data.data.map((k:any)=> {return {label:k.descri_objeto,value:k.cod_objeto}}) });  
    } catch (error) {
        console.log(error)
    }
  },
  getAllDepartament:async ()=>{
    try {
      const response = await geo_back_api.get(`/zone/getDepartaments`); 
      set(state=>{ state.departament.data= response.data.data.map((k:any)=> {return {label:k.dep_nombre,value:k.dep_id}}) });
    } catch (error) {
      console.error(error);
    } 
  },
  getAllProvince:async (id:number)=>{
    try {
      const response = await geo_back_api.get(`/zone/getProvinces/${id}`);
      set(state=>{ state.province.data= response.data.data.map((k:any)=> {return {label:k.prv_nombre,value:k.prv_id}}) });
    } catch (error) {
      console.error(error);
    } 
  },
  getAllDistric:async (id:number)=>{
    try {
      const response = await geo_back_api.get(`/zone/getDistrics/${id}`);
      set(state=>{ state.district.data= response.data.data.map((k:any)=> {return {label:k.ciu_nombre,value:k.ciu_id}}) });
 
    } catch (error) {
      console.error(error);
    } 
  },
  shippers:{
    data:[],
    title:'Shipper',
  },
  states:{
    data:[],
    title:'Estados',
  },
  typesErrors:{
    data:[],
    title:'Tipos de Errores',
  },
  departament:{
    data:[],
    title:'Departamento',
  },
  province:{
    data:[],
    title:'Provincia',
  },
  district:{
    data:[],
    title:'Distrito',
  },
});


export const useGeorefMapStore=create<GeorefState>()(
  devtools(
    persist(
      immer(
        georefStore
      )
      ,{
         name:'georef-store',
       }
    )
  )
);