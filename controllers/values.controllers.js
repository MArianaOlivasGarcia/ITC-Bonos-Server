const { response } = require("express");
const Value = require('../models/value.model');

const actualizarValues = async(req, res = response) => {

    try {

        const value = await Value.findOne({form:'SBI'})

        res.status(200).json({
            status: true,
            value
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }
    
}




module.exports = {
    actualizarValues
}