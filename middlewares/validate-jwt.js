const { response } = require("express")
const jwt = require('jsonwebtoken')

const validateJWT = (req, resp = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return resp.status(401).json({
            ok: false,
            msg: 'Error en el token'
        })    
    }
    try {
        const {uid, name} = jwt.verify(token, process.env.SECRET_JWT_SEED);
        req.uid = uid;
        req.name = name;
    } catch (error) {
        return resp.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })    
    }
    next();
} 

module.exports = {
    validateJWT
}