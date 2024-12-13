/** Interface para una fila de datos */
export interface DataRow {
    numero: number;
    lote: string;
    tipo: string;
    localidad: string;
    guias: number;
    pieza: number;
    paradas: number;
    peso: number;
  }
  
  /** Interface para agrupar datos */
  export interface Group {
    groupName: string;
    rows: DataRow[];
  }
  
  /** Interface para la respuesta del API */
  export interface ApiResponse {
    groupName: string;
    rows: DataRow[];
  }
  
  /** Interface para los valores del formulario */
  export interface FormValues {
    vista: string;
    agencia: number;
    fecha: string;
  }
  