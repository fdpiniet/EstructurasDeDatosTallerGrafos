Estructuras de Datos: Taller de Grafos
======================================

Proyecto universitario creado para curso *Estructuras De Datos.*

Permite crear Grafos ponderados simples y ofrece maneras para visualizarlos.

Presenta una interfáz de usuario en el archivo index.html la cual requiere JavaScript y un navegador web relativamente moderno para su funcionamiento. Es capáz de visualizar los resultados (rutas, Grafos) producidos por algoritmos de Grafos; por el momento sólo el algoritmo de Dijkstra.

La implementación de Grafo, Nodo, Arco y del algoritmo de Dijkstra se encuentran en js/grafos.js. Todos los demás archivos existen sólo para definir la interfáz de usuario.

El resultado del algorimo de Dijkstra en esta implementación es un Grafo entero, en donde sólo hay arcos entre todos los nodos intermedios en la ruta mas corta desde el nodo origen hasta el nodo destino.

La visualización fue hecha con ayuda de [vis.js](http://visjs.org/).

[Versión "en vivo", en linea](http://fabianpineda.xyz/universidad/estructurasdedatos/).