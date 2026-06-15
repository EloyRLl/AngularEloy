export interface TuberiaModel {
    id: number;
    tamano_tubo: number;
    material: string;
    presion_maxima: number;
    fecha_instalacion: string;
    estado: string;
    geom_wkt?: string;
    geom?: string;
}