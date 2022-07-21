const { Router } = require('express');
const { login, register, renovarJWT } = require('../controllers/auth.controllers');
const { validarJWT } = require('../middlewares/validar-jwt.middleware');
const router = Router();


router.post('/login', login);
/* TODO: Validar que sea usuario administrador */
router.post('/register', register );

router.get('/renovar', validarJWT, renovarJWT);

module.exports = router;