import { Porcion } from "./IPorcion";

/**
 * Interface para modelar objetos Ingrediente
 */
export interface Ingrediente{
    id: string,
    nombre:string,
    descripcion:string,
    imagenUrl:string,
    tamano:string,
    costoBase : Number,   
    porcion : Porcion,    //objeto porcion asignado al ingrediente
   // porciones : any,  // lista de porciones para mostrar en el select de porciones de cada ingrediente
                      // cada porcion tiene un identificador  para reconocer a que ingrediente pertenece
    checked : boolean  // varaiable que controla si ha sido marcado o no
  }
  