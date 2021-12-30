const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require("fs");

const app = express();

app.use("/static", express.static(__dirname + '/public')); //archivos css y script para las paginas
app.use(express.static(__dirname + '/data')); //acceder a los archivos de las tareas
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

global.TABLEROSELECCIONADO = primerTablero();
global.DESPLEGABLETABLERO = crearDesplegable();

//pagina inicio.
app.get('/', function (req, res) {

    console.log("Pagina de Inicio");
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end("<a href='/listatarea'>Listado de tareas</a>");
});

//revisa los pendientes y finalizados y crea la tabla.
app.use("/listaTarea", require("./rutas/listaTarea.js"))

//manejo de las tareas
app.use("/tarea", require("./rutas/tarea.js"))

//subida de archivos
app.use("/upload", require("./rutas/upload.js"))

//manejo del listado diario
app.use("/listadoDiario", require("./rutas/listadoDiario.js"))

//manejo de los tableros.
app.use("/tableros", require("./rutas/tableros.js"))

app.listen(8000)

console.log('Servidor en la url http://127.0.0.1:8000/');


function crearDesplegable() {

    try {
        let data = fs.readFileSync("./data/General.json", 'utf8')
        var tableros = JSON.parse(data);

    } catch (err) {
        return "<p>No se pudo cargar desplegable</p>";
    }

    let desplegable = "<select id='TableroSeleccionado'>"

    for (let tablero in tableros) {

        desplegable += "<option value='" + tablero.toString().slice(0, -2) + "'"
        if (tablero.toString().slice(0, -2) === TABLEROSELECCIONADO) desplegable += " selected";
        desplegable += ">" + tablero.toString().slice(0, -2) + "</option>"

    }
    desplegable += "</select>"

    return desplegable;
}

function primerTablero() {

    try {
        let data = fs.readFileSync("./data/General.json", 'utf8')
        var tableros = JSON.parse(data);

    } catch (err) {
        console.log("No se pudo cargar tableros")
        return
    }

    if (Object.keys(tableros).length === 0) return "";
    else {
        var tt = Object.keys(tableros)[0];
        return tt.slice(0, -2)
    }
}