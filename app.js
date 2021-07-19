
const express = require('express');
const fs = require("fs");
const HTMLParser = require('node-html-parser');

const app = express()

app.get('/', function (req, res) {
  fs.readFile("./inicio/index.html", (err, data) => {
    if (err) {
      res.writeHead(404);
      res.write('Whoops! File not found!');
      res.end();
    } else {
      let root = HTMLParser.parse(data);
      //root.querySelector('#pp').replaceWith('<div>casa</div>');

      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(root.toString());
    }
  });
})

app.listen(8000)
/*
var pendiente = require("./data.json");
console.log(pendiente.Pendientes[0].descripcion);
*/
console.log('Servidor en la url http://127.0.0.1:8000/');
