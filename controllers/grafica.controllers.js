const { response } = require('express');
const Alumno = require('../models/alumno.model');


const getSexo = async (req, res = response) => {
    

    try {

        const [hombres, mujeres, total] = await Promise.all([
            Alumno.countDocuments({sexo: 'FEMENINO'}),
            Alumno.countDocuments({sexo: 'MASCULINO'}),
            Alumno.countDocuments({}),
        ]);

        res.status(200).json({
            status: true,
            hombres,
            mujeres,
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
    getSexo
}