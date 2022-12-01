const jwt = require('jsonwebtoken');

const generarJWT = (uid, name) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid, name};
        
        jwt.sign( payload , process.env.SECRET_JWT, {
            expiresIn: '24h'
        }, (err, token) => {
            if(err){
                return reject(err);
            }else{
                return resolve(token);
            }
        });
    })
}

module.exports = {
    generarJWT
}