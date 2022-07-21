
const { response } = require("express");
const Alumno = require('../models/alumno.model')
const User = require('../models/user.model')



//
// BUSQUEDA POR COLECCIÓN
//
const buscar = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    let termino = req.params.termino
    let coleccion = req.params.coleccion
    let regExp = new RegExp(termino, 'i')

    let data = [];
    let total = 0;
    switch (coleccion) {
        

        case 'usuarios':
            [data, total] = await Promise.all([
                User.find({}, 'name username role')
                        .or([{ 'name': regExp }, { 'username': regExp }, { 'role': regExp }])
                        .skip(desde)
                    .limit(10),
                User.countDocuments({})
                    .or([{ 'name': regExp }, { 'username': regExp }, { 'role': regExp }])
            ])
            break;

        case 'solicitudes':
            [data, total] = await Promise.all([
                Alumno.find({enviado:true}, 'control nombre paterno materno carrera promedio semestre_proximo sexo fecha_nacimiento curp correo fecha_envio puntos becado')
                      .or([{ 'control': regExp }, { 'nombre': regExp }, { 'paterno': regExp }, { 'materno': regExp }, { 'carrera': regExp }])
                      .skip(desde)
                      .limit(10),
                Alumno.countDocuments({ enviado: true })
                .or([{ 'control': regExp }, { 'nombre': regExp }, { 'paterno': regExp }, { 'materno': regExp }, { 'carrera': regExp }])
            ])
            break;

        
        case 'alumnos':
            [data, total] = await Promise.all([
                Alumno.find({}, 'control nombre paterno materno carrera promedio semestre_proximo sexo fecha_nacimiento curp correo enviado')
                      .or([{ 'control': regExp }, { 'nombre': regExp }, { 'paterno': regExp }, { 'materno': regExp }, { 'carrera': regExp }])
                      .skip(desde)
                      .limit(10),
                Alumno.countDocuments({})
                .or([{ 'control': regExp }, { 'nombre': regExp }, { 'paterno': regExp }, { 'materno': regExp }, { 'carrera': regExp }])
            ])
            break;

        default:

            return res.status(400).json({
                ok: false,
                mensaje: 'Colección de busqueda invalido. Solo se permite: usuarios, o alumnos',
                error: {
                    message: 'Tipo de colección inválida'
                }
            })

    }

   
    res.status(200).json({
        status: true,
        [coleccion]: data,
        total
    })
    
}





module.exports = {
    buscar
}