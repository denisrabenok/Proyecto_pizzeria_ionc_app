
import { Masa } from "../interfaces/IMasa";
import { Borde } from "../interfaces/IBorde";
import { Ingrediente } from "../interfaces/IIngrediente";

export interface PizzaTradicional{
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
    favorita : string,
    checked : boolean,
    seleccion : boolean
}