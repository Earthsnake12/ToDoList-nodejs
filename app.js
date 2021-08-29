const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

//pagina inicio
app.get('/', function (req, res) {

    console.log("Pagina de Inicio");
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end("Index");
});

//revisa los pendientes y crea la tabla.
app.use("/listaTarea",require("./rutas/listaTarea.js"))

//manejo de las tareas
app.use("/tarea",require("./rutas/tarea.js"))

app.listen(8000)

console.log('Servidor en la url http://127.0.0.1:8000/');
