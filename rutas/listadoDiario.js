const express = require("express");
const router = express.Router();
const fs = require("fs");
const HTMLparser = require("node-html-parser");

//revisa los pendientes para hoy y crea la tabla.
router.get("/", function(req, res) {
	let fecha = req.query.fecha; //pasar el parametro como ?fecha=1
	console.log("Cargar listado del dia de " + fecha);

	try {
		let pagina = fs.readFileSync("./paginasHTML/listadoDiario.html");
		var root = HTMLparser.parse(pagina); //Pagina base
	} catch (err) {
		res.writeHead(404);
		res.write("No se pudo cargar la pagina");
		res.end();
		return;
	}

	try {
		const data = fs.readFileSync("./data/Diario.json", "utf8");
		const tareas = JSON.parse(data);

		if (fecha === "hoy") {
			const date = new Date();
			fecha = date.getDate() + "-" + (1 + date.getMonth()) + "-" + date.getFullYear();
		}
		var tabla = generarTabla(tareas, fecha);
	} catch (err) {
		var tabla = "<h1>No se pudo cargar la tabla</h1>";
		var fechas = "<div></div>";
	}

	root.querySelector("#lista").replaceWith(tabla); //cargo la tabla en la pag
	root.querySelector("#fecha").replaceWith("<span id='fecha'>" + fecha + "</span>"); //cargo la fecha de la tabla en la pag

	res.setHeader("Content-Type", "text/html");
	res.writeHead(200);
	res.end(root.toString());
});

//Crea nuevo registro de fecha
router.post("/", function(req, res) {
	let fecha = req.query.fecha; //pasar el parametro como ?fecha=1
	console.log("Nuevo registro para el dia " + fecha);

	try {
		let data = fs.readFileSync("./data/Diario.json", "utf8");
		var tareas = JSON.parse(data);
	} catch (err) {
		res.setHeader("Content-Type", "text/html");
		res.writeHead(503);
		res.end("No se pudo cargar la base de datos");
		return;
	}

	const indice = tareas.fecha.indexOf(fecha);

	if (indice === -1) {
		tareas.fecha.unshift(fecha);
		tareas.descripcion.unshift([]);
		tareas.ids.unshift([]);
		tareas.tablero.unshift([]);
		tareas.estado.unshift([]);
	} else {
		console.log("El registro para esa fecha ya existe");

		res.setHeader("Content-Type", "text/html");
		res.writeHead(503);
		res.end("Ya existe esa fecha");
		return;
	}

	try {
		fs.writeFileSync("./data/Diario.json", JSON.stringify(tareas));
	} catch (err) {
		console.log("Error al guardar el registro");

		res.setHeader("Content-Type", "text/html");
		res.writeHead(503);
		res.end("Error al guardar el registro");
		return;
	}

	res.setHeader("Content-Type", "text/html");
	res.writeHead(200);
	res.end();
});

//revisa los pendientes y elimina ya pasaron hace mas de 15 dias
router.delete("/", function(req, res) {
	console.log("Eliminando tareas terminadas");

	try {
		let data = fs.readFileSync("./data/Diario.json", "utf8");
		var tareas = JSON.parse(data);
	} catch (err) {
		res.writeHead(404);
		res.write("No se pudo cargar el listado diario");
		res.end();
		return;
	}

	for (let j = 0; j < tareas.fecha.length; j++) {
	
		for (let i = 0; i < tareas.descripcion[j].length; i++) {
			if (tareas.estado[j][i] === "Terminada") {
				tareas.descripcion[j].splice(i, 1);
				tareas.ids[j].splice(i, 1);
				tareas.tablero[j].splice(i, 1);
				tareas.estado[j].splice(i, 1);

				i--;
			}
		}
		if (tareas.descripcion[j].length === 0) {
			tareas.fecha.splice(j, 1);
			tareas.descripcion.splice(j, 1);
			tareas.ids.splice(j, 1);
			tareas.tablero.splice(j, 1);
			tareas.estado.splice(j, 1);
			j--;
		}
	}

	try {
		fs.writeFileSync("./data/Diario.json", JSON.stringify(tareas));
	} catch (err) {
		console.log(err);
		res.writeHead(503);
		res.end("No se pudo actualizar listado diario");
		return;
	}

	console.log("Se eliminaron los registros terminados");
	res.writeHead(200);
	res.end();
});

//agrega nuevas tareas (en array) a la fecha pasada
router.post("/tarea", function(req, res) {
	let fecha = req.query.fecha; //pasar el parametro como ?fecha=1
	console.log("Nueva tarea para el dia de " + fecha);

	try {
		let data = fs.readFileSync("./data/Diario.json", "utf8");
		var tareas = JSON.parse(data);
	} catch (err) {
		res.setHeader("Content-Type", "text/html");
		res.writeHead(503);
		res.end("No se pudo cargar la base de datos");
		return;
	}

	const indice = tareas.fecha.indexOf(fecha);

	if (indice === -1) {
		console.log("Error en la fecha pasada");

		res.setHeader("Content-Type", "text/html");
		res.writeHead(503);
		res.end("Error en la fecha pasada");
		return;
	}

	for (let i = 0; i < req.body.descripcion.length; i++) {
		tareas.descripcion[indice].push(eliminarDiacriticosEs(req.body.descripcion[i]));
		tareas.ids[indice].push(req.body.ids[i]);
		tareas.tablero[indice].push(req.body.tablero[i]);
		tareas.estado[indice].push(req.body.estado[i]);
	}

	try {
		fs.writeFileSync("./data/Diario.json", JSON.stringify(tareas));
	} catch (err) {
		console.log("Error al guardar el registro");

		res.setHeader("Content-Type", "text/html");
		res.writeHead(503);
		res.end("Error al guardar el registro");
		return;
	}

	res.setHeader("Content-Type", "text/html");
	res.writeHead(200);
	res.end();
});

//cambia a terminada una tarea de la fecha pasada
router.patch("/tarea", function(req, res) {
	let fecha = req.query.fecha; //pasar el parametro como ?fecha=1
	console.log("Actualizando tareas de " + fecha);

	try {
		let data = fs.readFileSync("./data/Diario.json", "utf8");
		var tareas = JSON.parse(data);
	} catch (err) {
		res.setHeader("Content-Type", "text/html");
		res.writeHead(503);
		res.end("No se pudo cargar la base de datos");
		return;
	}

	const indice = tareas.fecha.indexOf(fecha);

	if (indice === -1) {
		console.log("Error en la fecha pasada");

		res.setHeader("Content-Type", "text/html");
		res.writeHead(503);
		res.end("Error en la fecha pasada");
		return;
	}

	let tareaId = req.body.tareaId; //id de la tareas
	tareas.estado[indice][tareaId] = "Terminada";

	try {
		fs.writeFileSync("./data/Diario.json", JSON.stringify(tareas));
	} catch (err) {
		console.log("Error al guardar el registro");

		res.setHeader("Content-Type", "text/html");
		res.writeHead(503);
		res.end("Error al guardar el registro");
		return;
	}

	console.log("Se actualizo la tarea " + tareaId);

	res.setHeader("Content-Type", "text/html");
	res.writeHead(200);
	res.end();
});

//devuelvo json con las tareas segun la fecha pasada
router.get("/tarea", function(req, res) {
	let fecha = req.query.fecha; //pasar el parametro como ?fecha=1
	let terminados = req.query.terminados === "true"; //pasar el parametro como ?terminados=false si no quiero los terminados

	console.log("obtengo registro de tareas de " + fecha + (terminados ? " con " : " sin ") + "termiandos");

	try {
		let data = fs.readFileSync("./data/Diario.json", "utf8");
		var tareas = JSON.parse(data);
	} catch (err) {
		res.setHeader("Content-Type", "text/html");
		res.writeHead(503);
		res.end("No se pudo cargar la base de datos");
		return;
	}

	const indice = tareas.fecha.indexOf(fecha);

	if (indice === -1) {
		console.log("Error en la fecha pasada");

		res.setHeader("Content-Type", "text/html");
		res.writeHead(503);
		res.end("Error en la fecha pasada");
		return;
	}

	let lista = {
		descripcion: [],
		ids: [],
		tablero: [],
		estado: []
	};

	for (let i = 0; i < tareas.descripcion[indice].length; i++) {
		if (!terminados && tareas.estado[indice][i] === "Terminada") continue;

		lista.descripcion.push(tareas.descripcion[indice][i]);
		lista.ids.push(tareas.ids[indice][i]);
		lista.tablero.push(tareas.tablero[indice][i]);
		lista.estado.push(tareas.estado[indice][i]);
	}

	res.writeHead(200);
	res.end(JSON.stringify(lista));
});

module.exports = router;

//maneja la generacion de tabla
function generarTabla(tareas, fecha) {
	fecha = fecha.split("-");
	fecha = new Date(fecha[2], fecha[1] - 1, fecha[0]);

	var tabla = '<table id="lista" class="tablesorter"><thead>';
	tabla += '<th style="width: 80px;">FECHA</th>';
	tabla += '<th style="width: 90px;">ESTADO</th>';
	tabla += '<th style="width: 0px;">*</th>';
	tabla += '<th style="width: 70px;">VER TAREA</th>';
	tabla += "<th>DESCRIPCION</th>";
	tabla += "</thead><tbody>";

	for (let j = 0; j < tareas.fecha.length; j++) {
		fechaSeparada = tareas.fecha[j].split("-");
		ttt = new Date(fechaSeparada[2], fechaSeparada[1] - 1, fechaSeparada[0]);

		if (ttt <= fecha) {
			let descripcion = tareas.descripcion[j];
			let ids = tareas.ids[j];
			let tablero = tareas.tablero[j];
			let estado = tareas.estado[j];

			for (let i = 0; i < descripcion.length; i++) {
				if ((fecha - ttt) / (1000 * 3600 * 24) >= 15) tabla += "<tr style='color: red;'>";
				else tabla += "<tr style='color: #3D3D3D;'>";

				tabla += "<td style='color: inherit;'>" + fechaSeparada[2] + "-" + fechaSeparada[1] + "-" + fechaSeparada[0] + "</td>";
				tabla += "<td style='color: inherit;'>" + estado[i] + "</td>";

				if (estado[i] === "Pendiente") tabla += "<td><button type='Button' onClick='marcarTareaTerminada(" + i + ',"' + tareas.fecha[j] + "\")'>Ok!</button></td>";
				else tabla += "<td>.</td>";

				if (ids[i] === "-") tabla += "<td>-</td>";
				else tabla += "<td><a href='/tarea?id=" + ids[i] + "&tablero=" + tablero[i] + "'>" + ids[i] + "</a></td>";

				tabla += "<td style='color: inherit;'>" + descripcion[i] + "</td>";
				tabla += "</tr>";
			}
		}
	}

	tabla += "</tbody></table>";
	return tabla;
}

//elimina puntuacion
function eliminarDiacriticosEs(texto) {
	return texto.normalize("NFD").replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1").normalize();
}
