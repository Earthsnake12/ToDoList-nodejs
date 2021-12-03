const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();

app.use(express.static(__dirname + '/public')); //archivos css y script para las paginas
app.use(express.static(__dirname + '/data/files')); //acceder a los archivos de las tareas
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

//pagina inicio
app.get('/', function (req, res) {

    console.log("Pagina de Inicio");
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end("<a href='/listatarea'>Listado de tareas</a>");
});

//revisa los pendientes y finalizados y crea la tabla.
app.use("/listaTarea",require("./rutas/listaTarea.js"))

//manejo de las tareas
app.use("/tarea",require("./rutas/tarea.js"))

//subida de archivos
app.use("/upload",require("./rutas/upload.js"))

//manejo del listado diario
app.use("/listadoDiario",require("./rutas/listadoDiario.js"))

app.listen(8000)

console.log('Servidor en la url http://127.0.0.1:8000/');
