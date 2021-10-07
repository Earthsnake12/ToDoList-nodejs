const express = require('express');
const router = express.Router();
const fs = require("fs");
const HTMLparser = require('node-html-parser');

//revisa los pendientes y crea la tabla.
router.get('/', function (req, res) {

    console.log("cargar listado diario");

    fs.readFile("./paginasHTML/listadoDiario.html", (err, data) => {

        if (err) {
            res.writeHead(404);
            res.write('No se pudo cargar la pagina');
            res.end();
            return;
        }

        let root = HTMLparser.parse(data); //Pagina base

        //tabla a generar
        let tabla = '<table id="lista"><thead>';
        tabla += '<tr><th style="width: 30px;">ID</th>';
        tabla += '<th>DESCRIPCION</th>';
        tabla += '<th>VER TAREA</th>';
        tabla += '</tr></thead><tbody>' 

        fs.readFile("./data/Diario.json", 'utf8', (err, general) => {

            if (err) {
                tabla = "<h1>No se pudo cargar la tabla</h1>";

            } else {
                let fecha = JSON.parse(general).Fecha;

                // const tareaIndice = archivoGeneral.Pendientes.map(pendiente => pendiente.id).indexOf(id);
                let descripcion = JSON.parse(general).Descripcion;
                let ids = JSON.parse(general).ids;

                tareas.forEach(tarea => {
                    tabla += "<tr>";
                    tabla += "<td>" + tarea.id + "</td>";
                    tabla += "<td>" + tarea.titulo + "</td>";
                    tabla += "<td>" + tarea.estado + "</td>";
                    tabla += (tarea.importante)?"<td>si</td>":"<td>.</td>";
                    tabla += (tarea.prioritario)?"<td>si</td>":"<td>.</td>";
                    tabla += "<td><a href='/tarea?id=";
                    tabla += tarea.id;
                    tabla += "'>Ver Tarea</a></td>";
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