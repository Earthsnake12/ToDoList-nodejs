const express = require('express');
const fs = require("fs");
const bodyParser = require('body-parser');

const middlewares = require('./servicios/middleware'); //carga los middleware

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', middlewares.paginaInicio);

app.post('/tarea', middlewares.cargarTarea);

app.get('/tarea/:id',middlewares.mostrarTarea);

app.listen(8000)

console.log('Servidor en la url http://127.0.0.1:8000/');
