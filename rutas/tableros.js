const express = require('express');
const router = express.Router();
const fs = require("fs");
const HTMLparser = require('node-html-parser');

//revisa los tableros y crea la tabla.
router.get('/', function (req, res) {

    console.log("cargar listado de tableros");
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
    tabla += '<tr><th style="width: 150px;">TABLERO</th>'
    tabla += '<th>LINK</th>'
    tabla += '</tr></thead><tbody>'

    try {
        let general = fs.readFileSync("./data/General.json", 'utf8')
        general = JSON.parse(general);


        for (let i = 0; i < general.Tableros.length; i++) {
            let tablero = general.Tableros[i]

            tabla += "<tr>";
            tabla += "<td>" + tablero.Nombre + "</td>";
            tabla += "<td><button type='Button' onClick='verTablero(\"" + tablero.Nombre + "\")'>Ver Tablero</button></td>";
            tabla += "</tr>";

        }
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

//Crea una nuevo tablero 
router.post('/', function (req, res) {

    let NuevoTableroNombre = eliminarDiacriticosEs(req.body.NuevoTableroNombre);

    NuevoTableroNombre = NuevoTableroNombre.toUpperCase();

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

    for (let i = 0; i < generalData.Tableros.length; i++) {
        let tablero = generalData.Tableros[i]

        if (tablero.Nombre === NuevoTableroNombre) {

            console.log("Tablero ya existente");

            res.setHeader("Content-Type", "text/html");
            res.writeHead(503);
            res.end("Tablero ya existente");
            return;
        }
    }

    generalData.Tableros.push({
        "Nombre": NuevoTableroNombre,
        "Pendientes": [],
        "Finalizados": []
    })

    //guardo el general actualizado
    fs.writeFile("./data/General.json", JSON.stringify(generalData), function (err, result) {
        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end("No se pudo actualizar Archivo General");
            return;
        }

        DESPLEGABLETABLERO = crearDesplegable(generalData.Tableros);
        TABLEROSELECCIONADO = NuevoTableroNombre;
        res.writeHead(200);
        res.end("Tarea cargada");
        console.log("Nueva tablero: " + NuevoTableroNombre);
    });
});

//cambia la seleccion del tablero 
router.post('/seleccion', function (req, res) {

    let TableroSeleccionado = req.query.tablero; //pasar el parametro como ?tablero=   
    TableroSeleccionado = TableroSeleccionado.toUpperCase();
    console.log("Cambiando al tablero: " + TableroSeleccionado)

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

    for (let i = 0; i < generalData.Tableros.length; i++) {
        let tablero = generalData.Tableros[i]

        if (tablero.Nombre === TableroSeleccionado) {

            TABLEROSELECCIONADO = TableroSeleccionado;
            DESPLEGABLETABLERO = crearDesplegable(generalData.Tableros);

            res.writeHead(200);
            res.end("Tablero cambiado");
            console.log("Cambio Listo")
            return
        }
    }

    console.log("Tablero no existe");
    res.setHeader("Content-Type", "text/html");
    res.writeHead(503);
    res.end("Tablero no existe");

});

module.exports = router;

//elimina puntuacion
function eliminarDiacriticosEs(texto) {
    texto = texto.replace("ñ", "ni")
    return texto
        .normalize('NFD')
        .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1")
        .normalize();
}

function crearDesplegable(Tableros) {

    let desplegable = "<select id='TableroSeleccionado'>"

    for (let i = 0; i < Tableros.length; i++) {
        let tablero = Tableros[i]

        desplegable += "<option value='" + tablero.Nombre + "'"
        if (tablero.Nombre === TABLEROSELECCIONADO) desplegable += " selected";
        desplegable += ">" + tablero.Nombre + "</option>"

    }
    desplegable += "</select>"

    return desplegable;
}