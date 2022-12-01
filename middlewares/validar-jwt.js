const { response, request } = require("express");
const jwt = require('jsonwebtoken');


const validarJWT = ( req, res = response, next) => {

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'Error en el token'
        });
    }

    try {
        const { uid, name } = jwt.verify( token, process.env.SECRET_JWT );
        req.uid = uid;
        req.name = name;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'token no es valido'
        });
    }

    //TODO OK
    next();
}

module.exports = {
    validarJWT
}