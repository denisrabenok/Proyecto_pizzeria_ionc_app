/**
 * Interface para modelar objetos Adicional
 */
export interface Adicional{ 
    id: string,
    nombre:string,
    costoBase : Number,
    imagenUrl : string,
    checked : boolean,
    cantidad : Number
  }