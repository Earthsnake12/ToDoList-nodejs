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
            tabla += "<td>" + tablero.toString().slice(0, -2) + "</td>";
            tabla += "<td><a href='/listatarea?tablero=" + tablero.toString().slice(0, -2) + "'>Ver</a></td>";
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

//Crea una nuevo tablero 
router.post('/', function (req, res) {

    let NuevoTableroNombre = req.body.NuevoTableroNombre
    try {
        //cargo JSON general
        let data = fs.readFileSync("./data/General.json", 'utf8');
        var generalData = JSON.parse(data);

    } catch (err) {

        console.log(err);
        res.writeHead(500);
        res.end("Archivo general o de pendientes no encontrado");
        return;
    }
    generalData[NuevoTableroNombre + "Id"] = 0;


    //creo la carpeta para guardar los archivos
    fs.mkdir("./data/" + NuevoTableroNombre, (err) => {
        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end("No se pudo crear la carpeta para los archivos");
            return;
        }
        fs.mkdir("./data/" + NuevoTableroNombre +"/files", (err) => {
            if (err) {
                console.log(err);
                res.writeHead(500);
                res.end("No se pudo crear la carpeta para los archivos");
                return;
            }
        });

        let plantilla = {"Tareas": []};

        fs.writeFile("./data/" + NuevoTableroNombre + "/Finalizados.json", JSON.stringify(plantilla), function (err, result) {
            if (err) {
                console.log(err);
                res.writeHead(500);
                res.end("No se pudo Crear finalizados.json");
                return;
            }
        });

        fs.writeFile("./data/" + NuevoTableroNombre + "/Pendientes.json", JSON.stringify(plantilla), function (err, result) {
            if (err) {
                console.log(err);
                res.writeHead(500);
                res.end("No se pudo Crear pendientes.json");
                return;
            }
        });
        console.log("Carpetas creada y archivos creados");
    });

    //guardo el general actualizado
    fs.writeFile("./data/General.json", JSON.stringify(generalData), function (err, result) {
        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end("No se pudo actualizar Archivo General");
            return;
        }

        res.writeHead(200);
        res.end("Tarea cargada");
        console.log("Nueva tablero: " + NuevoTableroNombre);
    });
});

module.exports = router;