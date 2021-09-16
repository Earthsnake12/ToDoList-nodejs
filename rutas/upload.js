const express = require('express');
const router = express.Router();
const path = require('path');
const fetch = require('node-fetch');

//maneja la subida de archivos
router.post('/', (req, res) => {

    const id = parseInt(req.query.id, 10); //pasa el parametro como /upload?id=1 
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

        fetch("http://127.0.0.1:8000/tarea?id=" + id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                objetivo: "files",
                valor: ubicacion
            })

        }).then(response => {
            
            if (response.ok) {
                console.log("Archivo guardado en: " + ubicacion)
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end("Archivo guardado");
            }else{
                console.log("No se pudo actualizar Archivo General Pero Archivo guardado en: " + ubicacion)
                res.writeHead(503);
                res.end("No se pudo actualizar Archivo General Pero se guardo el archivo");
                return;
            }

        }).catch(err => {
            console.log(err);
            res.writeHead(503);
            res.end("No se pudo actualizar Archivo General Pero se guardo el archivo");
            return;
        });
    });
})

module.exports = router;