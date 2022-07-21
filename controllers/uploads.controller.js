  
const { response } = require("express");
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Alumno = require("../models/alumno.model");


const fileUpload = async (req, res = response) => {
    
    const id = req.uid;

    const alumno = await Alumno.findById(id);

    if( !req.files || Object.keys(req.files).length === 0 ){
        return res.status(400).json({
            status: false,
            message: 'No hay ningún archivo 1nakshd'
        }) 
    }

    if( !req.files.archivo ){
        return res.status(400).json({
            status: false,
            message: 'No hay ningún archivo'
        }) 
    }

    const { archivo } = req.files;

    const nombreCortado = archivo.name.split('.'); //nombre.archivo.jpg
    const extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];

    const extensionesValidas = ['pdf', 'jpg', 'png', 'jpeg'];
    if( !extensionesValidas.includes( extensionArchivo.toLowerCase() ) ){
        return res.status(400).json({
            status: true,
            message: 'No es una extensión permitida'
        }) 
    }


    /* CREAR CARPETA DEL ALUMNO */
    const carpetaPath = path.join( __dirname, '../uploads/', id )
    if (!fs.existsSync(carpetaPath)) {
        fs. mkdirSync(carpetaPath)
    }

    const nombreArchivo = `${alumno.control}.${extensionArchivo}`;
    
    const uploadPath = path.join( carpetaPath, nombreArchivo )

    archivo.mv(uploadPath, (err) => {
     
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Hable con el Administrador. Error al mover archivo'
            })
        }

        res.status(200).json({
            status: true,
            message: 'Archivo enviado con éxito.'
        })

    })


}


var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        console.log('Aqui paso');

      cb(null, path.join( __dirname, '../uploads/'))
    },
    filename: function (req, file, cb) {
      cb(null, 'hola' + '-' + Date.now())
    }
  })
   
var upload = multer({ storage: storage }).array('archivos')


const filesUpload = async (req, res = response) => {

    const id = req.uid;

    const alumno = await Alumno.findById(id);

    if( !req.files || Object.keys(req.files).length === 0 ){
        return res.status(400).json({
            status: false,
            message: 'No hay ningún archivo'
        }) 
    }
    const { archivos } = req.files;

    if( !archivos ){
        return res.status(400).json({
            status: false,
            message: 'No hay ningún archivo'
        }) 
    }


    if( archivos.length != 4 ){
        return res.status(400).json({
            status: false,
            message: 'Debe ser 4 archivos'
        }) 
    }

    const extensionesValidas = ['pdf', 'jpg', 'png', 'jpeg'];

    const carpetaPath = path.join( __dirname, '../uploads/', alumno.control )
    if (!fs.existsSync(carpetaPath)) {
        fs. mkdirSync(carpetaPath)
    }

    for (var i = 0; archivos.length > i; i++){
        var nombreCortado = archivos[i].name.split('.'); //nombre.archivo.jpg
        var extensionArchivo = nombreCortado[nombreCortado.length - 1];
        if (!extensionesValidas.includes( extensionArchivo.toLowerCase()) ) {
            return res.status(400).json({
                status: false,
                message: 'La extension de uno o más archivos es inválida.'
            });
        }
        var nombreArchivo = `${alumno.control}-${i+1}.${extensionArchivo}`;
        var uploadPath = path.join( carpetaPath, nombreArchivo )
        archivos[i].mv(uploadPath, (err) => {
            if (err) {
                return res.stauts(500).json({
                    status: false,
                    message: 'Hable con el Administrador.'
                })
            }
        })
    }

    alumno.envio_archivos = true;
    await alumno.save();

    res.status(200).json({
        status: true,
        message: 'Archivos enviados con éxito.'
        
    })


}



module.exports = {
    fileUpload,
    filesUpload,
    upload
}