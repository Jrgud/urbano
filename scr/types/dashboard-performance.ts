import * as v from 'valibot'

export type FormPerformance={
    initDate:string
    endDate:string
    users:{userId:number}[]
}
export type FormPerformanceDetail={
    initDate:string
    endDate:string
    userId:number
}
export type FormPerformanceActivities={
    date:string 
    userId:number
}

export type  ChartTwoState ={
    series: {
      name: string;
      data: number[];
    }[];
  }

export const PerformanceSchema=v.object({
    usu_id: v.number(),
    usu_nombre: v.string(),
    dias_trabajados: v.number(),
    tiempo_promedio: v.string(),
    total_procesado: v.number(),
    tiempo_promedio_por_dia: v.number(), 
})
export const ListPerformanceSchema=v.array(PerformanceSchema)
export type PerformanceType = v.InferOutput<typeof PerformanceSchema>
export type ListPerformance = v.InferOutput<typeof ListPerformanceSchema>

export const PerformanceDetailUserSchema=v.object({
  usu_id: v.number(),
  hora_fin: v.string(),
  log_fecha: v.string(),
  tiempo_dia: v.string(),
  usu_nombre: v.string(),
  hora_inicio: v.string(), 
  total_procesado: v.number(),
  promedio_por_hora: v.number(), 
})
export const ListPerformanceDetailUserSchema=v.array(PerformanceDetailUserSchema)
export type ListPerformanceDetailUser = v.InferOutput<typeof ListPerformanceDetailUserSchema>
export type PerformanceDetailUser = v.InferOutput<typeof PerformanceDetailUserSchema>

export const PerformanceActivitiesUserSchema=v.object({
  total: v.number(),
  actividad: v.string(),
  id_actividad: v.number(),
  tiempo_promedio: v.nullish(v.string(),'00:00:00'),
  tiempo_utilizado: v.nullish(v.string(),'00:00:00'),
})
export const ListPerformanceActivitiesUserSchema=v.array(PerformanceActivitiesUserSchema)
export type ListPerformanceActivitiesUser = v.InferOutput<typeof ListPerformanceActivitiesUserSchema>