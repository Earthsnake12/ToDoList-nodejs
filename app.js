
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
      let tabla = require("./inicio/geradorTabla.js");
      root.querySelector('#pp').replaceWith(tabla);
      
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(root.toString());
    }
  });
})

app.use(express.static(__dirname + '/public'));
app.listen(8000)

console.log('Servidor en la url http://127.0.0.1:8000/');
