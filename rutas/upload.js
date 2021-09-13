const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require("fs");

//maneja la subida de archivos
router.post('/', (req, res) => {

    const id = parseInt(req.query.id, 10); //pasar el parametro como /upload?id=1 
    const EDFile = req.files.file

    let date = new Date();
    let fechaHora = date.getFullYear() + "-" + (1 + date.getMonth()) + "-" + date.getDate()
        + "---" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();

    let ubicacion = "./data/files/" + id + "/" + fechaHora + path.extname(EDFile.name); //donde se guardara el archivo

    EDFile.mv(ubicacion, err => {
        if (err) {
            console.log(err);
            res.writeHead(503);
            res.end("No se pudo guardar el archivo");
            return;
        }
/* 
        let fetch = require('node-fetch');

fetch('http://localhost', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: '{}'
}).then(response => {
  return response.json();
}).catch(err => {console.log(err);}); */
/*
        fs.readFile("./data/General.json", 'utf8', (err, general) => {

            if (err) {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(503);
                res.end("No se pudo cargar la base de datos");
                return;

            }
            let archivoGeneral = JSON.parse(general);

            //obtengo el indice de la tarea en el general
            const tareaIndice = archivoGeneral.Pendientes.map(pendiente => pendiente.id).indexOf(id);
            archivoGeneral.Pendientes[tareaIndice].files.push(ubicacion);


            //actualizo el archivo general
            fs.writeFile("./data/General.json", JSON.stringify(archivoGeneral), function (err, result) {

                if (err) {
                    console.log(err);
                    res.writeHead(503);
                    res.end("No se pudo actualizar Archivo General");
                    return;
                }*/

                console.log("Archivo guardado en: " + ubicacion)
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end("Archivo guardado");
           // });
        //});
    });
})

module.exports = router;