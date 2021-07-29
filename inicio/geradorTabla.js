function generarTablaGeneral() {

  let pendientes = require("../data/General.json");
  let tabla = "<table><tr><th>ID</th><th>TITULO</th><th>ESTADO</th><th>LINK</th></tr>"

  for (let i = 0; i < pendientes.General.length; i++) {
    
    tabla += "<tr>";
    tabla += "<td>" + pendientes.General[i].id + "</td>";
    tabla += "<td>" + pendientes.General[i].titulo + "</td>";
    tabla += "<td>" + pendientes.General[i].estado + "</td>";
    tabla += "<td><button type='Button'>Click Me!</button></td>";
    tabla += "</tr>";
  }
  tabla += "</table>";
  return tabla;
}

module.exports = generarTablaGeneral();