const { Router } = require('express');
const { getSexo } = require('../controllers/grafica.controllers');

const router = Router();


/* id ALUMNO */
router.get('/sexo', getSexo);


module.exports = router;