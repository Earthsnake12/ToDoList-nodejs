const express = require('express');
const fs = require("fs");
//import { parse } from 'node-html-parser';

const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) { //pagina de inicio

  const data =  require("./pruebaPagIndex.js");

  console.log(data);
  //hhh


  res.end(data);
  /*
  readFile("./inicio/index.html", (err, data) => {

    if (err) {
      res.writeHead(404);
      res.write('Whoops! File not found!');
      res.end();

    } else {
      let root = parse(data);

      try {
        let tabla = require("./inicio/geradorTabla.js");
        root.querySelector('#pp').replaceWith(tabla);
      } catch (error) { }

      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(root.toString());
    }
  });*/
})

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
