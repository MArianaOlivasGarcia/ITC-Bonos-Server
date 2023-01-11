const { response } = require('express');
const Alumno = require('../models/alumno.model');
const Value = require('../models/value.model')
const Counter = require('../models/counter.model')
const moment = require('moment-timezone');
const fs = require('fs')
const path = require('path')


moment.locale('es-mx');
moment.tz('America/Cancun');


const create = async(req, res = response) => {

    try {

        const alumnodb = await Alumno.findById(req.uid);

        if (alumnodb.enviado) {
            return res.status(400).json({
                status: false,
                message: 'Ya has enviado tu solicitud.'
            })
        }

        const { nombre, paterno, materno, control, promedio, correo, semestre_proximo, sexo, fecha_nacimiento, carrera, curp, ...obj } = req.body;

        const info = {
            ...obj,
            enviado: true,
            fecha_envio: moment().format('YYYY-MM-DD') 
        }

        const alumnoUpdate = await Alumno.findByIdAndUpdate(req.uid, info, { new: true })
        


        /* Calificar */
        const { values } = await Value.findOne({ form: 'SBI' })

    
        var puntos = values['discapacidad'][alumnoUpdate['discapacidad'].toLowerCase()]
        + values['origen_indigena'][alumnoUpdate['origen_indigena']]
        + values['socioeconomicos']['trabaja'][alumnoUpdate['socioeconomicos']['trabaja']]
        + ( values['socioeconomicos']['perdio_trabajo'][alumnoUpdate['socioeconomicos']['perdio_trabajo']] == undefined ? 1: values['socioeconomicos']['perdio_trabajo'][alumnoUpdate['socioeconomicos']['perdio_trabajo']] )
        + ( values['socioeconomicos']['depende_economicamente'][alumnoUpdate['socioeconomicos']['depende_economicamente']] == undefined ? 1: values['socioeconomicos']['depende_economicamente'][alumnoUpdate['socioeconomicos']['depende_economicamente']] )
        + ( alumnoUpdate['tutor']['dependientes_economicos'] <= 2 ? 1 : 0 )
        + values['vivienda']['tenencia'][alumnoUpdate['vivienda']['tenencia'].toLowerCase()]
        + ( alumnoUpdate['vivienda']['tipo'] == null ? 0 : values['vivienda']['tipo'][alumnoUpdate['vivienda']['tipo'].toLowerCase()])
        + values['vivienda']['mobiliario']['television'][alumnoUpdate['vivienda']['mobiliario']['television']]
        + values['vivienda']['mobiliario']['estereo'][alumnoUpdate['vivienda']['mobiliario']['estereo']]
        + values['vivienda']['mobiliario']['video'][alumnoUpdate['vivienda']['mobiliario']['video']]
        + values['vivienda']['mobiliario']['dvd'][alumnoUpdate['vivienda']['mobiliario']['dvd']]
        + values['vivienda']['mobiliario']['estufa'][alumnoUpdate['vivienda']['mobiliario']['estufa']] 
        + values['vivienda']['mobiliario']['microondas'][alumnoUpdate['vivienda']['mobiliario']['microondas']]
        + values['vivienda']['mobiliario']['lavadora'][alumnoUpdate['vivienda']['mobiliario']['lavadora']]
        + values['vivienda']['mobiliario']['refri'][alumnoUpdate['vivienda']['mobiliario']['refri']]
        + values['vivienda']['mobiliario']['compu'][alumnoUpdate['vivienda']['mobiliario']['compu']]
        + values['vivienda']['habitaciones']['sala'][alumnoUpdate['vivienda']['habitaciones']['sala']]
        + values['vivienda']['habitaciones']['comedor'][alumnoUpdate['vivienda']['habitaciones']['comedor']]
        + values['vivienda']['habitaciones']['bano_privado'][alumnoUpdate['vivienda']['habitaciones']['bano_privado']]
        + values['vivienda']['habitaciones']['bano_compartido'][alumnoUpdate['vivienda']['habitaciones']['bano_compartido']]
        + ( alumnoUpdate['vivienda']['material']['paredes'] == null ? 0 : values['vivienda']['material']['paredes'][alumnoUpdate['vivienda']['material']['paredes'].toLowerCase()] )
        + ( alumnoUpdate['vivienda']['material']['techos'] == null ? 0 : values['vivienda']['material']['techos'][alumnoUpdate['vivienda']['material']['techos'].toLowerCase()] )
        + ( alumnoUpdate['vivienda']['material']['pisos'] == null ? 0 : values['vivienda']['material']['pisos'][alumnoUpdate['vivienda']['material']['pisos'].toLowerCase()] )
        + values['vivienda']['servicios']['agua_potable'][alumnoUpdate['vivienda']['servicios']['agua_potable']]
        + values['vivienda']['servicios']['luz_electrica'][alumnoUpdate['vivienda']['servicios']['luz_electrica']]
        + values['vivienda']['servicios']['drenaje'][alumnoUpdate['vivienda']['servicios']['drenaje']]
        + values['vivienda']['servicios']['pavimento'][alumnoUpdate['vivienda']['servicios']['pavimento']]
        + values['vivienda']['servicios']['transporte'][alumnoUpdate['vivienda']['servicios']['transporte']]
        + values['vivienda']['servicios']['linea_tel'][alumnoUpdate['vivienda']['servicios']['linea_tel']]
        + values['vivienda']['servicios']['internet'][alumnoUpdate['vivienda']['servicios']['internet']]
        + values['vivienda']['servicios']['tv_cable'][alumnoUpdate['vivienda']['servicios']['tv_cable']]
        + values['salud_fam']['imss'][alumnoUpdate['salud_fam']['imss']]
        + values['salud_fam']['issste'][alumnoUpdate['salud_fam']['issste']]
        + values['salud_fam']['centro_salud'][alumnoUpdate['salud_fam']['centro_salud']]
        + values['salud_fam']['dispensario'][alumnoUpdate['salud_fam']['dispensario']]
        + values['salud_fam']['medico_priv'][alumnoUpdate['salud_fam']['medico_priv']]

        
        /* CALIFICAR */
        alumnoUpdate.puntos = puntos;

        const foliodb = await Counter.findOne({periodo: 'AGO-DIC-2022'})
        
          
        // Generar folio
        alumnoUpdate.folio = `AGODIC22${ alumnoUpdate.nombre.charAt(0) }${ alumnoUpdate.paterno && alumnoUpdate.paterno.charAt(0) }${ alumnoUpdate.materno && alumnoUpdate.materno.charAt(0) }${ foliodb.currentValue.toString().padStart(4, "0") }` ;

        foliodb.currentValue = foliodb.currentValue + 1;

        await Promise.all([
            foliodb.save(),
            alumnoUpdate.save()
        ])
        /* Fin calificar */

        res.status(200).json({
            status: true,
            user: alumnoUpdate
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }
}
/* OBTENER ALUMNO POR ID cuando es enviado:true*/

/* TODO: Obtener por rango de puntuaje */

const getAll = async (req, res = response) => {
    

    try {

        const desde = Number(req.query.desde) || 0;
        const [alumnos, total] = await Promise.all([
            Alumno.find({ enviado: true }, 'control nombre paterno materno carrera promedio semestre_proximo sexo fecha_nacimiento curp correo fecha_envio puntos becado')
                .skip(desde)
                .limit(10)
                .sort({puntos: 1}),
            Alumno.countDocuments({enviado: true})
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

const getById = async (req, res = response) => {
    

    try {

        const id = req.params.id;
        const alumno = await Alumno.findById(id)

        if (!alumno) {
            return res.status(404).json({
                status: false,
                message: 'No existe un alumno con ese id'
            })
        }

        res.status(200).json({
            status: true,
            alumno
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }

}



const contar = async (req, res = response) => {
    

    try {

        const alumnos = await Alumno.find({enviado: true})
        .sort('control')

        alumnos.forEach( a =>{
            const carpetaPath = path.join( __dirname, '../uploads/', a.control )
            if (!fs.existsSync(carpetaPath)) {
                console.log(a.control)
            }
        })

        res.status(200).json({
            status: true,
            alumnos: alumnos.length
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
    create,
    getAll,
    getById,
    contar
}