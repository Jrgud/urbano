export interface ZoneMap{
    zona_id:number;
    ciu_id:number;
    dep_id:number;
    prv_id:number;
    zona_codigo:string;
    zona_color:string;
    zona_tipo: number;
    zona_descri:string; 
    puntos:ZonePoints[];
}

export interface ZonePoints { 
    map_sequenc:number;
    map_point:string; 
}

export interface PointsDoor{
    geo_id:number;
    direccion: string;
    gps: string;
}

export interface  RouteDictionary{
    geo_id: number;
    user_id: number;
    id_inventario: number;
    direccion: string;
    ciu_id:number;
}

export interface AddressGeofence {
    lote:string;
    manzana:string;
    nro_puerta:string; 
    geo_id:number;
    direccion: string;
    gps: string;
}

export interface PolygonDistrict {
    ciu_id: number;
    dep_id: number;
    prv_id: number;
    puntos:ZonePoints[];
}
export interface Option {
    label:string;
    value:number;
  }


export interface  ILayerDoors{
        id:string
        icon: string;
        description: string;
        countDoors: number;
}  