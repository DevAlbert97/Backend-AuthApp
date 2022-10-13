const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, login, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

//_ Registro de usuario
router.post('/register',[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),    
    check('password', 'La contraseña es obligatoria').isLength({min: 6}),
    validateFields
], createUser);

//_ Login de usuario
router.post('/login',[
    check('email', 'El email es obligatorio').isEmail(),    
    check('password', 'La contraseña es obligatoria').isLength({min: 6}),
    validateFields    
], login);

//_ JWT
router.get('/renew',[
    validateJWT
], renewToken);

module.exports = router;