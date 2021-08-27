const express = require('express');
const fs = require("fs");
const HTMLparser = require('node-html-parser');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

//carga la pag de inicio, revisa los pendientes y crea la tabla.
app.get('/', function (req, res) {

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

//busca el id en el general, lo actualiza y carga una nueva tarea
app.post('/tarea', function (req, res) {

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
app.get('/tarea/:id',function (req, res) {
    console.log(0);
    var id = parseInt(req.params.id, 10);

    res.writeHead(200);
    res.end();
    console.log(id);
    /*
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
                let tarea = pendientes.find(p => p.id == id);
                console.log(pendientes[0].id);
                /* root.querySelector("#id").set_content(tarea.id.toString());
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
                } */
    /*}
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(root.toString());
}); 
});*/
});

//Agrega avance con fecha de hoy del id pasado
app.patch('/tarea/:id', function (req, res) {

    var id = parseInt(req.params.id, 10);

    fs.readFile("./data/General.json", 'utf8', (err, general) => {

        if (err) {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(503);
            res.end("No se pudo cargar la base de datos");
            return;

        } else {
            let archivoGeneral = JSON.parse(general);

            //obtengo el indice de la tarea en el general
            const tareaIndice = archivoGeneral.pendientes.findIndex(pendiente => pendiente.id === id);

            //agrego fecha y avance
            archivoGeneral.pendientes[tareaIndice].fecha.push(date.getDate() + "-" + (1 + date.getMonth()) + "-" + date.getFullYear());
            archivoGeneral.pendientes[tareaIndice].avance.push(req.body.avance);


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

app.listen(8000)

console.log('Servidor en la url http://127.0.0.1:8000/');
