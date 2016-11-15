"use strict";

var grafo = new Grafos.GrafoPonderado();
var visualizacion;

var stdout = window.document.getElementById("stdout");

var imprimir = function(input) {
    stdout.innerHTML += input + "\n";
};
var origLog = window.console.log;
window.console.log = imprimir;
var log = imprimir;
var l = imprimir;
var d = imprimir;

var entradaValorNodo = window.document.getElementById("entradaValorNodo");
var entradaArcoNodo1 = window.document.getElementById("entradaArcoNodo1");
var entradaArcoNodo2 = window.document.getElementById("entradaArcoNodo2");
var entradaArcoDireccionado = window.document.getElementById("entradaArcoDireccionado");
var entradaArcoPeso = window.document.getElementById("entradaArcoPeso");
var entradaDibujarPesoArcos = window.document.getElementById("entradaDibujarPesoArcos");
var entradaDibujarNombresNodos = window.document.getElementById("entradaDibujarNombresNodos");
var entradaDibujarArcos = window.document.getElementById("entradaDibujarArcos");
var entradaDibujarFlechasArcos = window.document.getElementById("entradaDibujarFlechasArcos");

var accionInsertarNodo = window.document.getElementById("accionInsertarNodo");
var accionEliminarNodo = window.document.getElementById("accionEliminarNodo");
var accionInsertarArco = window.document.getElementById("accionInsertarArco");
var accionEliminarArco = window.document.getElementById("accionEliminarArco");
var accionEliminarGrafo = window.document.getElementById("accionEliminarGrafo");
var accionRedibujar = window.document.getElementById("accionRedibujar");

var accionLimpiar = window.document.getElementById("accionLimpiar");
var accionDepurar = window.document.getElementById("accionDepurar");

accionInsertarNodo.addEventListener("click", function() {
  var valor = entradaValorNodo.value.trim();

  if (valor === undefined || valor === "") {
    imprimir("Error insertando Nodo. Todo Nodo debe tener un valor.");
    return;
  }

  if (grafo.insertarNodo(valor) !== undefined) {
    imprimir("Nodo '" + valor + "' insertado exitosamente.");
  } else {
    imprimir("Error insertando Nodo. Nodo '" + valor +"' ya existe.");
    return;
  }

  visualizar();
});

accionEliminarNodo.addEventListener("click", function() {
  var valor = entradaValorNodo.value.trim();

  if (valor === undefined || valor === "") {
    imprimir("Error eliminando Nodo. Se require el valor de un nodo.");
    return;
  }

  if (grafo.eliminarNodo(grafo.getNodo(valor))) {
    imprimir("Nodo '" + valor + "' eliminado exitosamente.");
  } else {
    imprimir("Error eliminando Nodo. Nodo '" + valor + "' no existe.");
    return;
  }

  visualizar();
});

accionInsertarArco.addEventListener("click", function() {
  var origen = entradaArcoNodo1.value.trim();
  var destino = entradaArcoNodo2.value.trim();
  var direccionado = entradaArcoDireccionado.checked;
  var peso = entradaArcoPeso.value.trim();


  var nodoOrigen;
  var nodoDestino;

  var nuevoArco;
  var resultado;

  if (origen === undefined || origen === "") {
    imprimir("Error insertando Arco. Todo Arco debe tener un Nodo origen.");
    return;
  } else if (destino === undefined || destino === "") {
    imprimir("Error insertando Arco. Todo Arco debe tener un Nodo destino.");
    return;
  } else if (peso === undefined || peso === "" || Number.isNaN(peso = Number(entradaArcoPeso.value)) || !Number.isFinite(peso) || peso < 0) {
    imprimir("Error insertando Arco. Todo Arco debe tener un peso numérico, finito y no negativo.");
    return;
  } else if ((nodoOrigen = grafo.getNodo(origen)) === undefined) {
    imprimir("Error insertando Arco. Nodo origen '" + origen + "' no existe.");
    return;
  } else if ((nodoDestino = grafo.getNodo(destino)) === undefined) {
    imprimir("Error insertando Arco. Nodo destino '" + destino + "' no existe.");
    return;
  } else if (nodoOrigen.comparar(nodoDestino)) {
    imprimir("Error insertando Arco. Nodo origen no puede ser Nodo destino en el mismo Arco.");
    return;
  }

  nuevoArco = grafo.crearArcoPonderado(nodoOrigen, nodoDestino, direccionado, peso);
  resultado = grafo.insertarArcoPonderadoObjeto(nuevoArco);

  if (resultado === undefined) {
    imprimir("Error insertando Arco. La inserción de este nuevo Arco crearía un conflicto con otros Arcos existentes.");
    return;
  } else if (resultado === nuevoArco) {
    imprimir("Arco entre Nodos '" + origen + "' y '" + destino + "' insertado exitosamente.");
  } else {
    imprimir("Arco entre Nodos '" + origen + "' y '" + destino + "' fue convertido en un Arco no direccionado.");
  }

  visualizar();
});

accionEliminarArco.addEventListener("click", function() {
  var origen = entradaArcoNodo1.value.trim();
  var destino = entradaArcoNodo2.value.trim();
  var direccionado = entradaArcoDireccionado.checked;

  var nodoOrigen;
  var nodoDestino;

  if (origen === undefined || origen === "") {
    imprimir("Error eliminando Arco. Todo Arco debe tener un Nodo origen.");
    return;
  } else if (destino === undefined || destino === "") {
    imprimir("Error eliminando Arco. Todo Arco debe tener un Nodo destino.");
    return;
  } else if ((nodoOrigen = grafo.getNodo(origen)) === undefined) {
    imprimir("Error eliminando Arco. Nodo origen '" + origen + "' no existe.");
    return;
  } else if ((nodoDestino = grafo.getNodo(destino)) === undefined) {
    imprimir("Error eliminando Arco. Nodo destino '" + destino + "' no existe.");
    return;
  } else if (nodoOrigen.comparar(nodoDestino)) {
    imprimir("Error eliminando Arco. Nodo origen no puede ser Nodo destino en el mismo Arco.");
    return;
  }

  if (grafo.eliminarArcoPonderado(nodoOrigen, nodoDestino, direccionado, 0)) {
    imprimir("Arco entre Nodos '" + origen + "' y '" + destino + "' eliminado exitosamente.");
  } else {
    imprimir("Error eliminando Arco entre Nodos '" + origen + "' y '" + destino + "': Arco no existe.");
    return;
  }

  visualizar();
});

accionEliminarGrafo.addEventListener("click", function(){
  if (grafo === undefined || grafo.vacio()) {
    imprimir("Error. No se puede eliminar Grafo inexistente o vacío.");
  } else if (window.confirm("Proceder a eliminar el Grafo?\nEsta operación es irreversible.")) {
    grafo = new Grafos.GrafoPonderado();
    imprimir("Grafo eliminado.\nNuevo Grafo creado exitosamente.");
    visualizar();
  }
});

accionRedibujar.addEventListener("click", function(){
  imprimir("Grafo redibujado exitosamente.");
  visualizar();
});

accionLimpiar.addEventListener("click", function(){
  stdout.innerHTML = "";
});

accionDepurar.addEventListener("click", function(){
  if (stdout.innerHTML !== "") {
    imprimir("");
  }

  imprimir("GRAFO:\n======\n" + grafo);
});

var visualizar = function() {
  var canvas = window.document.getElementById("grafo");
  var contenedorCanvas = canvas.parentNode;

  var dibujarNombresNodos = entradaDibujarNombresNodos.checked;
  var dibujarArcos = entradaDibujarArcos.checked;
  var dibujarPesoArcos = entradaDibujarPesoArcos.checked;
  var dibujarFlechasArcos = entradaDibujarFlechasArcos.checked;

  var nodos, n, visNodos;
  var arcos, a, visArcos;
  var visDatos;

  if (visualizacion !== undefined) {
    visualizacion.destroy();
  }

  contenedorCanvas.removeChild(canvas);
  canvas = window.document.createElement("div");
  canvas.setAttribute("id", "grafo");
  contenedorCanvas.appendChild(canvas);

  if (grafo === undefined || grafo.vacio()) {
    return;
  }

  nodos = grafo.getNodos();
  arcos = grafo.getArcos();
  visNodos = new vis.DataSet();
  visArcos = new vis.DataSet();

  for (n in nodos) {
    if (dibujarNombresNodos) {
      visNodos.add({
        "id": nodos[n].getValor(),
        "text": nodos[n].getValor(),
        "label": nodos[n].getValor()
      });
    } else {
      visNodos.add({
        "id": nodos[n].getValor(),
        "text": nodos[n].getValor()
      });
    }
  }

  if (dibujarArcos) {
    for (a in arcos) {
      if (arcos[a].isDireccionado()) {
        visArcos.add({
          "from": arcos[a].getOrigen().getValor(),
          "to": arcos[a].getDestino().getValor(),
          "arrows": {
            "to": {
              "enabled": dibujarFlechasArcos
            }
          },
          "label": dibujarPesoArcos ? arcos[a].getPeso() : undefined,
          "value": dibujarPesoArcos ? arcos[a].getPeso() : undefined
        });
      } else {
        visArcos.add({
          "from": arcos[a].getDestino().getValor(),
          "to": arcos[a].getOrigen().getValor(),
          "arrows": {
            "to": {
              "enabled": dibujarFlechasArcos
            },
            "from": {
              "enabled": dibujarFlechasArcos
            }
          },
          "label": dibujarPesoArcos ? arcos[a].getPeso() : undefined,
          "value": dibujarPesoArcos ? arcos[a].getPeso() : undefined
        });
      }
    }
  }

  visDatos = {
    "nodes": visNodos,
    "edges": visArcos
  };

  visualizacion = new vis.Network(canvas, visDatos, {
    "locale": "es",
    "edges": {
      "scaling": {
        "max": 4,
        "label": {
          "enabled": false
        }
      }
    }
  });
};
