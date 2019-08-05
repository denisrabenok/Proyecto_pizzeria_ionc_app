export class Constantes {

    public static ALGO_ANDA_MAL = "Algo ha salido mal";
    public static INTENTALO_NUEVAMENTE = "Lo sentimos, hay dificultades en la conexión. Por favor, intentalo de nuevo más tarde";
    public static SIN_CONEXION = "¡Sin conexión!";
    public static REVISAR_CONEXION = "Por favor revisa tu conexión a internet";
    public static CARGANDO = "Cargando..";
    public static ALGO_HA_SALIDO_MAL = "Algo ha salido mal, por favor intenta nuevamente";
    public static RECLAMO_EXITOSO = "Reclamo realizado con exito";





    //Urls
    public static API_URL = 'http://navi.pythonanywhere.com/rest/';
	//public static API_URL = 'http://localhost:9988/rest/';
    public static TAMANOS_URL = Constantes.API_URL  +"tamanos/";
    public static PORCIONES_URL = Constantes.API_URL + "porciones/";
    public static ADICIONALES_URL = Constantes.API_URL + "adicionales/";
    public static TAMANO_MASA_URL = Constantes.API_URL + "tamano_masa/";
    public static TAMANO_BORDE_URL = Constantes.API_URL + "tamano_borde/";
    public static TAMANO_INGREDIENTE_URL = Constantes.API_URL + "tamano_ingrediente/";
    public static CREAR_FAVORITA_URL =  Constantes.API_URL + "crear_pizza_favorita";
    public static PIZZAS_TRADICIONALES = Constantes.API_URL + "pizzas_tradicionales";
    public static CREAR_PIZZA_FAVORITA = Constantes.API_URL + "crear_pizza_favorita";
    public static BORRAR_PIZZA_FAVORITA = Constantes.API_URL + "borrar_pizza_favorita";
    public static PIZZAS_FAVORITAS =    Constantes.API_URL + "pizzas_favoritas";
    public static COMBOS_PROMOIONALES = Constantes.API_URL + "combos_promocionales/";
    public static LISTA_DIRECCIONES_FAV = Constantes.API_URL + "direccion_cliente/ver";
    public static CREAR_DIRECCION = Constantes.API_URL + "direccion_cliente/crear"
    public static VER_PIZZA = Constantes.API_URL + "ver_pizza";
    public static EDITAR_PERFIL = Constantes.API_URL +  "usuario/editar";
    public static VER_PERFIL = Constantes.API_URL + "usuario/ver";
    public static REGISTRO_FORM = Constantes.API_URL + "registrar";
    public static LOGIN =  Constantes.API_URL + "login";
    public static ELIMINAR_DIRECCION = Constantes.API_URL + "direccion_cliente/borrar"
    public static CREAR_COMBINACION = Constantes.API_URL + "crear_combinacion/"
    public static CARRITO = Constantes.API_URL + "carrito/"
    public static BORRAR_ELEMENTO_CARRITO = Constantes.API_URL + "carrito/borrar_elemento/";
    public static LISTA_LOCALES = Constantes.API_URL + "locales"
    public static RECLAMOS_SUGERENCIAS = Constantes.API_URL + "reclamos/crear"
    public static CREAR_PEDIDOS = Constantes.API_URL + "pedido/crear"
    public static VER_PEDIDOS = Constantes.API_URL + "pedidos"
    public static DETALLE_PEDIDO = Constantes.API_URL + "pedido/ver"
    public static LISTA_TODOS_LOCALES = Constantes.API_URL + "locales/info"


    //metodos

    public static getTamanosUrl(token : string){
        return this.TAMANOS_URL+"?TOKEN="+token;
    }

    public static getPorcionesUrl(token : string ){
        return this.PORCIONES_URL + "?TOKEN="+token;
    }

    public static getAdicionalesUrl(token : string , tipo: string){
        return this.ADICIONALES_URL+"?TOKEN="+token+"&TIPO="+tipo;
    }

    public static getTamanosMasasUrl(token : string , tamano: string){
        return this.TAMANO_MASA_URL + "?TOKEN="+token +"&TAMANO="+tamano
    }

    public static getTamanosBordesUrl(token : string , tamano: string){
        return this.TAMANO_BORDE_URL + "?TOKEN="+token +"&TAMANO="+tamano
    }

    public static getTamanosIngredientesUrl(token : string , tamano: string){
        return this.TAMANO_INGREDIENTE_URL + "?TOKEN="+token +"&TAMANO="+tamano
    }

    public static getTamanosIngredientesUrls(token : string , tamano: Number){
        return this.TAMANO_INGREDIENTE_URL + "?TOKEN="+token +"&TAMANO="+tamano
    }

    public static getTradicionalesUrl(token : string){
        return this.PIZZAS_TRADICIONALES + "?TOKEN="+token;
    }

    public static getCrearPizzaFavoritasUrl(){
        return this.CREAR_PIZZA_FAVORITA;
    }

    public static getBorrarPizzaFavoritasUrl(){
        return this.BORRAR_PIZZA_FAVORITA;
    }

    public static getPizzasFavoritas(token : string){
        return this.PIZZAS_FAVORITAS + "?TOKEN=" + token;
    }

    public static getPromocionalesUrl(token : string){
        return this.COMBOS_PROMOIONALES + "?TOKEN="+token;
    }

    public static getListaDireccionesUrl(token : string){
        return this.LISTA_DIRECCIONES_FAV + "?TOKEN="+token
    }

    public static postCrearDireccionUrl() {
        return this.CREAR_DIRECCION;
    }

    public static postBorrarDireccionUrl() {
        return this.ELIMINAR_DIRECCION;
    }

    public static getVerPizzaUrl(token : string , id : string){
        return this.VER_PIZZA + "?TOKEN="+token +"&PIZZA_ID="+ id
    }

    public static getEditarPerfilUrl(){
        return this.EDITAR_PERFIL;
    }

    public static getVerPefilUrl(token : string ){
        return this.VER_PERFIL + "?TOKEN=" +  token;
    }

    public static getRegistroFormUrl(){
        return this.REGISTRO_FORM;
    }

    public static getLoginUrl(){
        return this.LOGIN;
    }

    public static getCarritoUrl(token : string ){
        return this.CARRITO + "?TOKEN=" +  token;
    }

    public static getReclamoSugerencia(token : string){
        return this.RECLAMOS_SUGERENCIAS;
    }

    public static getLocales(token : string ){
        return this.LISTA_LOCALES + "?TOKEN=" + token;

    }

    public static getPedidos(token : string ){
        return this.VER_PEDIDOS + "?TOKEN=" + token;

    }

    public static getDetallePedido(token : string , id : string ){
        return this.DETALLE_PEDIDO + "?TOKEN=" + token+"&PEDIDO_ID="+id;

    }

    public static getTodosLocales(token : string ) {
        return this.LISTA_TODOS_LOCALES + "?TOKEN=" + token;
    }

    public static getLocal(token: string, id: string) {
        return this.LISTA_TODOS_LOCALES + "?TOKEN=" + token + "&LOCAL_ID=" + id;
    }

}
