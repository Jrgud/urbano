import { AddressGeofence } from "../interfaces/map/zone.interface";

export const JsonAddressToAddressMapper=(array:any[])=>{
    const data:AddressGeofence[]=  array.map(k=>{
        return {
                lote:k.dir_lote,
                manzana:k.dir_mz,
                nro_puerta:k.dir_puerta,  
                direccion:k.direccion,
                geo_id:k.geo_id,
                gps:k.gps
            };
    }); 
    return data;
};