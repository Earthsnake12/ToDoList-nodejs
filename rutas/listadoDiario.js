const express = require('express');
const router = express.Router();
const fs = require("fs");
const HTMLparser = require('node-html-parser');

//revisa los pendientes para hoy y crea la tabla.
router.get('/', function (req, res) {

    let fecha = req.query.fecha  //pasar el parametro como ?fecha=1
    console.log("Cargar listado del dia de" + fecha);

    try {
        let pagina = fs.readFileSync("./paginasHTML/listadoDiario.html");
        var root = HTMLparser.parse(pagina); //Pagina base

    } catch (err) {
        res.writeHead(404);
        res.write('No se pudo cargar la pagina');
        res.end();
        return;
    }

    try {
        const data = fs.readFileSync("./data/Diario.json", 'utf8');
        const tareas = JSON.parse(data)

        if (fecha === "hoy") {
            const date = new Date();
            fecha = date.getDate() + "-" + (1 + date.getMonth()) + "-" + date.getFullYear();
        }
        var tabla = generarTabla(tareas, fecha);

        var fechas = "";
        for (let i = 0; i < tareas.Fecha.length && i < 10; i++) {

            fechas += '<a href="/listadoDiario?fecha=';
            fechas += tareas.Fecha[i] + '"style="margin: 0 5px;">'
            fechas += tareas.Fecha[i] + '</a>';
        }

    } catch (err) {
        var tabla = "<h1>No se pudo cargar la tabla</h1>";
        var fechas = "<div></div>"
    }

    root.querySelector('#lista').replaceWith(tabla); //cargo la tabla en la pag
    root.querySelector('#linksFechas').replaceWith(fechas); //cargo la tabla en la pag

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(root.toString());

});

function generarTabla(tareas, fecha) {

    const fechaIndice = tareas.Fecha.indexOf(fecha);

    if (fechaIndice > -1) {

        var tabla = '<table id="lista" class="tablesorter"><thead>';
        tabla += '<th style="width: 90px;">ESTADO</th>';
        tabla += '<th style="width: 70px;">VER TAREA</th>';
        tabla += '<th>DESCRIPCION</th>';
        tabla += '</thead><tbody>'

        let descripcion = tareas.Descripcion[fechaIndice];
        let ids = tareas.ids[fechaIndice];
        let estado = tareas.estado[fechaIndice];

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
        var tabla = "<h3>No se planifico tareas</h3>";
    }
    return tabla;
}

module.exports = router;