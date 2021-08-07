function generarTablaGeneral() {

  let pendientes = require("../data/General.json").pendientes;
  let tabla = "<table><tr><th>ID</th><th>TITULO</th><th>ESTADO</th><th>LINK</th></tr>"


  for (let i in pendientes) {
    let tarea = require("../data/pendientes/" + i + ".json");

    tabla += "<tr>";
    tabla += "<td>" + tarea.id + "</td>";
    console.log(tarea.id);
    tabla += "<td>" + tarea.titulo + "</td>";
    tabla += "<td>" + tarea.estado + "</td>";
    tabla += "<td><button type='Button'>Click Me!</button></td>";
    tabla += "</tr>";
  }
  tabla += "</table>";
  return tabla;
}

module.exports = generarTablaGeneral();