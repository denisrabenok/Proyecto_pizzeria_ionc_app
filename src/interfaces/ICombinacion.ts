
import { Pizza } from "./IPizza";
import { Adicional } from "./IAdicional";
import { PizzaPromo } from "./IPizzaPromo";
/**
 * Interface para modelar objetos Combinacion
 */
export interface Combinacion{
    pizzas : Pizza[],
    adicionales : Adicional[],
    total : Number
}
  