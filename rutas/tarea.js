const { Console } = require('console');
const express = require('express');
const router = express.Router();
const fs = require("fs");
const HTMLparser = require('node-html-parser');


//Crea una nueva tarea pendiente en el general 
router.post('/', function (req, res) {

    //cargo JSON general
    fs.readFile("./data/General.json", 'utf8', (err, data) => {

        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end("Archivo general no encontrado");
            return;
        }
        let generalData = JSON.parse(data);
        req.body.id = ++generalData.UltimoId; //coloco id actualizado

        //elimino acentos en titulo, descripcion y estado
        req.body.titulo = eliminarDiacriticosEs(req.body.titulo);
        req.body.descripcion = eliminarDiacriticosEs(req.body.descripcion);
        req.body.estado = eliminarDiacriticosEs(req.body.estado);

        //paso la importancia y prioridad como un booleano
        req.body.importante = (req.body.importante === "false") ? false : true;
        req.body.prioritario = (req.body.prioritario === "false") ? false : true;

        // registro fecha
        let date = new Date();
        req.body.fecha = [date.getDate() + "-" + (1 + date.getMonth()) + "-" + date.getFullYear()];

        // registro avance
        req.body.avance = ["Tarea registrada"];

        // Agrego campo para registrar los archivos
        req.body.files = []

        //lo guardo dentro del general
        generalData.Pendientes.push(req.body);

        //creo la carpeta para guardar los archivos
        fs.mkdir("./data/files/" + req.body.id, (err) => {
            if (err) {
                console.log(err);
                res.writeHead(500);
                res.end("No se pudo crear la carpeta para los archivos");
                return;
            }
            console.log("Carpeta creada");
        });

        //guardo JSON actualizado
        fs.writeFile("./data/General.json", JSON.stringify(generalData), function (err, result) {
            if (err) {
                console.log(err);
                res.writeHead(500);
                res.end("No se pudo actualizar Archivo General");
                return;
            }
        });

        //actualizo la tabla

        res.writeHead(200);
        res.end("Tarea cargada");

        console.log("Nueva tarea: " + JSON.stringify(req.body));
    });
});

//busca el id pasado y muestra el detalle de la tarea
router.get('/', function (req, res) {

    var id = parseInt(req.query.id, 10); //pasar el parametro como ?id=1
    console.log("Ver tarea " + id);

    try {

        let data = fs.readFileSync("./paginasHTML/tarea.html");
        var root = HTMLparser.parse(data); //Parse la pagina
    } catch (err) {

        res.writeHead(404);
        res.write('No se pudo cargar la pagina');
        res.end();
        return;
    }

    let tarea;
    try {

        let general = fs.readFileSync("./data/General.json", 'utf8');
        let pendientes = JSON.parse(general).Pendientes;
        tarea = pendientes.find(p => p.id === id);

        if (tarea === undefined) {
            general = fs.readFileSync("./data/Finalizados.json", 'utf8');
            pendientes = JSON.parse(general).Tareas;
            tarea = pendientes.find(p => p.id === id);
        }

    } catch (err) {
        root = "<h1>No se pudo cargar registro</h1>";
    }

    if (tarea === undefined) {

        root = "<h3>No existe tarea</h3>";
        console.log("No existe tarea")
    } else {

        root.querySelector("#id").set_content(tarea.id.toString());
        root.querySelector("#titulo").set_content(tarea.titulo.toString());
        root.querySelector("#descripcion").set_content(tarea.descripcion.toString());
        root.querySelector("#estado").set_content(tarea.estado.toString());
        if (tarea.importante) root.querySelector("#importante").setAttribute("checked", "");
        if (tarea.prioritario) root.querySelector("#prioritario").setAttribute("checked", "");

        for (let i = 0; i < tarea.avance.length; i++) {
            let nuevoAvance = '<div id = "' + i + '">';
            nuevoAvance += '<span>' + tarea.fecha[i] + '</span>';
            nuevoAvance += '<span>&nbsp; - &nbsp;</span>';
            nuevoAvance += '<span>' + tarea.avance[i] + '</span>';
            nuevoAvance += '</div>'

            nuevoAvance = HTMLparser.parse(nuevoAvance);
            root.querySelector("#avances").appendChild(nuevoAvance);
        }

        for (let i = 0; i < tarea.files.length; i++) {
            let nuevoFile;
            if (tarea.files[i].slice(-3) === "msg") {

                nuevoFile = ' <p></p><a href="';
                nuevoFile += tarea.files[i].slice(13);//para eliminar el ./data/files/;
                nuevoFile += '.pdf" target="_blank">';
                nuevoFile += tarea.files[i].slice(15) + '</a>';

                nuevoFile += ' <spam>.-----------.</spam><a href="';
                nuevoFile += tarea.files[i].slice(13);//para eliminar el ./data/files/;
                nuevoFile += '" target="_blank">';
                nuevoFile += 'Descargar Mail</a>';
            } else {

                nuevoFile = ' <p></p><a href="';
                nuevoFile += tarea.files[i].slice(13);//para eliminar el ./data/files/;
                nuevoFile += '" target="_blank">';
                nuevoFile += tarea.files[i].slice(15) + '</a>';
            }
            nuevoFile = HTMLparser.parse(nuevoFile);
            root.querySelector("#files").appendChild(nuevoFile);
        }
    }

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(root.toString());
});

//Agrega avance con fecha de hoy o actualiza estado o descripcion o agrega ruta del archivo pasado del id pasado
router.patch('/', function (req, res) {

    const id = parseInt(req.query.id, 10); //pasar el parametro como ?id=1


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

        switch (req.body.objetivo) {

            //agrego nuevo avance
            case 'avance':
                console.log("Agregar Avance");
                let date = new Date();
                archivoGeneral.Pendientes[tareaIndice].fecha.push(date.getDate() + "-" + (1 + date.getMonth()) + "-" + date.getFullYear());
                archivoGeneral.Pendientes[tareaIndice].avance.push(eliminarDiacriticosEs(req.body.valor));
                break;

            //actualizo descripcion
            case 'descripcion':
                console.log("Actualizar Descripcion");
                archivoGeneral.Pendientes[tareaIndice].descripcion = eliminarDiacriticosEs(req.body.valor);
                break;

            //actualizo estado
            case 'estado':
                console.log("Actualizar Estado");
                archivoGeneral.Pendientes[tareaIndice].estado = eliminarDiacriticosEs(req.body.valor[0]);
                archivoGeneral.Pendientes[tareaIndice].importante = (req.body.valor[1] === 'true');
                archivoGeneral.Pendientes[tareaIndice].prioritario = (req.body.valor[2] === 'true');
                break;

            //actualizo files
            case 'files':
                console.log("Actualizar Files");
                archivoGeneral.Pendientes[tareaIndice].files.push(req.body.valor);
                break;

            default:
                console.log("Por aca no paso");
                console.log(req.body);
                break;
        }

        //actualizo el archivo general
        fs.writeFile("./data/General.json", JSON.stringify(archivoGeneral), function (err, result) {

            if (err) {
                console.log(err);
                res.writeHead(503);
                res.end("No se pudo actualizar Archivo General");
                return;
            }

            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end("Avance registrado");
        });
    });
});

//Mueve a finalizados
router.put('/finalizada', function (req, res) {

    const id = parseInt(req.query.id, 10); //pasar el parametro como ?id=1

    try {
        let general = fs.readFileSync("./data/General.json", 'utf8')
        var ArchivoPendientes = JSON.parse(general);
        console.log("Se cargo pendientes")

        let finalizados = fs.readFileSync("./data/Finalizados.json", 'utf8')
        var ArchivoFinalizados = JSON.parse(finalizados);
        console.log("Se cargo finalizados")

    } catch (err) {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(503);
        res.end("No se pudo cargar la base de datos");
        return;
    }

    //obtengo el indice de la tarea en el general
    const tareaIndice = ArchivoPendientes.Pendientes.map(pendiente => pendiente.id).indexOf(id);

    //Coloco como estado finalizado y muevo la tarea
    ArchivoPendientes.Pendientes[tareaIndice].estado = "Finalizado";
    ArchivoFinalizados.Tareas.push(ArchivoPendientes.Pendientes[tareaIndice]);
    ArchivoPendientes.Pendientes.splice(tareaIndice, 1);

    //actualizo finalizados
    try {
        fs.writeFileSync("./data/Finalizados.json", JSON.stringify(ArchivoFinalizados));

    } catch (err) {
        console.log(err);
        res.writeHead(503);
        res.end("No se pudo actualizar Finalizados");
        return;
    }

    //actualizo el archivo general
    try {
        fs.writeFileSync("./data/General.json", JSON.stringify(ArchivoPendientes));

    } catch (err) {
        console.log(err);
        res.writeHead(503);
        res.end("No se pudo actualizar Archivo General, pero se actualizo finalizados");
        return;
    }

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end("Finalizado registrado");
});

module.exports = router;

//elimina puntuacion
function eliminarDiacriticosEs(texto) {
    return texto
        .normalize('NFD')
        .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1")
        .normalize();
}