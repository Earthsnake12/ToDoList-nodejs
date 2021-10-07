const express = require('express');
const router = express.Router();
const fs = require("fs");
const HTMLparser = require('node-html-parser');

//revisa los pendientes y crea la tabla.
router.get('/', function (req, res) {

    console.log("cargar listado de tareas");

    fs.readFile("./paginasHTML/index.html", (err, data) => {

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
        tabla += '<th style="width: 75px;">IMPORT</th>'
        tabla += '<th style="width: 75px;">PRIOR</th>'
        tabla += '</tr></thead><tbody>' 

        fs.readFile("./data/General.json", 'utf8', (err, general) => {

            if (err) {
                tabla = "<h1>No se pudo cargar la tabla</h1>";

            } else {
                let pendientes = JSON.parse(general).Pendientes;

                pendientes.forEach(tarea => {
                    tabla += "<tr>";
                    tabla += "<td>" + tarea.id + "</td>";
                    tabla += "<td><a href='/tarea?id=" + tarea.id + "'>Ver</a></td>";
                    tabla += "<td>" + tarea.titulo + "</td>";
                    tabla += "<td>" + tarea.estado + "</td>";
                    tabla += (tarea.importante)?"<td>si</td>":"<td>l</td>";
                    tabla += (tarea.prioritario)?"<td>si</td>":"<td>l</td>";                    
                    tabla += "</tr>";

                });
                tabla += "</tbody></table>";
            }

            root.querySelector('#lista').replaceWith(tabla); //cargo la tabla en la pag

            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(root.toString());
        });
    });
});

module.exports = router;