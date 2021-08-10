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
            } else {

                let root = HTMLparser.parse(data);
                try {
                    let tabla = require("./geradorTabla.js");
                    root.querySelector('#lista').replaceWith(tabla);

                } catch (error) {
                    root.querySelector('#lista').replaceWith("<div>No se pudo cargar la tabla</div>");
                }
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end(root.toString());
            }
        });
    },

    //busca el id en el general, lo actualiza y carga una nueva tarea
    cargarTarea: function (req, res, next) {

        //cargo JSON general
        fs.readFile("./data/General.json", 'utf8', (err, data) => {

            if (err) {
                console.log(err);
                res.end("Archivo general no encontrado");
                return;
            }
            let generalData = JSON.parse(data);
            req.body.id = ++generalData.UltimoId;
            console.log(req.body);
            console.log(JSON.stringify(req.body));
            
/*
            //guardo nueva tarea
            fs.writeFile("./data/pendientes/" + ++generalData.UltimoId + ".json", JSON.stringify(req.body), function (err, result) {
                if (err) {
                    console.log(err);
                    res.end("No se pudo agregar la nueva tarea");
                    return;
                }
            });

            //guardo JSON general actualizado
            fs.writeFile("./data/General.json", JSON.stringify(generalData), function (err, result) {
                if (err) {
                    console.log(err);
                    res.end("No se pudo actualizar Archivo General");
                    return;
                }
            });
*/
            res.end("Nueva tarea agregada");
        });
    }
};
module.exports = middlewares;
