const { response } = require("express");
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {

    const { email, name, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email });

        //Validar correo existente
        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }

        //Crear usuario con el modelo
        const dbUser = new Usuario( req.body );

        //Hashear la contraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);

        //Generar el JWT
        const token = await generarJWT(dbUser.id, name);

        //Crear usuario de db
        await dbUser.save();

        //Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            token
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const userDB = await Usuario.findOne({ email });
        
        if(!userDB) {
            return res.status(500).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

        //Validar contraseña
        const passValido = bcrypt.compareSync(password, userDB.password);

        if(!passValido){
            return res.status(500).json({
                ok: false,
                msg: 'El password es incorrecto'
            });
        }

        //Generar JWT
        const token = await generarJWT(userDB.id, userDB.name);

        return res.json({
            ok: true,
            name: userDB.name,
            uid: userDB.id,
            token
        })

        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Contacte al administrador'
        });
    }
}

const revalidarToken = async (req, res) => {

    const { uid, name } = req;

    //Generar nuevo token
    const token = await generarJWT(uid, name);

    return res.json({
        ok: true,
        uid,
        name,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}