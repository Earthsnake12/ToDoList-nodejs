const express = require('express');
const router = express.Router();

//maneja la subida de archivos
router.post('/',(req,res) => {
    
    const id = parseInt(req.query.id, 10); //pasar el parametro como /upload?id=1
    let EDFile = req.files.file
    
    EDFile.mv("./data/files/" + id + "/" + EDFile.name, err => {
        if (err) {
            console.log(err);
            res.writeHead(503);
            res.end("No se pudo guardar el archivo");
            return;
        }

        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end("Archivo guardado");
    });
})


module.exports = router;