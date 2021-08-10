function generarTablaGeneral() {

  let pendientes = require("../data/General.json").Pendientes;
  let tabla = '<table id="lista" ><tr><th>ID</th><th>TITULO</th><th>ESTADO</th><th>LINK</th></tr>'

  pendientes.forEach(tarea => {
    tabla += "<tr>";
    tabla += "<td>" + tarea.id + "</td>";
    tabla += "<td>" + tarea.titulo + "</td>";
    tabla += "<td>" + tarea.estado + "</td>";
    tabla += "<td><button type='Button'>Click Me!</button></td>";
    tabla += "</tr>";
  });

  tabla += "</table>";
  return tabla;
}

module.exports = generarTablaGeneral();