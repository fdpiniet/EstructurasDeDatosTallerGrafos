"use strict";

var grafo = new Grafos.Grafo();
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

var accionInsertarNodo = window.document.getElementById("accionInsertarNodo");
var accionEliminarNodo = window.document.getElementById("accionEliminarNodo");
var accionInsertarArco = window.document.getElementById("accionInsertarArco");
var accionEliminarArco = window.document.getElementById("accionEliminarArco");

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
  }

  visualizar();
});

accionInsertarArco.addEventListener("click", function() {
  var origen = entradaArcoNodo1.value.trim();
  var destino = entradaArcoNodo2.value.trim();
  var direccionado = entradaArcoDireccionado.checked;

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

  nuevoArco = grafo.crearArco(nodoOrigen, nodoDestino, direccionado);
  resultado = grafo.insertarArcoObjeto(nuevoArco);

  if (resultado === undefined) {
    imprimir("Error insertando Arco. La inserción de este nuevo Arco crearía un conflicto con otros Arcos existentes.");
  } else if (resultado === nuevoArco) {
    imprimir("Arco entre Nodos '" + origen + "' y '" + destino + "' insertado exitosamente.");
  } else {
    imprimir("Arco entre Nodos '" + origen + "' y '" + destino + "' fue convertido en un Arco no direccionado.");
  }

  visualizar();
});

accionEliminarArco.addEventListener("click", function() {

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
  } else {
    nodos = grafo.getNodos();
    arcos = grafo.getArcos();
    visNodos = new vis.DataSet();
    visArcos = new vis.DataSet();

    for (n in nodos) {
      visNodos.add({
        "id": nodos[n].getValor(),
        "text": nodos[n].getValor(),
        "label": nodos[n].getValor()
      });
    }

    for (a in arcos) {
      if (arcos[a].isDireccionado()) {
        visArcos.add({
          "from": arcos[a].getOrigen().getValor(),
          "to": arcos[a].getDestino().getValor(),
          "arrows": {
            "to": {
              "enabled": true
            }
          }
        });
      } else {
        visArcos.add({
          "from": arcos[a].getDestino().getValor(),
          "to": arcos[a].getOrigen().getValor(),
          "arrows": {
            "to": {
              "enabled": true
            },
            "from": {
              "enabled": true
            }
          }
        });
      }
    }

    visDatos = {
      "nodes": visNodos,
      "edges": visArcos
    };

    visualizacion = new vis.Network(canvas, visDatos, {
      "locale": "es"
    });
  }
};
