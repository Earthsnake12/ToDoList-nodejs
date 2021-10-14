const express = require('express');
const router = express.Router();
const fs = require("fs");
const HTMLparser = require('node-html-parser');

//revisa los pendientes para hoy y crea la tabla.
router.get('/hoy', function (req, res) {
    console.log("cargar listado diario");

    let root
    try {
        let pagina = fs.readFileSync("./paginasHTML/listadoDiario.html");
        root = HTMLparser.parse(pagina); //Pagina base

    } catch (err) {
        res.writeHead(404);
        res.write('No se pudo cargar la pagina');
        res.end();
        return;
    }

    let tabla;
    try {
        let data = fs.readFileSync("./data/Diario.json", 'utf8');
        tabla = generarTabla(data);

    } catch (err) {
        tabla = "<h1>No se pudo cargar la tabla</h1>";
    }

    root.querySelector('#lista').replaceWith(tabla); //cargo la tabla en la pag

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(root.toString());

});


/* var id = parseInt(req.query.id, 10); //pasar el parametro como ?id=1
    console.log("Ver tarea " + id); */

function generarTabla(general) {

    // const tareaIndice = archivoGeneral.Pendientes.map(pendiente => pendiente.id).indexOf(id);
    let date = new Date();
    let hoy = date.getDate() + "-" + (1 + date.getMonth()) + "-" + date.getFullYear();
    let tabla;

    if (true/* hoy === JSON.parse(general).Fecha[0] */) {

        tabla = '<table id="lista" class="tablesorter"><thead>';
        tabla += '<th style="width: 90px;">ESTADO</th>';
        tabla += '<th style="width: 70px;">VER TAREA</th>';
        tabla += '<th>DESCRIPCION</th>';
        tabla += '</thead><tbody>'

        let descripcion = JSON.parse(general).Descripcion[0];
        let ids = JSON.parse(general).ids[0];
        let estado = JSON.parse(general).estado[0];

        for (let i = 0; i < descripcion.length; i++) {
            tabla += "<tr>";
            tabla += "<td>" + estado[i] + "</td>";
            tabla += "<td><a href='/tarea?id=";
            tabla += ids[i];
            tabla += "'>" + ids[i] + "</a></td>";
            tabla += "<td>" + descripcion[i] + "</td>";
            tabla += "</tr>";

        };
        tabla += "</tbody></table>";

    } else {
        tabla = "<h3>No se planifico tareas para hoy</h3>";
    }
    return tabla;
}

module.exports = router;