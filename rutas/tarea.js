const express = require('express');
const router = express.Router();
const fs = require("fs");
const HTMLparser = require('node-html-parser');


//busca el id en el general, lo actualiza y carga una nueva tarea
router.post('/', function (req, res) {

    //cargo JSON general
    fs.readFile("./data/General.json", 'utf8', (err, data) => {

        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end("Archivo general no encontrado");
            return;
        }
        let generalData = JSON.parse(data);
        req.body.id = ++generalData.UltimoId; //coloco id actualizado

        //paso la importancia y prioridad como un booleano
        req.body.importante = (req.body.importante === "false") ? false : true;
        req.body.prioritario = (req.body.prioritario === "false") ? false : true;

        // registro fecha
        let date = new Date();
        req.body.fecha = [date.getDate() + "-" + (1 + date.getMonth()) + "-" + date.getFullYear()];

        // registro avance
        req.body.avance = ["Tarea registrada"];

        //lo guardo dentro del general
        generalData.Pendientes.push(req.body);

        //guardo JSON actualizado
        fs.writeFile("./data/General.json", JSON.stringify(generalData), function (err, result) {
            if (err) {
                console.log(err);
                res.writeHead(500);
                res.end("No se pudo actualizar Archivo General");
                return;
            }
        });

        //actualizo la tabla

        res.writeHead(200);
        res.end("Tarea cargada");

        console.log("Nueva tarea: " + JSON.stringify(req.body));
    });
});

//busca el id pasado y muestra el detalle de la tarea
router.get('/', function (req, res) {

    var id = parseInt(req.query.id, 10); //pasar el parametro como ?id=1
    console.log("Ver tarea " + id);

    fs.readFile("./paginasHTML/tarea.html", (err, data) => {

        if (err) {
            res.writeHead(404);
            res.write('No se pudo cargar la pagina');
            res.end();
            return;
        }
        let root = HTMLparser.parse(data); //Parse la pagina

        fs.readFile("./data/General.json", 'utf8', (err, general) => {

            if (err) {
                root = "<h1>No se pudo cargar registro</h1>";

            } else {
                let pendientes = JSON.parse(general).Pendientes;
                let tarea = pendientes.find(p => p.id === id);

                root.querySelector("#id").set_content(tarea.id.toString());
                root.querySelector("#titulo").set_content(tarea.titulo.toString());
                root.querySelector("#descripcion").set_content(tarea.descripcion.toString());
                root.querySelector("#estado").set_content(tarea.estado.toString());
                if (tarea.importante) root.querySelector("#importante").setAttribute("checked", "");
                if (tarea.prioritario) root.querySelector("#prioritario").setAttribute("checked", "");

                for (let i = 0; i < tarea.avance.length; i++) {
                    let nuevoAvance = '<div id = "' + i + '">';
                    nuevoAvance += '<span>' + tarea.fecha[i] + '</span>';
                    nuevoAvance += '<span>&nbsp; - &nbsp;</span>';
                    nuevoAvance += '<span>' + tarea.avance[i] + '</span>';
                    nuevoAvance += '<span>&nbsp; &nbsp; &nbsp;</span><button type="Button" class="eliminarAvance">X</button></div>'

                    nuevoAvance = HTMLparser.parse(nuevoAvance);
                    root.querySelector("#avances").appendChild(nuevoAvance);
                }
            }
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(root.toString());
        });
    });
});


//Agrega avance con fecha de hoy del id pasado
router.patch('/', function (req, res) {

    const id = parseInt(req.query.id, 10); //pasar el parametro como ?id=1
    console.log("Actualizar Avance " + id);

    fs.readFile("./data/General.json", 'utf8', (err, general) => {

        if (err) {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(503);
            res.end("No se pudo cargar la base de datos");
            return;

        } else {
            let archivoGeneral = JSON.parse(general);

            //obtengo el indice de la tarea en el general
            const tareaIndice = archivoGeneral.Pendientes.map(pendiente => pendiente.id).indexOf(id);

            //agrego fecha y avance
            let date = new Date();
            archivoGeneral.Pendientes[tareaIndice].fecha.push(date.getDate() + "-" + (1 + date.getMonth()) + "-" + date.getFullYear());
            archivoGeneral.Pendientes[tareaIndice].avance.push(req.body.avance);

            //actualizo el archivo general
            fs.writeFile("./data/General.json", JSON.stringify(archivoGeneral), function (err, result) {
                if (err) {
                    console.log(err);
                    res.writeHead(503);
                    res.end("No se pudo actualizar Archivo General");
                    return;
                }
            });
        }

        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end("Avance registrado");
    });
});

module.exports = router;