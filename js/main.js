"use strict";

var stdout = window.document.getElementById("stdout");
var newLog = function(input) {
    stdout.innerHTML += input + "\n";
};
var origLog = window.console.log;
window.console.log = newLog;
var log = newLog;
var l = newLog;
var d = newLog;

var a = new Grafos.Grafo();
a.insertarNodo("0");
var n1 = a.getNodo("0");
a.insertarNodo("A");
var n2 = a.getNodo("A");
a.insertarNodo("B");
var n3 = a.getNodo("B");

a.insertarArco(n1, n3);
a.insertarArco(n3, n2);
a.insertarArco(n2, n1);
log(a);
/*log("Origen 0:\t" + n1.getArcosOrigen());
log("Destino 0:\t" + n1.getArcosDestino());
log("Origen A:\t" + n2.getArcosOrigen());
log("Destino A:\t" + n2.getArcosDestino());
log("Origen B:\t" + n3.getArcosOrigen());
log("Destino B:\t" + n3.getArcosDestino());
log("\n");*/
a.eliminarNodo(n2);
log(a);
/*log("Origen 0:\t" + n1.getArcosOrigen());
log("Destino 0:\t" + n1.getArcosDestino());
log("Origen A:\t" + n2.getArcosOrigen());
log("Destino A:\t" + n2.getArcosDestino());
log("Origen B:\t" + n3.getArcosOrigen());
log("Destino B:\t" + n3.getArcosDestino());
log("\n");*/
