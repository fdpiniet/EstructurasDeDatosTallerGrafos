"use strict";

/*
 * Namespace/Módulo Grafos
 * ======================= */
/**
 * Define y exporta los objetos Grafo, Nodo y Arco. Estos objetos tienen
 * variantes más especializadas: GrafoPonderado, y ArcoDireccionado.
 */
var Grafos = (function(){
    /*
     * Módulo: objeto base:
     * ==================== */
    /**
     * Usado para comprobar si objetos hacen parte de este módulo. Todos los
     * demás objetos definidos en este módulo son "descendientes" de este
     * objeto.
     *
     * No hace nada.
     */
    var ObjetoBaseGrafos = function(){};
    ObjetoBaseGrafos.prototype = {};
    ObjetoBaseGrafos.constructor = Object;
    
    // ------------------------------------------------------------------------
    
    /*
     * Grafo: constructor:
     * =================== */
    /**
     * Define objeto Grafo.
     *
     * En esta implementación de Grafo, se mantiene un listado de objetos Nodo
     * y un listado de objetos Arco. Cada objeto Nodo contiene un listado de
     * referencias (esto puede ser visto como un pointer) a objetos Arco en
     * donde Nodo es el nodo origen, y un listado de referencias de objetos
     * Arco en donde Nodo es el Nodo destino en un camino, o ambos; el Grafo
     * es considerado un digrafo si alguno de sus arcos es un Arco dirigido.
     *
     * Su constructor acepta un objeto "raíz" y el valor de este parámetro
     * determinará el estado inicial del grafo.
     *
     *  -- Si raiz es undefined, entonces el grafo será creado sin nodos.
     *     Es undefined si el parámetro no está presente.
     *
     *  -- Si raiz es un objeto Nodo, entonces el grafo será creado y
     *     dicho Nodo será su único nodo.
     *
     *  -- En todo otro caso, se crea un nuevo grafo en donde el único nodo
     *     será un nuevo Nodo creado usando el valor de "raiz" como
     *     su valor interno.
     *
     * En adición a la creación de un Grafo, de sus objetos Nodo y de sus
     * respectivos objetos Arco, Grafo contiene vários métodos que facilitan el
     * manejo de los mismos objetos que componen el Grafo, incluyendo
     * implementaciones de algoritmos comúnmente usados para recorrer grafos.
     *
     * Existe una variante de este objeto llamada GrafoPonderado que usa
     * objetos ArcoPonderado en lugar de objetos Arco. Tratándose de
     * herencia y polimorfismo, los arcos aceptados por este tipo de Grafo
     * pueden ser objetos ArcoPonderado, pero serán tratados como objetos
     * Arco; como arcos no ponderados.
     */
    var Grafo = function(raiz) {
        /*
         * Grafo: constructor de "padre":
         * -------------------------------
         *
         * Completamente innecesario. Hecho por convención.
         */
        ObjetoBaseGrafos.call(this); 
        
        /* Grafo: variables "privadas" de "instancia":
         * -------------------------------------------
         *
         * Variables visibles solo dentro de esta función constructora y dentro
         * de funciones "privilegiadas" definidas dentro de este constructor.
         */
        
        /** Listado de objetos Nodo. Arreglo. */
        var nodos;
        
        /** Listado de objetos Arco. Arreglo. */
        var arcos;

        /* Grafo: métodos "privilegiados" de "instancia":
         * ----------------------------------------------
         *
         * Cuando me refiero a métodos "privilegiado" me refiero a métodos
         * con acceso a variables "privadas" (definidas únicamente en la
         * función constructor del objeto.)
         *
         * Estos métodos están disponibles públicamente; las variables
         * con las que trabajan no están disponibles públicamente.
         */
        
        /**
         * Regresa arreglo interno de objetos Nodo.
         * Usar con cuidado.
         */
        this.getNodos = function() {
            return nodos;
        };
        
        /**
         * Asigna (y sobreescribe) arreglo de objetos Nodo a este grafo.
         * Usar con cuidado.
         */
        this.setNodos = function(valor) {
            nodos = valor;
        };

        /**
         * Regresa arreglo interno de objetos Arco.
         * Usar con cuidado.
         */
        this.getArcos = function() {
            return arcos;
        };
        
        /**
         * Asigna (y sobreescribe) arreglo de objetos Arco a este grafo.
         * Usar con cuidado.
         */
        this.setArcos = function(valor) {
            arcos = valor;
        };

        /** Regresa número de objetos Nodo en el Grafo. */
        this.numeroNodos = function() {
            return nodos.length;
        };
        
        /** Regresa true si este Grafo no contiene objetos Nodo. */
        this.vacio = function() {
            return nodos.length == 0 ? true : false;
        };
        
        /** Regresa número de objetos Arco en el Grafo. */
        this.numeroArcos = function() {
            return arcos.length;
        };
        
        /**
         * Regresa true si todos los nodos tienen un camino de/hacia otro Nodo
         * en este Grafo.
         */
        this.conexo = function() {
            var resultado = true;
            
            for (i in nodos) {
                if (!nodos[i].conexo) {
                    resultado = false;
                    break;
                }
            }
            
            return resultado;
        };
        
        /**
         * Regresa true si este Grafo es un digrafo; si alguno de sus objetos
         * Arco es dirigido.
         */
        this.digrafo = function() {
            var resultado = false;
            
            for (i in arcos) {
                if (arcos[i].dirigido()) {
                    resultado = true;
                    break;
                }
            }
            
            return resultado;
        };
        
        /* Grafo: inicialización de "instancia":
         * -------------------------------------
         */
        
        // Configurando instancia usando el valor de "raíz".
        if (raiz === undefined) {
            // raíz no está presente. Se crea Grafo vacío.
            nodos = [];
        } else if (raiz instanceof Nodo) {
            // raíz es un Nodo. Grafo contendrá un solo Nodo: raíz.
            nodos = [raiz];
        } else {
            // raíz es un valor. Grafo contendrá un Nodo cuyo valor será Raíz.
            nodos = [new Nodo(raiz)];
        }
        
        // En todo caso, todo Grafo es creado sin arcos.
        arcos = [];
    };
    
    /*
     * Grafo: prototipo y "herencia":
     * ------------------------------ */
    /**
     * Necesario para mantener una cadena de prototipos consistente.
     */
    Grafo.prototype = Object.create(ObjetoBaseGrafos.prototype);
    Grafo.constructor = Grafo;
    
    // ------------------------------------------------------------------------

    /*
     * GrafoPonderado: constructor:
     * ============================ */
    /**
     * Un Grafo que solo acepta arcos de tipo ArcoPonderado y provee
     * algoritmos que toman en cuento el peso de dichos arcos.
     */
    var GrafoPonderado = function(raiz) {
        /*
         * GrafoPonderado: constructor de "padre":
         * ---------------------------------------
         */
        Grafo.call(this, raiz); 
        
        /* GrafoPonderado: variables "privadas" de "instancia":
         * ----------------------------------------------------
         */
        
        // Ninguna por el momento.

        /* GrafoPonderado: métodos "privilegiados" de "instancia":
         * -------------------------------------------------------
         */
        
        // Ninguno por el momento.
        
        /**
         * Asigna (y sobreescribe) arreglo de objetos ArcoPonderado a este
         * GrafoPonderado. Lanza TypeError si algun Arco no es ArcoPonderado.
         
         * Usar con cuidado. 
         */
        this.setArcos = function(valor) {
            for (i in valor) {
                if (valor[i] !== undefined && !ArcoPonderado.esArcoPonderado(valor[i])) {
                    throw new TypeError('GrafoPonderado.setArcos(valor) sólo acepta arcos de tipo ArcoPonderado.');
                }
            }
            
            arcos = valor;
        };
        
        /* GrafoPonderado: inicialización de "instancia":
         * ----------------------------------------------
         */

        // Vacío por el momento.
    };
    
    /*
     * GrafoPonderado: prototipo y "herencia":
     * --------------------------------------- */
    GrafoPonderado.prototype = Object.create(Grafo.prototype);
    GrafoPonderado.constructor = GrafoPonderado;
    
    // ------------------------------------------------------------------------

    /**
     * Nodo: constructor:
     * ================== */
    /**
     * Crea un objeto Nodo que contiene un valor (único), un listado de objetos
     * Arco en donde Nodo es origen, y un listado de objetos Arco en los que
     * Nodo es destino (o ambos.)
     *
     * Es un error si valor es undefined. Es un parámetro obligatorio.
     *
     * Importante: para garantizar que este Nodo sea único (es decir, que no
     * exista un Nodo con el mismo valor que este nodo), use el método
     * crearNodo de un objeto Grafo.
     */
    var Nodo = function(valor) {
        if (valor === undefined) {
            throw new TypeError('El parámetro "valor" de Nodo es obligatorio.');
        }
        
        /*
         * Nodo: constructor de "padre":
         * -----------------------------
         */
        ObjetoBaseGrafos.call(this);
        
        /* Nodo: variables "privadas" de "instancia":
         * ------------------------------------------
         */
        
        /** Listado de objetos Arco en donde este Nodo es el Nodo origen. */
        var arcosOrigen;

        /** Listado de objetos Arco en donde este Nodo es el Nodo destino. */
        var arcosDestino;

        /* Nodo: métodos "privilegiados" de "instancia":
         * ---------------------------------------------
         */
        
        /**
         * Regresa arreglo de objetos Arco en donde este Nodo es el
         * nodo Origen.
         *
         * Usar con cuidado.
         */
        this.getArcosOrigen = function() {
            return arcosOrigen;
        };
        
        /**
         * Sobreescribe arreglo interno de objetos Arco en donde este Nodo
         * es el nodo origen.
         *
         * Usar con cuidado.
         */
        this.setArcosOrigen = function(valor) {
            arcosOrigen = valor;
        };
        
        /**
         * Regresa arreglo de objetos Arco en donde este Nodo es destino.
         * Usar con cuidado.
         */
        this.getArcosDestino = function() {
            return arcosDestino;
        };
        
        /**
         * Sobreescribe arreglo de objetos Arco en donde Nodo es destino.
         * Usar con cuidado.
         */
        this.setArcosDestino = function(valor) {
            arcosDestino = valor;
        };
        
        /**
         * Regresa true si existe un camino de/hacia este Nodo en el Grafo.
         */
        this.conexo = function() {
            return arcosOrigen.length > 0 || arcosDestino.length > 0 ? true : false;
        }

        /* Nodo: inicialización de "instancia":
         * ------------------------------------
         */
        
        // Inicialmente, todo nodo creado no tiene un Arco o ArcoPonderado.
        arcosOrigen = [];
        arcosDestino = [];
    };
    
    /*
     * Nodo: prototipo y "herencia":
     * -----------------------------
     */
    Nodo.prototype = Object.create(ObjetoBaseGrafos.prototype);
    Nodo.constructor = Nodo;
    
    // ------------------------------------------------------------------------
    

    /*
     * Arco: constructor:
     * ================== */
    /**
     * Crea un objeto Arco que representa un camino entre dos objetos Nodo, en
     * donde un nodo es el Nodo "origen" y otro es un Nodo "destino".
     *
     * El parámetro "direccionado" es opcional. Si está presente y es true,
     * entonces el Arco es direccionado; en caso contrario, el Arco es
     * no direccionado (o bi-direccional). En cualquier momento el Arco puede
     * ser convertido en direccionado o no direccionado usando algunos métodos
     * definidos en este objeto.
     *
     * Un Nodo no puede ser origen y destino simultáneamente en un Arco. Esto
     * resultará en una excepción TypeError. También use la función crearArco
     * de Grafo o GrafoPonderado para asegurarse de que no existan
     * mas de dos Arcos representando el mismo camino entre dos objetos Nodo
     * en cualquier dirección.
     */
    var Arco = function(nodoOrigen, nodoDestino, esDireccionado) {
        if (nodoOrigen === undefined || nodoDestino === undefined) {
            throw new TypeError('Los parámetros "nodoOrigen" y "nodoDestino" de Arco son obligatorios.');
        } else if (nodoOrigen === nodoDestino) {
            throw new TypeError("El Nodo origen no puede ser el Nodo destino en un Arco.");
        }
        
        /*
         * Arco: constructor de "padre":
         * -----------------------------
         */
        ObjetoBaseGrafos.call(this);

        /* Arco: variables "privadas" de "instancia":
         * ------------------------------------------
         */
        
        /** Nodo origen. */
        var origen;
        
        /** Nodo destino. */
        var destino;
        
        /** Es este Arco un Arco direccionado? */
        var direccionado;

        /* Arco: métodos "privilegiados" de "instancia":
         * ---------------------------------------------
         */
        
        /**
         * Obtiene una referencia al Nodo origen.
         * Usar con cuidado.
         */
        this.getOrigen = function() {
            return origen;
        };
        
        /**
         * Sobreescribe el Nodo origen.
         * Usar con cuidado. Considere usar Grafo.removerArco o removerNodo.
         */
        this.setOrigen = function(valor) {
            origen = valor;
        };
        
        /**
         * Obtiene una referencia al Nodo destino.
         * Usar con cuidado.
         */
        this.getDestino = function() {
            return destino;
        };

        /**
         * Sobreescribe el Nodo destino.
         * Usar con cuidado. Considere usar Grafo.removerArco o removerNodo.
         */
        this.setDestino = function(valor) {
            destino = valor;
        };
        
        /**
         * Regresa true si este Arco es direccionado; si direccionado es true.
         */
        this.isDireccionado = function() {
            return direccionado;
        };
        
        /** Alias de this.isDireccionado(). No confundir con direccionado. */
        this.direccionado = this.isDireccionado;
        
        /**
         * Sobreescribe el valor de direccionado, convirtiendo este Arco en un
         * Arco direccionado si el nuevo valor es true, o convirtiéndolo en un
         * Arco no direccionado (o bi-direccional) en caso contrario.
         *
         * Usar con mucho cuidado. Su valor debe ser, idealmente, manejado
         * únicamente por objetos Grafo.
         */
        this.setDireccionado = function(valor) {
            direccionado = valor;
        }

        /* Arco: inicialización de "instancia":
         * ------------------------------------
         *
         * Nuevamente, es un error si el Nodo origen es el Nodo destino, pero
         * este objeto no hace dicha comprobación. Use métodos de Grafo o
         * GrafoPonderado para evitar inconsistencias.
         */
        origen = nodoOrigen;
        destino = nodoDestino;
        
        // Es este Arco un arco direccionado?
        direccionado = esDireccionado === undefined || !esDireccionado ? false : true;
    };

    /*
     * Arco: prototipo y "herencia":
     * -----------------------------
     */
    Arco.prototype = Object.create(ObjetoBaseGrafos.prototype);
    Arco.constructor = Arco;
    
    // ------------------------------------------------------------------------

    /*
     * ArcoPonderado: constructor:
     * ========================== */
    /**
     * Un objeto Arco que contiene un valor adicional: un peso.
     *
     * Este subtipo de Arco puede ser usado tanto en Grafo como en
     * GrafoPonderado, pero es el único tipo de Arco permitido en
     * GrafoPonderado. Grafo (no ponderado) tratará todo ArcoPonderado
     * como Arco (no ponderado).
     *
     * El parámetro peso es obligatorio y debe ser un número finito (sea
     * entero o real). El parámetro esDireccionado continua siendo opcional, y
     * el ArcoPonderado será considerado "no direccionado" por defecto. Esto
     * puede ser cambiado en cualquier momento.
     */
    var ArcoPonderado = function(nodoOrigen, nodoDestino, pesoArco, esDireccionado) {
        if (pesoArco === undefined || !Number.isFinite(pesoArco)) {
            throw new TypeError('El parámetro "pesoArco" de ArcoPonderado es obligatorio y debe ser un número real, finito.');
        }
        
        /*
         * ArcoPonderado: constructor de "padre":
         * --------------------------------------
         */
        Arco.call(this, nodoOrigen, nodoDestino, esDireccionado);

        /* ArcoPonderado: variables "privadas" de "instancia":
         * ---------------------------------------------------
         */
        
        /** El Peso asociado con este ArcoPonderado. */
        var peso;

        /* PonderadoArco: métodos "privilegiados" de "instancia":
         * ------------------------------------------------------
         */
        
        /** Regresa el peso asociado con este ArcoPonderado. */
        this.getPeso = function() {
            return peso;
        };
        
        /** Sobreescribe el valor peso asociado con este ArcoPonderado. */
        this.setPeso = function(valor) {
            peso = valor;
        };

        /* ArcoPonderado: inicialización de "instancia":
         * ---------------------------------------------
         */
        peso = pesoArco;
    };

    /*
     * ArcoPonderado: prototipo y "herencia":
     * --------------------------------------
     */
    ArcoPonderado.prototype = Object.create(Arco.prototype);
    ArcoPonderado.constructor = ArcoPonderado;
    
    /*
     * ArcoPonderado: métodos públicos "estáticos":
     * --------------------------------------------
     */
    
    /**
     * Regresa true si el valor de entrada es un Arco que es ArcoPonderado.
     * Regresa false si es un Arco que no es ArcoPonderado. Regresa undefined
     * en todo otro caso, y falla con ReferenceError si valor no está presente.
     */
    ArcoPonderado.esArcoPonderado = function(valor) {
        if (valor instanceof Arco) {
            if (valor instanceof ArcoPonderado) {
                return true;
            } else {
                return false;
            }
        }
        
        return undefined;
    };
    
    return {
        "ObjetoBaseGrafos": ObjetoBaseGrafos,
        "Grafo": Grafo,
        "GrafoPonderado": GrafoPonderado,
        "Nodo": Nodo,
        "Arco": Arco,
        "ArcoPonderado": ArcoPonderado
    };
}());