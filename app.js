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

//manejo de las notas.
app.use("/notas", require("./rutas/listaNotas.js"))


app.listen(8000)

console.log('Servidor en la url http://127.0.0.1:8000/');


function crearDesplegable() {

    try {
        let data = fs.readFileSync("./data/General.json", 'utf8')
        var general = JSON.parse(data);

    } catch (err) {
        return "<p>No se pudo cargar desplegable</p>";
    }

    let desplegable = "<select id='TableroSeleccionado'>"

    for (let i = 0; i < general.Tableros.length; i++) {
        let tablero = general.Tableros[i]
  
        desplegable += "<option value='" + tablero.Nombre + "'"
        if (tablero.Nombre === TABLEROSELECCIONADO) desplegable += " selected";
        desplegable += ">" + tablero.Nombre + "</option>"

    }
    desplegable += "</select>"

    return desplegable;
}

function primerTablero() {

    try {
        let data = fs.readFileSync("./data/General.json", 'utf8')
        var tableros = JSON.parse(data).Tableros;

    } catch (err) {
        console.log("No se pudo cargar tableros")
        return
    }

    if (tableros.length === 0) return "";
    else return tableros[0].Nombre;
}