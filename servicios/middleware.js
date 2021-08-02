const fs = require("fs");

const HTMLparser = require('node-html-parser');

const middlewares = {

    //carga la pag de inicio, revisa los pendientes y crea la tabla
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

        let id;
        try {
            id = require("../data/General.jso").UltimoId + 1;
        } catch (error) {
            console.log(error);
            res.end("Archivo general no encontrado");
        }

        if (id !== undefined) {
            console.log(JSON.stringify(req.body));
            /*
            fs.writeFile("./data/pendientes/" + id + ".json", JSON.stringify(req.body), function (err, result) {
              if (err) console.log('error', err);
            });*/

            res.end("Nueva tarea cargada");
        }
    }
};
module.exports = middlewares;
