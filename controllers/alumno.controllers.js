const { response } = require("express");
const { generarJWT } = require("../helpers/jwt.helper")
const Alumno = require('../models/alumno.model')
const Recepcion = require('../models/recepcion.model')
const moment = require('moment-timezone');

moment.locale('es-mx');
moment.tz('America/Cancun');

//moment().format('DD/MM/YYYY') 


const login = async(req, res = response) => {

    const { control, password } = req.body;

    try {
    
        const recepcion = await Recepcion.findOne({ semestre: "AGO-DIC-22" })

        if ( !recepcion ) {
            return res.status(404).json({
                status: false,
                message: 'Todavia no existe ese periodo.'
            })
        }

        const hoy = new Date(moment().format("YYYY-MM-DD")).getTime()
        const fecha_inicio = new Date(moment(recepcion.fecha_inicio).format("YYYY-MM-DD")).getTime()
        const fecha_termino = new Date(moment(recepcion.fecha_termino).format("YYYY-MM-DD")).getTime()
    
        if (hoy < fecha_inicio) {
            return res.status(404).json({
                status: false,
                message: `Aun no es fecha de recepción de Solicitudes de Bono de Reinscripción para el periodo ${recepcion.semestre}.`
            })
        } else if (hoy > fecha_termino) {
            return res.status(404).json({
                status: false,
                message: `La fecha de recepción de Solicitudes de Bono de Reinscripción para el periodo ${recepcion.semestre} ya venció.`
            })
        } 
        
        
        
        const usuario = await Alumno.findOne({ control })

        if (!usuario) {
            return res.status(404).json({
                status: false,
                message: `El alumno con el No. de Control ${control} no cumple con los requisitos de la convocatoria.`
            })
        }
        
        if ( password != usuario.password ) {
            return res.status(404).json({
                status: false,
                message: 'Contraseña inválida.'
            });
        }

        const token = await generarJWT(usuario.id);


        res.status(200).json({
            status: true,
            usuario,
            accessToken: token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }
    
}


const renovarJWT = async(req, res = response) => {

    const uid = req.uid

    const accessToken = await generarJWT(uid)

    let user = await Alumno.findById(uid);


    res.json({
        status: true,
        user,
        accessToken
    })
}



/* TODO: CAMBIAR EN FUTURA VERSION*/

/* Obtener TODOS los alumnos que cumplen requisitos */
const getAll = async (req, res = response) => {
    
    try {

        const desde = Number(req.query.desde) || 0;
        const [alumnos, total] = await Promise.all([
            Alumno.find({}, 'control nombre paterno materno carrera promedio semestre_proximo sexo fecha_nacimiento curp correo enviado')
                .skip(desde)
                .limit(10),
            Alumno.countDocuments({})
        ]);

        res.status(200).json({
            status: true,
            alumnos,
            total
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }



}


/* Obtener TODOS los que fueron aprobados */
const getAllAprobados = async (req, res = response) => {
    
    try {

        const desde = Number(req.query.desde) || 0;
        const [alumnos, total] = await Promise.all([
            Alumno.find({bono_aprobado: true}, 'control nombre paterno materno carrera promedio semestre_proximo sexo fecha_nacimiento curp correo')
                .skip(desde)
                .limit(10),
            Alumno.countDocuments({bono_aprobado: true})
        ]);

        res.status(200).json({
            status: true,
            alumnos,
            total
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }



}

/* Obtener TODOS los que NO fueron aprobados */
const getAllNoAprobados = async (req, res = response) => {
    
    try {

        const desde = Number(req.query.desde) || 0;
        const [alumnos, total] = await Promise.all([
            Alumno.find({bono_aprobado: false}, 'control nombre paterno materno carrera promedio semestre_proximo sexo fecha_nacimiento curp correo')
                .skip(desde)
                .limit(10),
            Alumno.countDocuments({bono_aprobado: false})
        ]);

        res.status(200).json({
            status: true,
            alumnos,
            total
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }



}

module.exports = {
    renovarJWT,
    login,
    getAll,
    getAllAprobados,
    getAllNoAprobados
}