export interface ZonaServicioModel {
    id: number;
    nombre: string;
    poblacion_afectada: number;
    fecha_creacion: string; // Formato YYYY-MM-DD
    responsable: string;
    activa: boolean;
    geom_wkt?: string; // Django devuelve geom_wkt gracias al serializador del profesor
    geom?: string;
}