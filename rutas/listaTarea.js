const express = require('express');
const router = express.Router();
const fs = require("fs");
const HTMLparser = require('node-html-parser');

//revisa los pendientes y crea la tabla.
router.get('/', function (req, res) {

    const tableroSelec = TABLEROSELECCIONADO

    console.log("cargar listado de tareas del tablero " + tableroSelec);
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
    tabla += '<th style="width: 80px;font-size: 10px;">ULTIMO AVANCE</th>'
    tabla += '<th style="width: 5px;font-size: 10px;">IMPORT</th>'
    tabla += '<th style="width: 5px;font-size: 10px;">PRIOR</th>'
    tabla += '<th style="width: 5px;font-size: 10px;">RANK</th>'
    tabla += '</tr></thead><tbody>'

    try {
        let general = fs.readFileSync("./data/General.json", 'utf8')
        let tableros = JSON.parse(general).Tableros;

        let pendientes = tableros.find((element) => element.Nombre === tableroSelec).Pendientes;

        pendientes.forEach(id => {

            let tarea = fs.readFileSync("./data/files/" + id + "/data.json" , 'utf8')
            tarea = JSON.parse(tarea)

            let ranking = 0;
            let estadoSeparado = tarea.estado.split("#");
            let fechaSeparada = estadoSeparado[1].split("-");
            let diasPasados = new Date()- new Date(fechaSeparada[2], fechaSeparada[1] - 1, fechaSeparada[0]);
            
            if ((diasPasados) / (1000 * 3600 * 24) >= 62) tabla += "<tr style='color: red;'>";
            else if ((diasPasados) / (1000 * 3600 * 24) >= 31) tabla += "<tr style='color: darkorange;'>";
            else if ((diasPasados) / (1000 * 3600 * 24) >= 5) tabla += "<tr style='color: #3D3D3D;'>";
            else tabla += "<tr style='color: green;'>";

            tabla += "<td style='color: inherit;'>" + tarea.id + "</td>";
            tabla += "<td><a href='/tarea?id=" + tarea.id + "'>Ver</a></td>";
            tabla += "<td style='color: inherit;'>" + tarea.titulo + "</td>";
            tabla += "<td style='color: inherit;'>" + estadoSeparado[0] + "</td>";
            tabla += "<td style='color: inherit;'>" + estadoSeparado[1] + "</td>";

            if (tarea.importante) {
                tabla += "<td style='color: inherit;'>si</td>";
                ranking += 2
            } else tabla += "<td style='color: inherit;'>l</td>";

            if (tarea.prioritario) {
                tabla += "<td style='color: inherit;'>si</td>";
                ranking += 1
            } else tabla += "<td style='color: inherit;'>l</td>";

            tabla += "<td style='color: inherit;'>" + ranking + "</td>";
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

    const tableroSelec = TABLEROSELECCIONADO; //pasar el parametro como ?tablero=

    console.log("cargar listado de tareas termiandas del tablero " + tableroSelec);

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

        try {
            let general = fs.readFileSync("./data/General.json", 'utf8')
            let tableros = JSON.parse(general).Tableros;
    
            let finalizados = tableros.find((element) => element.Nombre === tableroSelec).Finalizados;
    
            finalizados.forEach(id => {
    
                let tarea = fs.readFileSync("./data/files/" + id + "/data.json" , 'utf8')
                tarea = JSON.parse(tarea)

                    tabla += "<tr>";
                    tabla += "<td>" + tarea.id + "</td>";
                    tabla += "<td><a href='/tarea?id=" + tarea.id + "'>Ver</a></td>";
                    tabla += "<td>" + tarea.titulo + "</td>";
                    tabla += "<td>" + tarea.estado + "</td>";
                    tabla += "</tr>";

                });
                tabla += "</tbody></table>";
            } catch (err) {
                
                tabla = "<h1>No se pudo cargar la tabla</h1>";
                console.log(err)
            }

            root.querySelector('#TableroSeleccionado').replaceWith(DESPLEGABLETABLERO);
            root.querySelector('#lista').replaceWith(tabla); //cargo la tabla en la pag

            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(root.toString());
        });
    });


module.exports = router;