const { Router } = require('express');
const { create, getAll, getById, contar } = require('../controllers/encuesta.controller');
const { validarJWT, validarMismoAlumno } = require('../middlewares/validar-jwt.middleware');

const router = Router();


/* id ALUMNO */
router.put('/create/:id', [validarJWT, validarMismoAlumno], create);

/*TODO: Validar token */
router.get('/all', getAll);
router.get('/contar', contar);


router.get('/:id', getById);


module.exports = router;