const fs = require("fs");
const HTMLparser = require('node-html-parser');

const middlewares = {

    paginaInicio: function (req, res, next) {

        fs.readFile("./inicio/index.html", (err, data) => {

            if (err) {
                res.writeHead(404);
                res.write('No se pudo cargar la pagina');
                res.end();
            } else {

                let root = HTMLparser.parse(data);
                try {
                    let tabla = require("./paginasHTML/geradorTabla.j");
                    root.querySelector('#pp').replaceWith(tabla);

                } catch (error) {
                    root.querySelector('#pp').replaceWith("<div>No se pudo cargar la tabla</div>");
                }
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end(root.toString());
            }
        });
    }
};
module.exports = middlewares;
