const express = require('express');
const router = express.Router();
const fs = require("fs");
const HTMLparser = require('node-html-parser');



router.post('/upload',(req,res) => {
    let EDFile = req.files.file
    EDFile.mv(`./files/${EDFile.name}`,err => {
        if(err) return res.status(500).send({ message : err })

        return res.status(200).send({ message : 'File upload' })
    })
})


/*

npm i -S express express-fileupload
const express = require('express')
const fileUpload = require('express-fileupload')

const app = express()

app.use(fileUpload())

<form action='http://localhost:3000/upload' method="POST" enctype="multipart/form-data">
        <input type="file" name="file">
        <input type="submit" value="Subir">
</form>


*/