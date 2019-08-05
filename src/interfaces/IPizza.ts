import { Masa } from "../interfaces/IMasa";
import { Borde } from "../interfaces/IBorde";
import { Ingrediente } from "../interfaces/IIngrediente";
/**
 * Interface para modelar objetos Pizza
 */
export interface Pizza{
    id : string;
    masa : Masa,
    borde : Borde,
    ingredientes : Ingrediente[]
    costo: Number,
    nombre : string,
    descripcion : string,
    imgUrl : string,
    tamano : any,
    cantidad : Number,
    favorita : string

}
  