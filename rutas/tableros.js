const express = require('express');
const router = express.Router();
const fs = require("fs");
const HTMLparser = require('node-html-parser');

//revisa los tableros y crea la tabla.
router.get('/', function (req, res) {

    console.log("cargar listado de tareas del tableros");
    //Cargo Pagina base
    try {
        let data = fs.readFileSync("./paginasHTML/tableros.html")
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
    tabla += '</tr></thead><tbody>'

    try {
        let tableros = fs.readFileSync("./data/General.json", 'utf8')
        tableros = JSON.parse(tableros);

        for (let tablero in tableros) {
            tabla += "<tr>";
            tabla += "<td>" + tablero.toString().slice(0,-2) + "</td>";
            tabla += "<td><a href='/listatarea?tablero=" + tablero.toString().slice(0,-2) + "'>Ver</a></td>";
            tabla += "</tr>";

        }
        tabla += "</tbody></table>";

    } catch (err) {
        tabla = "<h1>No se pudo cargar la tabla</h1>";

    }

    root.querySelector('#lista').replaceWith(tabla); //cargo la tabla en la pag

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(root.toString());

});

module.exports = router;