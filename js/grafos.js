/*
 * Namespace/Módulo Grafos
 * ======================= */
/**
 * Define y exporta los objetos Grafo, Nodo y Arco. Estos objetos tienen
 * variantes más especializadas: GrafoPonderado, y ArcoDireccionado.
 */
var Grafos = (function() {
    "use strict";

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
    var ObjetoBaseGrafos = function() {};
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
     * manejo de los mismos objetos que componen el Grafo.
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
         * Obtiene una referencia a un nodo en el Grafo si existe.
         * Es un error si valor es undefined.
         *
         * Un nodo se considera "encontrado" si es exactamente el mismo objeto "valor"
         * o si "valor" es exactamente el valor de algún nodo en el Grafo.
         */
        this.getNodo = function(valor) {
            if (valor === undefined) {
                throw new TypeError('Valor no puede ser undefined en Grafo.getNodo.');
            }

            var i;

            for (i in nodos) {
                if (nodos[i].comparar(valor)) {
                    return nodos[i];
                }
            }

            return undefined;
        };

        /**
         * Asigna (y sobreescribe) arreglo de objetos Nodo en este grafo.
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
         * Regresa un Arco en el Grafo, si existe.
         *
         * La función regresa un Arco cuyo origen y destino coincidan con los
         * parámetros de a función, ó, si el parámetro origen de esta función
         * coincide con el destino de un Arco y al mismo tiempo el parámetro
         * destino de esta función coincide con el parámetro origen de un Arco.
         *
         * Si el parámetro direccionado es undefined o no está presente,
         * entonces la función regresa un Arco "idéntico" en términos de origen
         * y destino, sin importar su propiedad direccionado. Si no es
         * undefined, entonces el Arco regresado debe tener un valor de
         * direccionado igual al parámetro de esta función.
         */
        this.getArco = function(origen, destino, direccionado) {
            var temp = new Arco(origen, destino, direccionado);

            var aux;
            var i;

            if (direccionado === undefined) {
                for (i in arcos) {
                    aux = arcos[i];

                    if (temp.comparar(aux, true)) {
                        return aux;
                    }
                }
            } else {
                for (i in arcos) {
                    aux = arcos[i];

                    if (temp.comparar(aux)) {
                        return aux;
                    }
                }
            }

            return undefined;
        };

        /**
         * Asigna (y sobreescribe) arreglo de objetos Arco en este grafo.
         * Es un error si alguno de los elementos en valor no es un Arco (o
         * ArcoPonderado.)
         *
         * Usar con cuidado.
         */
        this.setArcos = function(valor) {
            var i;

            for (i in valor) {
                if (valor[i] !== undefined && !(valor instanceof Arco)) {
                    throw new TypeError('Grafo.setArcos(valor) sólo acepta objetos Arco y ArcoPonderado.');
                }
            }

            arcos = valor;
        };

        /**
         * Regresa true si "valor" es un Nodo que hace parte de este Grafo, o
         * si "valor" es el valor de cualquier Nodo que hace parte del Grafo.
         *
         * Es un error si valor es undefined.
         *
         * Si valor es un String, entonces su valor será tratado como una
         * String resultante del método valor.trim().
         */
        this.nodoEnGrafo = function(valor) {
            var n = this.getNodo(valor);
            return n !== undefined;
        };

        /**
         * Regresa trus si en el Grafo existe un Arco con los criterios
         * especificados por los parámetros.
         *
         * Ver función getArco.
         */
        this.arcoEnGrafo = function(origen, destino, direccionado) {
            var a = this.getArco(origen, destino, direccionado);
            return a !== undefined;
        };

        /**
         * Crea un nuevo nodo.
         *
         * Usar con cuidado. Puede que exista un Nodo con el mismo valor que
         * un nodo creado por este método. Considere usar las funciones
         * nodoEnGrafo, getNodo y/o insertarNodo.
         *
         * Un valor de undefined es inaceptable y resultará en TypeError.
         * Similarmente, es un error si valor es un Nodo.
         *
         * Si valor es un String, entonces el nodo será creado con un valor
         * igual a valor.trim(). Se ignoran espacios al inicio y final de valor
         */
        this.crearNodo = function(valor) {
            if (valor === undefined) {
                throw new TypeError('Valor no puede ser undefined en Grafo.crearNodo.');
            } else if (valor instanceof Nodo) {
                throw new TypeError('Valor no puede ser un Nodo en Grafo.crearNodo.');
            }

            var v = valor;

            if (valor.constructor === String) {
                v = valor.trim();
            }

            return new Nodo(v);
        };

        /**
         * Intenta agregar un Nodo en el Grafo.
         *
         * Si el parámetro "valor" es un Nodo, valor es tratado como un Nodo
         * que será insertado en el Grafo si y solo si el Grafo no contiene el
         * nodo que se está intentando agregar.
         *
         * Si el parámetro "valor" no es un Nodo y no es undefined, entonces
         * se agregará un nuevo Nodo cuyo valor será "valor" si y solo si no
         * existe un nodo con "valor" como valor en el Grafo. Si "valor" es un
         * String y será insertado en el Grafo, su valor es primero pasado por
         * el método String.trim().
         *
         * Si un nuevo Nodo es insertado en el Grafo como resultado de la
         * operación de este método, entonces el método regresará una
         * referencia al Nodo insertado.
         *
         * Si ningún Nodo fue insertado como resultado de la operación de este
         * método, entonces el valor de regreso será undefined.
         *
         * Un valor de undefined es inaceptable y resultará en TypeError.
         */
        this.insertarNodo = function(valor) {
            if (this.nodoEnGrafo(valor)) {
                return undefined;
            }

            var resultado = this.crearNodo(valor);

            nodos.push(resultado);
            return resultado;
        };

        /**
         * Crea un nuevo Arco.
         *
         * Usar con cuidado. Puede que exista un Arco con la misma información que
         * otro Arco existente en el Grafo. Para asegurarse que no existan conflictos
         * o arcos duplicados, se recomienda que se usen otras funciones de Arcos
         * definidas en este objeto, como insertarArco.
         *
         * El parámetro "direccionado" es opcional. Si es omitido, su valor será
         * tratado como false.
         */
        this.crearArco = function(origen, destino, direccionado) {
            if (origen === undefined || destino === undefined || !(origen instanceof Nodo) || !(destino instanceof Nodo)) {
                throw new TypeError('Se requiere un Nodo origen y Nodo destino en Grafo.crearArco.');
            } else if (direccionado !== undefined && direccionado.constructor !== Boolean) {
                throw new TypeError('Direccionado debe ser undefined, true o false en Grafo.CrearArco.');
            }

            return new Arco(origen, destino, direccionado);
        };

        /**
         * Inserta un nuevo Arco en el Grafo si no existe.
         *
         * Ver función insertarArcoObjeto.
         */
        this.insertarArco = function(origen, destino, direccionado) {
            return this.insertarArcoObjeto(this.crearArco(origen, destino, direccionado));
        };

        /**
         * Inserta un (objeto) Arco en el Grafo si no existe.
         *
         * Teniendo Arco X entre los nodos A y B, si se intenta agregar un nuevo
         * Arco 'Y' en donde el origen es A y el destino es B (o en donde el
         * origen es B y el destino A), la operación falla si 'Y' es un arco
         * no dirigido y regresará undefined. No se agrega 'Y' al Grafo.
         *
         * En el caso anterior si X es un Arco dirigido, entonces la
         * operación no fallará si el Arco que está siendo agregado ('Y')
         * es no dirigido, o si 'Y' es dirigido pero los nodos están conectados
         * en sentido contrario. En estos casos, 'Y' no es agregado al Grafo
         * y es descartado, pero el Arco existente, 'Y', dejará de ser un
         * Arco direccionado y se convertirá en un Arco no direccionado. El
         * valor de retorno de esta función es X.
         *
         * Si no se cumplen las anteriores condiciones, entonces 'Y' es agregado
         * al Grafo y el valor de retorno de la función será 'Y'.
         *
         * Nota: es imposible "convertir" un Arco existente no direccionado en
         * un Arco direccionado usando esta función. Si se busca hacer dicha
         * conersión, se debe eliminar el Arco primero y después crear un nuevo
         * Arco direccionado.
         */
        this.insertarArcoObjeto = function(arco) {
            if (arco === undefined || !(arco instanceof Arco)) {
                throw new TypeError('Se requiere un Arco en Grafo.insertarArcoObjeto.');
            }

            var aux, auxNodo;
            var i;

            for (i in arcos) {
                aux = arcos[i];

                if (arco.comparar(aux, true)) {
                    // Arcos tienen mismos Nodos en sus extremos, pero el origen de un
                    // Arco no necesariamente es el mismo origen del otro arco.
                    // La comparación no tiene en cuenta el valor "direccionado."
                    if (arco.isDireccionado() && aux.isDireccionado()) {
                        // Si ambos son direccionados...
                        if (arco.getDestino().comparar(aux.getDestino())) {
                            // Si son direccionados y tienen el mismo destino, no se hace
                            // Agrega arco al Grafo.
                            return undefined;
                        } else {
                            // De lo contrario, se está intentando agregar un Arco
                            // direccionado en sentido opuesto a un Arco existente con
                            // los mismos nodos, direcionado. El Arco existente pasa de
                            // ser un Arco direccionado a ser un Arco no direccionado, y
                            // el nuevo Arco es descartado.
                            aux.convertirEnNoDireccionado();
                            return aux; // Arco 'Y'
                        }
                    } else if (!arco.isDireccionado() && aux.isDireccionado()) {
                        // Si el Arco existente es direccionado y el nuevo no lo es,
                        // entonces el Arco existente pasa a ser no direccionado.
                        aux.convertirEnNoDireccionado();
                        return aux; // Arco 'Y'
                    } else {
                        // Si no, entonces se está intentando agregar un Arco no
                        // direccionado cuando ya existe un Arco no direccionado entre
                        // los mismos Nodos, ó se está intentando agregar un Arco
                        // direccionado cuando existe un Arco no direccionado entre
                        // los mismos Nodos. Arco es descartado y se regresa undefined.
                        return undefined;
                    }
                }
            }

            // El Arco que se busca agregar no existe en el Grafo, así que es
            // agregado al listado de Arcos y se regresa una referencia al
            // nuevo arco para indicar que la operación fue exitosa.
            arcos.push(arco);

            // Por último, se agrega el Arco al Nodo.
            arco.getOrigen().insertarArcoOrigen(arco);
            arco.getDestino().insertarArcoDestino(arco);

            if (!arco.isDireccionado()) {
              // Si el arco no es direccionado, entonces el Arco no es sólo
              // origen. También es destino.
              arco.getOrigen().insertarArcoDestino(arco);
              arco.getDestino().insertarArcoOrigen(arco);
            }

            return arco; // Arco 'X'
        };

        /**
         * Elimina un objeto Arco del Grafo y de todos los Nodos involucrados
         * en este Arco, sin importar la dirección. En este sentido, la propiedad
         * direccionado es opcional.
         *
         * Ver: eliminarArcoObjeto.
         */
        this.eliminarArco = function(origen, destino, direccionado) {
          return this.eliminarArcoObjeto(this.crearArco(origen, destino, direccionado));
        };

        /**
         * Elimina un objeto Arco del Grafo y de todos los Nodos involucrados
         * en este Arco sin importar la dirección.
         *
         * Si la operacion es exitosa, se regresa true. Si no, false.
         */
        this.eliminarArcoObjeto = function(arco) {
          var auxArco, auxNodo, iNodo; // iNodo por "indice de nodo"
          var i;

          for (i in arcos) {
            auxArco = arcos[i];

            if (auxArco.comparar(arco, true)) {
              // Primero se procesa listado de Arcos de Nodo origen.
              auxNodo = auxArco.getOrigen();

              if ((iNodo = auxNodo.getArcoOrigen(auxArco.getDestino())) > -1) {
                auxNodo.eliminarArcoOrigen(iNodo);
              }

              if ((iNodo = auxNodo.getArcoDestino(auxArco.getOrigen())) > -1) {
                auxNodo.eliminarArcoDestino(iNodo);
              }

              // Luego se procesa listado de Arcos de Nodo destino.
              auxNodo = auxArco.getDestino();

              if ((iNodo = auxNodo.getArcoOrigen(auxArco.getDestino())) > -1) {
                auxNodo.eliminarArcoOrigen(iNodo);
              }

              if ((iNodo = auxNodo.getArcoDestino(auxArco.getOrigen())) > -1) {
                auxNodo.eliminarArcoDestino(iNodo);
              }

              // Por último, se retira el Arco del listado de Arcos.
              arcos.splice(i, 1);

              return true;
            }
          }

          return false;
        };

        /**
         * Elimina un Nodo del Grafo y todos los Arcos que lo involucran si
         * dicho nodo existe y hace parte del Grafo.
         *
         * Regresa true si un Nodo fue eliminado como resultado de esta
         * operación. Regresa false en caso contrario.
         */
        this.eliminarNodo = function(nodo) {
          var auxNodo;
          var i;

          // Nodo no existe o no fue encontrado en el Grafo. Nada que hacer.
          if (nodo === undefined) {
            return false;
          } else if ((auxNodo = this.getNodo(nodo)) === undefined) {
            return false;
          }

          for (i = arcos.length - 1; i > -1; i--) {
            if (arcos[i].getOrigen().comparar(auxNodo) || arcos[i].getDestino().comparar(auxNodo)) {
              this.eliminarArcoObjeto(arcos[i]);
            }
          }

          for (i in nodos) {
            // Algo ineficiente iterar sobre todos los nodos una vez más
            // para obtener el índice del nodo que se busca remover...
            if (nodos[i].comparar(nodo, true)) {
              nodos.splice(i, 1);
              break;
            }
          }

          return true;
        };

        /** Regresa número de objetos Nodo en el Grafo. */
        this.numeroNodos = function() {
            return nodos.length;
        };

        /** Regresa true si este Grafo no contiene objetos Nodo. */
        this.vacio = function() {
            return nodos.length === 0;
        };

        /** Regresa número de objetos Arco en el Grafo. */
        this.numeroArcos = function() {
            return arcos.length;
        };

        /**
         * Regresa true si todos los nodos tienen un camino de/hacia otro Nodo
         * en este Grafo.
         *
         * Un Grafo vacío o con un sólo Nodo es considerado no conexo.
         */
        this.conexo = function() {
            var resultado = true;
            var i;

            if (nodos.length <= 1) {
                resultado = false;
            } else {
                for (i in nodos) {
                    if (!(nodos[i].conexo())) {
                        resultado = false;
                        break;
                    }
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
            var i;

            for (i in arcos) {
                if (arcos[i].isDireccionado()) {
                    resultado = true;
                    break;
                }
            }

            return resultado;
        };

        /**
         * Regresa una representación de este objeto como un String.
         *
         * Invocado automáticamente cuando un objeto de este tipo es pasado
         * como referencia a un método que espera un String, o si se intenta
         * hacer un type casting a String.
         *
         * Principalmente usado para depuración. Hace posible statements como
         * el siguiente:
         *
         *      window.console.log(referenciaNodoX);
         *
         * Es definido como un método privilegiado y no como un método de
         * prototipo ya que requiere acceso a la información "privada"
         * que el objeto está encapsulando.
         */
        this.toString = function() {
            var salida = "";
            var i;

            salida += "Vacío?     " + (this.vacio() ? "Sí" : "No") + "\n";
            salida += "Num Nodos: " + this.numeroNodos() + "\n";
            salida += "Num Arcos: " + this.numeroArcos() + "\n";
            salida += "Conexo?    " + (this.conexo() ? "Sí" : "No") + "\n";
            salida += "Digrafo?   " + (this.digrafo() ? "Sí" : "No") + "\n";

            salida += "\nNODOS:\n------\n";

            if (nodos.length > 0) {
                for (i in nodos) {
                    salida += "* " + nodos[i] + "\n";
                }
            } else {
                salida += "Ninguno.\n";
            }

            salida += "\nARCOS:\n------\n";

            if (arcos.length > 0) {
                for (i in arcos) {
                    salida += "* " + arcos[i] + "\n";
                }
            } else {
                salida += "Ninguno.\n";
            }

            return salida;
        };


        /* Grafo: inicialización de "instancia":
         * -------------------------------------
         */

        // Configurando instancia usando el valor de "raíz".
        if (raiz === undefined) {
            // raíz no está presente. El grafo permanece vacío por el momento.
            nodos = [];
        } else if (raiz instanceof Nodo) {
            // raíz es un Nodo. Grafo contendrá un solo Nodo: raíz.
            nodos = [raiz];
        } else {
            // raíz es un valor. Grafo contendrá un Nodo cuyo valor será Raíz.
            nodos = [this.crearNodo(raiz)];
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

        /**
         * Asigna (y sobreescribe) arreglo de objetos ArcoPonderado a este
         * GrafoPonderado. Lanza TypeError si algun Arco no es ArcoPonderado.
         *
         * Usar con cuidado.
         */
        this._Grafo_setArcos = this.setArcos;
        this.setArcos = function(valor) {
            var i;

            for (i in valor) {
                if (valor[i] !== undefined && !ArcoPonderado.esArcoPonderado(valor[i])) {
                    throw new TypeError('GrafoPonderado.setArcos sólo acepta arcos de tipo ArcoPonderado.');
                }
            }

            this._Grafo_setArcos(valor);
        };

        /**
         * Alias de setArcos.
         */
        this.setArcosPonderados = this.setArcos;

        /**
         * Crea un nuevo ArcoPonderado sin agregarlo al GrafoPonderado.
         *
         * Funciona de la misma manera que la implementación de este método
         * en el objeto Grafo, pero sólo crea objetos ArcoPonderado con un peso.
         * Es un error si se intenta crear un ArcoPonderado con un peso
         * no-numérico, infinito o menor que 0.
         */
        this.crearArco = function(origen, destino, direccionado, peso) {
            return new ArcoPonderado(origen, destino, direccionado, peso);
        };

        /**
         * Alias de crearArco. Crea un ArcoPonderado sin agregarlo
         * al GrafoPonderado.
         */
        this.crearArcoPonderado = this.crearArco;

        /**
         * Inserta un nuevo ArcoPonderado en el Grafo si no existe.
         *
         * Funciona igual que el método con el mismo nombre en su "objeto
         * padre" (Grafo), pero sólo trabaja con objetos ArcoPonderado.
         */
        this.insertarArco = function(origen, destino, direccionado, peso) {
            return this.insertarArcoPonderadoObjeto(this.crearArcoPonderado(origen, destino, direccionado, peso));
        };

        /**
         * Alias de insertarArco
         */
        this.insertarArcoPonderado = this.insertarArco;

        /**
         * Inserta un (objeto) ArcoPonderado en el GrafoPonderado si no existe.
         *
         * Funciona cómo el método con el mismo nombre de su "super-objeto"
         * Grafo, sólo que trabaja exclusivamente con objetos ArcoPonderado.
         */
        this._Grafo_insertarArcoObjeto = this.insertarArcoObjeto;
        this.insertarArcoObjeto = function(arco) {
            if (!ArcoPonderado.esArcoPonderado(arco)) {
              return undefined;
            }

            return this._Grafo_insertarArcoObjeto(arco); // Arco 'X'
        };

        /**
         * Alias de insertarArcoObjeto.
         */
        this.insertarArcoPonderadoObjeto = this.insertarArcoObjeto;

        /**
         * Elimina un objeto ArcoPonderado del GrafoPonderado.
         *
         * Funciona igual que la versión de su super-objeto, pero sólo
         * trabaja con objetos ArcoPonderado.
         *
         * Dirección y peso son ignorados, pero deben ser valores válidos.
         * direccionado puede ser undefined, true o false. Peso puede ser
         * cualquier número válido, finito y no negativo.
         */
        this.eliminarArco = function(origen, destino, direccionado, peso) {
          return this.eliminarArcoPonderadoObjeto(this.crearArcoPonderado(origen, destino, direccionado, peso));
        };

        /**
         * Alias de eliminarArco.
         */
        this.eliminarArcoPonderado = this.eliminarArco;

        /**
         * Alias de eliminarArcoObjeto.
         */
        this.eliminarArcoPonderadoObjeto = this.eliminarArcoObjeto;

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
     * Es un error si valorNodo es undefined. Es un parámetro obligatorio.
     *
     * Importante: para garantizar que este Nodo sea único (es decir, que no
     * exista un Nodo con el mismo valor que este nodo), use el método
     * crearNodo de un objeto Grafo.
     */
    var Nodo = function(valorNodo) {
        if (valorNodo === undefined) {
            throw new TypeError('El parámetro "valorNodo" de Nodo es obligatorio en constructor de Nodo.');
        }

        /*
         * Nodo: constructor de "padre":
         * -----------------------------
         */
        ObjetoBaseGrafos.call(this);

        /* Nodo: variables "privadas" de "instancia":
         * ------------------------------------------
         */

        /** Valor de este nodo. Debe ser único en un Grafo. */
        var valor;

        /** Listado de objetos Arco en donde este Nodo es el Nodo origen. */
        var arcosOrigen;

        /** Listado de objetos Arco en donde este Nodo es el Nodo destino. */
        var arcosDestino;

        /* Nodo: métodos "privilegiados" de "instancia":
         * ---------------------------------------------
         */

        /**
         * Regresa el valor actual del Nodo.
         */
        this.getValor = function() {
            return valor;
        };

        /**
         * Cambia el valor de este nodo.
         *
         * Usar con mucho cuidado. Este objeto no es capáz de comprobar si
         * existen otros Nodo con el mismo valor en el Grafo al que hace
         * parte. Use métodos del objeto Grafo para prevenir este tipo de
         * situaciones.
         */
        this.setValor = function(valorNuevo) {
            valor = valorNuevo;
        };

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
        this.setArcosOrigen = function(valorOrigen) {
            arcosOrigen = valorOrigen;
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
        this.setArcosDestino = function(valorDestino) {
            arcosDestino = valorDestino;
        };

        /**
         * Regresa el índice de un Arco en el arreglo de Arcos en donde este
         * Nodo es el nodo origen y otro es el Nodo destino si y solo si el
         * listado contiene dicho Arco. Si no, regresa -1.
         */
        this.getArcoOrigen = function(otro) {
          var aux;
          var i;

          for (i in arcosOrigen) {
            aux = arcosOrigen[i];

            if (aux.getDestino().comparar(otro)) {
              return i;
            }
          }

          return -1;
        };

        /**
         * Regresa el índice de un Arco en el arreglo de Arcos en donde este
         * Nodo es el nodo destino y otro es el Nodo origen si y solo si el
         * listado contiene dicho Arco. Si no, regresa -1.
         */
        this.getArcoDestino = function(otro) {
          var aux;
          var i;

          for (i in arcosDestino) {
            aux = arcosDestino[i];

            if (aux.getOrigen().comparar(otro)) {
              return i;
            }
          }

          return -1;
        };

        /**
         * Arega un Arco al arreglo de Arcos en donde este Nodo es origen.
         *
         * Usar con cuidado. Considere usar las funciones que trabajan con
         * Arcos en Grafo para mantener Grafos consistentes.
         */
        this.insertarArcoOrigen = function(arco) {
          arcosOrigen.push(arco);
        };

        /**
         * Arega un Arco al arreglo de Arcos en donde este Nodo es destino.
         *
         * Usar con cuidado. Considere usar las funciones que trabajan con
         * Arcos en Grafo para mantener Grafos consistentes.
         */
        this.insertarArcoDestino = function(arco) {
          arcosDestino.push(arco);
        };

        /**
         * Inserta un Arco en ambos listados de Arcos de este Nodo.
         *
         * Usado principalmente cuando se requiere insertar un Arco no-
         * direccionado, ya que debería aparecer en ambos arreglos.
         */
       this.insertarArco = function(arco) {
         arcosOrigen.push(arco);
         arcosDestino.push(arco);
       };

        /**
         * Remueve un Arco del arreglo de Arcos en donde este Nodo es el Nodo
         * origen, por su índice.
         */
       this.eliminarArcoOrigen = function(arco) {
         arcosOrigen.splice(arco, 1);
       };

       /**
        * Remueve un Arco del arreglo de Arcos en donde este Nodo es el Nodo
        * destino, por su índice.
        */
      this.eliminarArcoDestino = function(arco) {
         arcosDestino.splice(arco, 1);
      };

        /**
         * Regresa true si valorComp es este Nodo, o si valorComp es igual al
         * valor de este modo.
         *
         * Si valorComp es un String, entonces será tratado como el resultado
         * de valorComp.trim(); se ignoran espacios al inicio y final.
         *
         * Es un error si valorComp es undefined y resulta en TypeError.
         */
        this.comparar = function(valorComp) {
            if (valorComp === undefined) {
                throw new TypeError("Nodo.comparar requiere un valor de entrada.");
            }

            if ((valorComp instanceof Nodo) && valor == valorComp) {
                return true;
            } else if (valorComp.constructor === String && valor == valorComp.trim()) {
                return true;
            }

            return false;
        };

        /**
         * Regresa true si existe un camino de/hacia este Nodo en el Grafo.
         */
        this.conexo = function() {
            return arcosOrigen.length > 0 || arcosDestino.length > 0;
        };

        /**
         * Regresa true si este Nodo es adyacente a otro Nodo.
         */
        this.adyacente = function(otro) {
            var i, j;

            for (i in arcosOrigen) {
                if (otro.comparar(arcosOrigen[i].getDestino())) {
                    return true;
                }
            }

            for (j in arcosDestino) {
                if (otro.comparar(arcosDestino[j].getOrigen())) {
                    return true;
                }
            }

            return false;
        };

        /** Regresa una representación de este objeto como un String. */
        this.toString = function() {
            return valor;
        };

        /* Nodo: inicialización de "instancia":
         * ------------------------------------
         */

        // Persistiendo valor.
        valor = valorNodo;

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
        } else if (nodoOrigen == nodoDestino) {
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

        /**
         * Sobreescribe el valor de direccionado, convirtiendo este Arco en un
         * Arco direccionado si el nuevo valor es true, o convirtiéndolo en un
         * Arco no direccionado (o bi-direccional) en caso contrario.
         *
         * Usar con mucho cuidado. Su valor debe ser, idealmente, manejado
         * únicamente por objetos Grafo. Este método no garantiza que el Grafo
         * permanezca en un estado consistente.
         */
        this.setDireccionado = function(valor) {
            direccionado = valor;
        };

        /**
         * Convierte este Arco direccionado en un arco no-direccionado,
         * dejando los arreglos de Arcos (tanto el arreglo "global" como los
         * arreglos internos de cada Nodo) en un estado consistente.
         *
         * Usar con cuidado. Puede agregar referencias al Arco en Nodos
         * existentes. No comprueba primero si el arco es o no es direccionado.
         * El uso de esta función debe ser dejado a la función insertarArco del
         * objeto Grafo.
         */
        this.convertirEnNoDireccionado = function() {
          direccionado = false;

          // Se agregan referencias a Arco en sus Nodos, si faltan
          if (origen.getArcoOrigen(destino) < 0) {
            origen.insertarArcoOrigen(this);
          }

          if (origen.getArcoDestino(origen) < 0) {
            origen.insertarArcoDestino(this);
          }

          if (destino.getArcoOrigen(destino) < 0) {
            destino.insertarArcoOrigen(this);
          }

          if (destino.getArcoDestino(origen) < 0) {
            destino.insertarArcoDestino(this);
          }
        };

        /**
         * Compara este Arco con otro Arco.
         *
         * Dos Arcos son considerados idénticos si se cumple alguno de los siguientes:
         *
         *  1) Los dos Arcos son exactamente el mismo objeto.
         *  2) Tienen mismo origen, destino y propiedad direccionado (no se Tiene
         *     en cuenta el "sentido", solo el valor.)
         *  3) El origen de este Arco es el destino del otro Arco, el destino de este
         *     Arco es el origen del otro Arco y ambos Arcos tienen valores de
         *     "direccionado" iguales.
         *
         * Si el parámetro ignorarDireccionado está presente y es true, entonces
         * Sólo se comparan los nodos por origen y destino, no por igualdad
         * estricta entre objetos ni por valor "direccionado"
         */
        this.comparar = function(otro, ignorarDireccionado) {
            if (otro === undefined) {
                throw new TypeError("Arco.comparar requiere un valor de entrada.");
            }

            if (ignorarDireccionado !== undefined && ignorarDireccionado) {
                if (origen.comparar(otro.getOrigen()) && destino.comparar(otro.getDestino())) {
                    return true;
                } else if (origen.comparar(otro.getDestino()) && destino.comparar(otro.getOrigen())) {
                    return true;
                }

                return false;
            }

            if (this == otro) {
                return true;
            } else if (origen.comparar(otro.getOrigen()) && destino.comparar(otro.getDestino()) && direccionado == otro.isDireccionado()) {
                return true;
            } else if (origen.comparar(otro.getDestino()) && destino.comparar(otro.getOrigen()) && direccionado == otro.isDireccionado()) {
                return true;
            }

            return false;
        };

        /** Regresa una representación de este objeto como un String. */
        this.toString = function() {
          if (direccionado) {
            return "Direccionado: " + origen + " ---> " + destino;
          } else {
            return "No-direccionado: " + origen + " <---> " + destino;
          }
        };

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
    var ArcoPonderado = function(nodoOrigen, nodoDestino, esDireccionado, pesoArco) {
        /*
         * ArcoPonderado: constructor de "padre":
         * --------------------------------------
         */
        Arco.call(this, nodoOrigen, nodoDestino, esDireccionado);

        // Validación de parámetros de constructor de este objeto hijo:
        var _pesoArco = Number(pesoArco);

        if (Number.isNaN(_pesoArco) || !Number.isFinite(_pesoArco) || _pesoArco < 0) {
            throw new TypeError('El parámetro "pesoArco" de ArcoPonderado es obligatorio y debe ser un número real, finito y no negativo.');
        }

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

        /** Regresa una representación de este objeto como un String. */
        this.toString = function() {
          if (this.isDireccionado()) {
            return "Direccionado: " + this.getOrigen() + " ---> " + this.getDestino() + "; Peso: " + peso;
          } else {
            return "No-direccionado: " + this.getOrigen() + " <---> " + this.getDestino() + "; Peso: " + peso;
          }
        };

        /* ArcoPonderado: inicialización de "instancia":
         * ---------------------------------------------
         */
        peso = _pesoArco;
        _pesoArco = undefined;
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
