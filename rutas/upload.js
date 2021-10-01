const express = require('express');
const router = express.Router();
const path = require('path');
const fetch = require('node-fetch');

const fs = require("fs");
const { default: MsgReader } = require("@freiraum/msgreader/lib/MsgReader");
const pdf = require("html-pdf");


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
        if (path.extname(EDFile.name) === ".msg") {
            console.log("Transformado archivo")
            convertToPDF(ubicacion).catch(error => {
                console.log("No se pudo transformar el archivo")
                console.log(error)
            });
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
            } else {
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

//Maneja la conversion de msg a PDF

function convertToPDF(msgFilePath) {
    console.log(`Convirtiendo ${msgFilePath}`);
    const buffer = fs.readFileSync(msgFilePath);
    const reader = new MsgReader(buffer);
    const msg = reader.getFileData();
    const from = msg.senderName;
    const to = msg.recipients.map(({ name }) => name);
    const date = "sin fecha";
    const subject = msg.subject;
    let body = msg.body
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `<p>${renderWithLinks(line)}</p>`)
        .join("\n");
    body = body.replace(/<p>De:/g, "<p>.</p><p>.</p><p>.</p><p>.</p><p>De:");
    body = body.replace(/(?:<p>Asunto:.*)(<\/p>)/g, "</p><p>.</p>");
    
    const html = renderHTML({ from, to, date, subject, body });
console.log(html)
    return new Promise((resolve, reject) => {
        pdf.create(html).toStream(function (err, stream) {
            if (err) {
                reject(err);
            } else {
                stream
                    .pipe(fs.createWriteStream(`${msgFilePath}.pdf`))
                    .on("finish", () => {
                        console.log(`Archivo transformado a PDF ==> ${msgFilePath}.pdf`);
                        resolve();
                    });
            }
        });
    });
}

function renderHTML({ from, to, date, subject, body }) {
    return `
          <style>
          .font-bold {
            font-weight: 900;
        }
        
        .text-xs {
            font-size: 12px;
        }
        
        .text-sm {
            font-size: 16px;
        }
        
        .text-md {
            font-size: 20px;
        }
        
        .text-gray {
            color: #777;
        }
        
        .bg-white {
            background-color: white;
        }
        
        .body {
            padding: 2%;
            font-family: Arial, Helvetica, sans-serif;
        }
        p {
            margin: 2px;
        }
          </style>
          <div class="bg-white body">
              <header>
                  <p class="font-bold"><a href="mailto:${from}">${from}</a></p>
                  <p class="text-xs text-gray">${date}</p>
                  <p class="text-xs text-gray">To: <a href="mailto:${to}">${to}</a></p>
                  <p class="text-xs font-bold">${subject}</p>
              </header>
              <hr />
              <main>
                  ${body}
              </main>
          </div>
      `;
}

function renderWithLinks(line) {
    return line.replace(new RegExp(`<(.+)>`, "g"), `<a href="$1">$1</a>`);
}

module.exports = router;