const express = require('express');
const router = express.Router();
const fs = require("fs");



router.get('/', function (req, res) {

    console.log("Kamban")
    try {
        var data = fs.readFileSync("./paginasHTML/kamban.html");
        //var root = HTMLparser.parse(data); //Parse la pagina
    } catch (err) {

        console.log(err)
        res.writeHead(404);
        res.write('No se pudo cargar la pagina');
        res.end();
        return;
    }

    
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(data.toString());
});


module.exports = router;

