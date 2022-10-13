const { response } = require('express');
const User  = require('../models/User');
const bdcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt')


// Metodo para crear un usuario
const createUser = async(req, resp = response) => {
    const { name, email, password} = req.body;
    try {
        // Verificar correo igual
        const user = await User.findOne({email});
        if (user) {
            return resp.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }
        // Crear usuario con el modelo
        const dbUser = new User(req.body);
        // Encriptar constraseña
        const salt = bdcrypt.genSaltSync();
        dbUser.password = bdcrypt.hashSync(password, salt);
        // Generar JWT
        const token = await generateJWT(dbUser.id, name);
        // Crear usuario en DB
        await dbUser.save();
        // Generar respuesta Exitosa
        return resp.status(200).json({
            ok: true,
            uid: dbUser.id,
            name,
            email: dbUser.email,
            token
        });
    } catch (error) {
        console.log(error)
        return resp.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// Metodo para logeo de usuario
const login = async(req, resp = response) => {
    const { email, password } = req.body;
    try {
        const dbUser = await User.findOne({email});
        if (!dbUser) {
            return resp.status(400).json({
                ok: false,
                msg: 'Credenciales erroneas'
            })
        }
        // Confirmar si el password hace match
        const validPassword = bdcrypt.compareSync(password, dbUser.password);
        if (!validPassword) {
            return resp.status(400).json({
                ok: false,
                msg: 'El password es incorrecto'
            });
        }
        // Generar el JWT
        const token = await generateJWT(dbUser.id, dbUser.name);
        // Respuesta del servicio
        return resp.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token: token
        })
    } catch (error) {
        return resp.status(500).json({
            ok: false,
            msg: 'No se pudo logear'
        })
    }
}

// Renovacion de token
const renewToken = async(req, resp = response) => {

    const {uid} = req;

    // Leer la base de datos
    const dbUser = await User.findById(uid);

    // Generar el JWT
    const token = await generateJWT(uid, dbUser.name);

    return resp.json({
        ok: true,
        msg: 'Renew de token',
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    })
}

module.exports = {
    createUser,
    login,
    renewToken
}