"use strict";

var stdout = window.document.getElementById("stdout");
var newLog = function(input) {
    stdout.innerHTML += input + "\n";
};
var origLog = window.console.log;
window.console.log = newLog;

var a = new Grafos.Grafo("A");