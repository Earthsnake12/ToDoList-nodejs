const fs = require("fs");
const HTMLparser = require('node-html-parser');

function mostrarPaginaInicio() {
    
    fs.readFile("./inicio/index.html", (err, data) => {

        if (err) {
            return "No se encontro la pagina"
        }

        let root = HTMLparser.parse(data);
        try {
            let tabla = require("./inicio/geradorTabla.js");
            root.querySelector('#pp').replaceWith(tabla);
        } catch (error) { 
            return "No se pudo generar la tabla"
        }
        console.log("fun");
        return root.toString();
    });
}

module.exports = mostrarPaginaInicio();
