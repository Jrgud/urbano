import { Client, DoorsGeoref, searchAddres, UrbanoAddress } from "../interfaces/georef/georef.interface";
import { MapBoxResponse } from "../interfaces/georef/responseMapBox.interface";
import { ResponseHearMap } from "../interfaces/georef/responsesHearMap.interface";

export function JsonToBatchMapper(array: any[],) {
    return array.map(k => {
        return { batchId: k.id_bot_log, batchDate: k.fecha_bot, hour: k.hora, total: k.tot_sin_geo , total_geo: k.tot_geo};
    });
};
export function JsonToAddressMapper(array: any[], id_bot_log: number) {
    return array.map(k => {
        return {
            ciuId: k.ciu_id,
            gps: k.coordenadas,
            blockAddress: k.dir_bloque,
            streetAddress: k.dir_calle,
            idAddress: k.dir_id,
            loteAddress: k.dir_lote,
            mzaAddress: k.dir_mza,
            numberAddress: k.dir_numero,
            referenceAddress: k.dir_referencia,
            urbanizationAddress: k.dir_ubaniz,
            id_bot_log,
            city: k.ciudad,
            addressNormalized: k.dir_normalizada,
            distric: k.distrito,

            cliente: k.cli_nombre,
            shipper: k.nombre_shipper,
            guia: k.numero_guia,
            cli_id:k.cli_id,
            cli_email:k.cli_email,
            cli_tel:k.cli_tel,
            cli_direcciones: k.cli_direcciones.map((direccion: any) => {
                return {
                    dir_bloque: direccion.dir_bloque,
                    dir_calle: direccion.dir_calle,
                    dir_lote: direccion.dir_lote,
                    dir_mza: direccion.dir_mza,
                    dir_puerta: direccion.dir_puerta,
                    dir_referencia: direccion.dir_referencia,
                    dir_urbaniz: direccion.dir_urbaniz,
                    dir_geo_id: direccion.geo_id,
                    dir_lat: direccion.lat,
                    dir_lng: direccion.lng,
                    dir_distrito: direccion.ciu_nombre,
                    dir_normalizada: direccion.direccion_normalizada, 
                }

            })
        };

    });
}
export function JsonToAddressAutoMapper(array: any[], id_bot_log: number) {
    return array.map(k => {
        return {
            ciuId: k.ciu_id,
            gps: k.coordenadas,
            blockAddress: k.dir_bloque,
            streetAddress: k.dir_calle,
            idAddress: k.dir_id,
            loteAddress: k.dir_lote,
            mzaAddress: k.dir_mza,
            numberAddress: k.dir_numero,
            referenceAddress: k.dir_referencia,
            urbanizationAddress: k.dir_ubaniz,
            id_bot_log,
            city: k.ciudad,
            addressNormalized: k.dir_normalizada,
            distric: k.distrito,
            geo_id: k.geo_id,
            flag_geo:k.flag_geo,
            coordenada_puerta:k.coordenada_puerta, 
            cliente: k.cli_nombre,
            shipper: k.nombre_shipper,
            guia: k.numero_guia,
            cli_id:k.cli_id,
            cli_email:k.cli_email,
            cli_tel:k.cli_tel,
            cli_direcciones: k.cli_direcciones.map((direccion: any) => {
                return {
                    dir_bloque: direccion.dir_bloque,
                    dir_calle: direccion.dir_calle,
                    dir_lote: direccion.dir_lote,
                    dir_mza: direccion.dir_mza,
                    dir_puerta: direccion.dir_puerta,
                    dir_referencia: direccion.dir_referencia,
                    dir_urbaniz: direccion.dir_urbaniz,
                    dir_geo_id: direccion.geo_id,
                    dir_lat: direccion.lat,
                    dir_lng: direccion.lng,
                    dir_distrito: direccion.ciu_nombre,
                    dir_normalizada: direccion.direccion_normalizada,
                }

            })
        };

    });
}

export const JsonToPreRutaGroupMapper = (array: any[], areaId: number) => {
    return {
        groupName: `Resultados para Área ${areaId}`, // Nombre dinámico basado en el área
        rows: array.map((item) => ({
          numero: item.numero,
          lote: item.lote,
          tipo: item.tipo,
          localidad: item.localidad,
          guias: item.guias,
          pieza: item.pieza,
          paradas: item.paradas,
          peso: item.peso,
        })),
      };
    };


export const JsonMapBoxToAddresMapper = (array: MapBoxResponse) => {
    const data: searchAddres[] = array.features.map(k => {
        return {
            geoId:0,
            text: k.text_es,
            sub_tet: k.place_name_es,
            gps: [k.center[0], k.center[1]]
        };
    });
    return data;
};
export const JsonHearToAddresMapper = (array: ResponseHearMap) => {
    const data: searchAddres[] = array.items.map(k => {
        return {
            geoId:0,
            text: k.address.street,
            sub_tet: k.address.label,
            gps: [k.position.lng, k.position.lat]
        };
    });
    return data;
};
export const JsonUrbanoToAddresMapper = (array: UrbanoAddress[]) => {
    const data: searchAddres[] = array.map(k => {
        return {
            geoId:k.geo_id,
            text: k.dir_calle,
            sub_tet: k.dir_calle,
            gps: k.coordenadas.split(',').map(k => +k).reverse()
        };
    });
    return data;
};

export const JsonDoorsToDoorsMapper = (array: any[]) => {
    const data: DoorsGeoref[] = array.map(k => {
        return {
            direccion: k.direccion,
            geo_id: k.geo_id,
            gps: k.gps,
            puerta:k.nro_puerta,
            manzana:k.manzana,
            lote:k.lote,

        };
    });
    return data;
};
export const JsonDataClientToDataClientMapper = (array: any[]) => {
    const data: Client[] = array.map(k => {
        return {
            cli_id: k.cli_id,
            nombre_cliente: k.nombre_cliente,
            data_nombres: k.data_nombres,
            data_telefonos:k.data_telefonos,
            data_emails:k.data_emails 
        };
    });
    return data;
};