//Genera la estructura basica de carpetas y archivos
const fs = require("fs");

fs.mkdir("./data", (err) => {

    if (err) {
        console.log("No se pudo crear la carpeta para los archivos");
        return;
    }

    let diario = {
        "fecha": [],
        "descripcion": [],
        "ids": [],
        "tablero": [],
        "estado": []
    };

    fs.writeFile("./data/Diario.json", JSON.stringify(diario), function (err, result) {

        if (err) {
            console.log("No se pudo Crear diario.json");
            return;
        }
    });

    let general = {};

    fs.writeFile("./data/General.json", JSON.stringify(general), function (err, result) {

        if (err) {
            console.log("No se pudo Crear general.json");
            return;
        }
    });
    console.log("Carpetas y archivos creados");
});