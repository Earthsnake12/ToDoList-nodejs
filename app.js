const express = require('express');
const fs = require("fs");
const middlewares = require('./servicios/middleware'); //carga los middleware

const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', middlewares.paginaInicio);

app.post('/tarea', function (req, res) {

  let id;
  try {
    id = require("./data/General.json").UltimoId + 1; //
  } catch (Error) {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(404);
    res.end("Archivo general no encontrado");
    next();
  }

  fs.writeFile("./data/pendientes/" + id + ".json", JSON.stringify(req.body), function (err, result) {
    if (err) console.log('error', err);
  });

  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.end("Nueva tarea cargada");
});

app.listen(8000)

console.log('Servidor en la url http://127.0.0.1:8000/');
