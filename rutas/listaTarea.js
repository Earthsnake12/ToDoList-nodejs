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
        let tabla = '<table id="lista" ><tr><th>ID</th><th>TITULO</th><th>ESTADO</th><th>LINK</th></tr>' //tabla a generar

        fs.readFile("./data/General.json", 'utf8', (err, general) => {

            if (err) {
                tabla = "<h1>No se pudo cargar la tabla</h1>";

            } else {
                let pendientes = JSON.parse(general).Pendientes;

                pendientes.forEach(tarea => {
                    tabla += "<tr>";
                    tabla += "<td>" + tarea.id + "</td>";
                    tabla += "<td>" + tarea.titulo + "</td>";
                    tabla += "<td>" + tarea.estado + "</td>";
                    tabla += "<td><button type='Button'>Click Me!</button></td>";
                    tabla += "</tr>";

                });
                tabla += "</table>";
            }

            root.querySelector('#lista').replaceWith(tabla); //cargo la tabla en la pag

            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(root.toString());
        });
    });
});

module.exports = router;