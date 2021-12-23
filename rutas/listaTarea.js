const express = require('express');
const router = express.Router();
const fs = require("fs");
const HTMLparser = require('node-html-parser');

//revisa los pendientes y crea la tabla.
router.get('/', function (req, res) {

    const tablero = TABLEROSELECCIONADO; //pasar el parametro como ?tablero=

    console.log("cargar listado de tareas del tablero " + tablero);
    //Cargo Pagina base
    try {
        let data = fs.readFileSync("./paginasHTML/listadoTarea.html")
        var root = HTMLparser.parse(data);

    } catch (err) {

        res.writeHead(404);
        res.write('No se pudo cargar la pagina');
        res.end();
        return;
    }

    //tabla a generar
    let tabla = '<table id="lista" class="tablesorter"><thead>';
    tabla += '<tr><th style="width: 30px;">ID</th>'
    tabla += '<th style="width: 50px;">LINK</th>'
    tabla += '<th>TITULO</th>'
    tabla += '<th>ESTADO</th>'
    tabla += '<th style="width: 0px;">*</th>';
    tabla += '<th style="width: 75px;">IMPORT</th>'
    tabla += '<th style="width: 75px;">PRIOR</th>'
    tabla += '<th style="width: 75px;">RANK</th>'
    tabla += '</tr></thead><tbody>'

    try {
        let pendientes = fs.readFileSync("./data/" + tablero + "/Pendientes.json", 'utf8')
        let tareas = JSON.parse(pendientes).Tareas;

        tareas.forEach(tarea => {

            let ranking = 0;
            tabla += "<tr>";
            tabla += "<td>" + tarea.id + "</td>";
            tabla += "<td><a href='/tarea?id=" + tarea.id + "&tablero=" + tablero + "'>Ver</a></td>";
            tabla += "<td>" + tarea.titulo + "</td>";
            tabla += "<td>" + tarea.estado + "</td>";

            tabla += "<td><button type='Button' onClick='marcarTareaTerminada(" + tarea.id + ")'>Ok!</button></td>";

            if (tarea.importante) {
                tabla += "<td>si</td>";
                ranking += 2
            } else tabla += "<td>l</td>";

            if (tarea.prioritario) {
                tabla += "<td>si</td>";
                ranking += 1
            } else tabla += "<td>l</td>";

            tabla += "<td>" + ranking + "</td>";
            tabla += "</tr>";

        });
        tabla += "</tbody></table>";

    } catch (err) {
        tabla = "<h1>No se pudo cargar la tabla</h1>";

    }

    root.querySelector('#TableroSeleccionado').replaceWith(DESPLEGABLETABLERO);
    root.querySelector('#lista').replaceWith(tabla); //cargo la tabla en la pag

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(root.toString());

});

//revisa los finalizados y crea la tabla.
router.get('/finalizadas', function (req, res) {

    const tablero = TABLEROSELECCIONADO; //pasar el parametro como ?tablero=

    console.log("cargar listado de tareas termiandas del tablero " + tablero);

    fs.readFile("./paginasHTML/listadoTarea.html", (err, data) => {

        if (err) {
            res.writeHead(404);
            res.write('No se pudo cargar la pagina');
            res.end();
            return;
        }

        let root = HTMLparser.parse(data); //Pagina base

        //tabla a generar
        let tabla = '<table id="lista" class="tablesorter"><thead>';
        tabla += '<tr><th style="width: 30px;">ID</th>'
        tabla += '<th style="width: 50px;">LINK</th>'
        tabla += '<th>TITULO</th>'
        tabla += '<th>ESTADO</th>'
        tabla += '</tr></thead><tbody>'

        fs.readFile("./data/" + tablero + "/Finalizados.json", 'utf8', (err, general) => {

            if (err) {
                tabla = "<h1>No se pudo cargar la tabla</h1>";

            } else {
                let tareas = JSON.parse(general).Tareas;

                tareas.forEach(tarea => {

                    tabla += "<tr>";
                    tabla += "<td>" + tarea.id + "</td>";
                    tabla += "<td><a href='/tarea?id=" + tarea.id + "&tablero=" + tablero + "'>Ver</a></td>";
                    tabla += "<td>" + tarea.titulo + "</td>";
                    tabla += "<td>" + tarea.estado + "</td>";
                    tabla += "</tr>";

                });
                tabla += "</tbody></table>";
            }

            root.querySelector('#TableroSeleccionado').replaceWith(DESPLEGABLETABLERO);
            root.querySelector('#lista').replaceWith(tabla); //cargo la tabla en la pag

            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(root.toString());
        });
    });
});

module.exports = router;