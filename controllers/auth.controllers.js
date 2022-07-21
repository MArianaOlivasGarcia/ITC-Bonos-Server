const { response } = require("express");
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt.helper")
const User = require('../models/user.model')
 
const register = async(req, res = response) => {

    
    const { username, password } = req.body;
    
    try {

        const doesExist = await User.findOne({ username })

        if (doesExist) {
            return res.status(400).json({
                status: false,
                message: `El Nombre de usuario ${username} ya ésta registrado.`
            })
        }

        const usuario = new User(req.body);
        // ** Encriptar contraseña **//
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        const savedUsuario = await usuario.save();
        //** Generar Token **/
        const token = await generarJWT(savedUsuario.id);


        res.status(201).json({
            status: true,
            message: `Usuario creado con éxito`,
            user: savedUsuario,
            accessToken: token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Hable con el administrador'
        })
    }

}



const login = async(req, res = response) => {

    const { username, password } = req.body;

    try {
    
        const usuario = await User.findOne({ username })


        if (!usuario) {
            return res.status(404).json({
                status: false,
                message: 'Nombre de usuario inválido.'
            })
        }


        const validarPassword = bcrypt.compareSync( password, usuario.password)


        if (!validarPassword) {
            return res.status(404).json({
                status: false,
                message: 'Contraseña inválida.'
            });
        }

        const token = await generarJWT(usuario.id);


        res.status(200).json({
            status: true,
            user: usuario,
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

    let user = await User.findById(uid)
                        .populate('gestion');


    res.json({
        status: true,
        user,
        accessToken
    })
}




module.exports = {
    renovarJWT,
    register,
    login
}