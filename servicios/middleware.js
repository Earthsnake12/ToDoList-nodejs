const fs = require("fs");
const HTMLparser = require('node-html-parser');

const middlewares = {

    //carga la pag de inicio, revisa los pendientes y crea la tabla.
    paginaInicio: function (req, res, next) {

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


            /*
            try {
                let tabla = require("./geradorTabla.js");
                root.querySelector('#lista').replaceWith(tabla);
 
            } catch (error) {
                root.querySelector('#lista').replaceWith("<div>No se pudo cargar la tabla</div>");
            }*/


        });
    },

    //busca el id en el general, lo actualiza y carga una nueva tarea
    cargarTarea: function (req, res, next) {

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

            let date = new Date();
            req.body.fecha = [date.getDate() + "-" + (1 + date.getMonth()) + "-" + date.getFullYear()]; // registro fecha

            req.body.avance = ["Tarea registrada"]; // registro avance

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
    }
};

module.exports = middlewares;
