
import { IngredientesPromo } from "../interfaces/IIngredientesPromo";

export interface PizzaPromo{
    ingredientes : IngredientesPromo[]
    nombre : string,
    descripcion : string,
    imgUrl : string,
    tamano : any,
    costo: Number,
    cantidad : Number,
}