const { Router } = require('express');
const { login, 
    renovarJWT,
    getAll,
    getAllAprobados,
    getAllNoAprobados } = require('../controllers/alumno.controllers');
const { validarJWT } = require('../middlewares/validar-jwt.middleware');
const router = Router();


router.post('/login', login );

router.get('/renovar', validarJWT, renovarJWT);

/* TODO: CAMBIAR EN FUTURA VERSION */

/* Obtener todos los alumnos que cumplen requisitos convocatoria */
/* Posteriormente editar para obtener 
TODOS LOS ALUMNOS
TODOS LOS QUE CUMPLEN CONVOCATORIA */
router.get('/all', getAll);

router.get('/aprobados', getAllAprobados);
router.get('/no-aprobados', getAllNoAprobados);

module.exports = router;