import * as v from 'valibot'

export type FormPreRuta = {
    agencia_id: number,
    area_id: number,
    fecha: string
}
export const PositionPointSchema=  v.object({
    lat: v.number(),
    lng: v.number(),
    geo_id: v.number(),

    dir_bloque: v.string(),
    dir_calle: v.string(),
    dir_lote: v.string(),
    dir_mza: v.string(),
    dir_puerta: v.string(),
    dir_referencia: v.string(),
    dir_urbaniz: v.string(), 
})

export const GroupBatchSchema=v.object({
    gru_id: v.number(),
    gru_nombre: v.string(),
    lote_id: v.number(),
    area_nombre: v.string(),
    localidad: v.string(),
    piezas: v.number(),
    guias: v.number(),
    paradas: v.number(),
    paradas_posicion: v.array(
        PositionPointSchema
    ),
    peso_pieza: v.number(),
    aptos: v.number(),
    sinxy: v.number(),
    guias_entrega: v.number(),
    pieza_entrega: v.number(),
    pendientes: v.number(),
    guias_dev: v.number(),
    pieza_dev: v.number(),
    liq_dev: v.number(),
    liq_incon_dev: v.number(),
    guia_inv: v.number(),
    pieza_inv: v.number(),
    sin_adm: v.number(),
    sin_ss: v.number(),
    entr_parcial: v.number(),
    dev_parcial: v.number(),
    zona_puntos: v.array(
        v.object({
            lat: v.number(),
            lng: v.number(),
        })
    ),
    zona_color: v.string(),
})
export const GroupBatchSchemaList=v.array(GroupBatchSchema)
export type PositionPoint = v.InferOutput<typeof PositionPointSchema>
export type GroupBatch = v.InferOutput<typeof GroupBatchSchema>
export type GroupBatchList = v.InferOutput<typeof GroupBatchSchemaList>

export const GroupBatchDetailSchema=v.object({
    pza_orden: v.number(),
    tipo_servicio: v.string(),
    pieza: v.string(),
    guia: v.string(),
    numero_pieza: v.number(),
    cod_rastreo: v.string(),
    shipper: v.string(),
    nombre_cliente: v.string(),
    direccion: v.string(),
    distrito: v.string(),
    id_parada: v.number(),
    estado_pieza: v.string(),
    fecha_estado: v.string(), 
})
export const GroupBatchDetailSchemaList=v.array(GroupBatchDetailSchema)
export type GroupBatchDetailList = v.InferOutput<typeof GroupBatchDetailSchemaList>

const PointOptiomalShema=v.object({
    estimatedArrival: v.nullish(v.string(),''),
    estimatedDeparture: v.nullish(v.string(),''),
    id: v.string(),
    lat: v.number(),
    lng: v.number(),
    sequence: v.number(), 
})
export const OptimalRoutechema=v.object({
    description: v.string(),
    distance: v.string(),
    time: v.string(),
    interconnections: v.array(
        v.object({
            distance: v.number(),
            fromWaypoint: v.string(),
            rest: v.number(),
            time: v.number(),
            toWaypoint: v.string(),
            waiting: v.number(), 
        })
    ),
    timeBreakdown: v.object({
        break: v.number(),
        driving: v.number(),
        rest: v.number(),
        service: v.number(),
        waiting: v.number(), 
    }),
    waypoints: v.array(PointOptiomalShema), 
}) 
export type PointOptiomal = v.InferOutput<typeof PointOptiomalShema>
export type OptimalRoute = v.InferOutput<typeof OptimalRoutechema>



export const RoutesSchema=v.object({
    id: v.string(),
    polyline: v.string(), 
    summary: v.object({
        baseDuration: v.number(),
        duration: v.number(),
        length: v.number(),
    }) 
}) 
export type RoutesType = v.InferOutput<typeof RoutesSchema>
export const RoutesSchemaList=v.array(RoutesSchema)
export type RoutesListType = v.InferOutput<typeof RoutesSchemaList>