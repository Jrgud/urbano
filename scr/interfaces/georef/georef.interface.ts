import * as v from 'valibot'

export interface UrbanoAddress {
    dir_calle: string;
    coordenadas: string;
    geo_id: number;

}

export interface Batch {
    batchId: number;
    batchDate: string;
    hour: string;
    total: number;
    total_geo: number;
}

export interface Address {
    idAddress: number;
    ciuId: number;
    gps: string;
    streetAddress: string;
    numberAddress: string;
    urbanizationAddress: string;
    blockAddress: string;
    mzaAddress: string;
    loteAddress: string;
    referenceAddress: string;
    id_bot_log: number;
    city: string;
    addressNormalized: string;
    distric: string;

    cliente: string;
    guia: string;
    shipper: string;
    cli_id:number;

    cli_email:string;
    cli_tel:string;
     

    // Las direcciones no deben estar aquí, porque ya se manejan en el mapeo de JsonToAddressMapper
    cli_direcciones: AddressAsigned[];
}
export interface AddressAuto {
    idAddress: number;
    ciuId: number;
    gps: string;
    streetAddress: string;
    numberAddress: string;
    urbanizationAddress: string;
    blockAddress: string;
    mzaAddress: string;
    loteAddress: string;
    referenceAddress: string;
    id_bot_log: number;
    city: string;
    addressNormalized: string;
    distric: string;  
    geo_id: number;
    flag_geo:string;
    coordenada_puerta: string;
    cli_id:number;
    cli_email:string;
    cli_tel:string;
    cliente:string
    guia:string
    shipper:string
    cli_direcciones: AddressAsigned[]
}


export interface AddressAsigned {
    dir_bloque?: string;
    dir_calle?: string;
    dir_lote?: string;
    dir_mza?: string;
    dir_puerta?: string;
    dir_referencia?: string;
    dir_urbaniz?: string;
    dir_geo_id?: number;
    dir_distrito: string;
    dir_normalizada: string;
    dir_lat: number;
    dir_lng: number;
}


export interface AddressGeoref {
    dir_calle: string;
    dir_numero: string;
    dir_urbaniz: string;
    dir_bloque: string;
    dir_mza: string;
    dir_lote: string;
    dir_id: number;
    ciu_id:number ;
    dir_point: string;
}

export interface searchAddres{
    text:string;
    sub_tet: string;
    gps: number[];
    geoId:number
}
export const SearchDistrictSchema=v.object({
    ciu_id: v.number(),
    distrito: v.string(), 
    nombre_distrito: v.string(), 
})
export const ListSearchDistrictSchema=v.array(SearchDistrictSchema)
export type ListSearchDistrict = v.InferOutput<typeof ListSearchDistrictSchema>

export interface GeorefPoints{
    ciu_id:number ;
    puntos: MapPoint[];
}
export interface GeorefDoorsRadius{
    ciu_id:number ;
    coordenadas: string;
    radio: number;
}
export interface AnulateAddress{
    idAddress:number ;
    botLogId: number;
    userId: number;
}
export interface MapPoint{
    map_point:string ;
}

export interface DoorsGeoref{
    direccion:string ;
    geo_id:number ;
    gps:string;
    puerta:string;
    manzana:string;
    lote:string;
}
export interface ManualGeoref{
    geo_id?: number;
    ciu_id?: number;
    bot_log_id?: number; 
    dir_id?: number;
    dir_calle?: string ;
    direcciones?: {
        dir_id?: number;
        dir_calle?: string;
    }[];
    id_user?: number;
    tbad_id?: number;
    dir_apunts?: string ;
    tipo_ope?: number;
}

export interface Client{
    cli_id:number
    nombre_cliente:string
    data_nombres:ClientNames[]
    data_telefonos:ClientPhone[]
    data_emails:ClientEmail[]
}
export interface ClientNames{ 
    nombre_cliente:string 
}
export interface ClientPhone{ 
    fecha:string
    telefono:string 
}
export interface ClientEmail{ 
    email:string
    fecha:string 
}