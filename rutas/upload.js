const express = require('express');
const router = express.Router();

//maneja la subida de archivos
router.post('/',(req,res) => {
    
    let EDFile = req.files.file
    
    EDFile.mv(`./data/files/${EDFile.name}`,err => {
        if(err) return res.status(500).send({ message : err })

        return res.status(200).send({ message : 'File upload' })
    })
})


module.exports = router;