export interface ArquetaPozoModel {
    id: number;
    tipo_elemento: string;
    profundidad: number;
    fecha_mantenimiento: string;
    accesible: boolean;
    estado_conservacion: string;
    geom_wkt?: string;
    geom?: string;
}