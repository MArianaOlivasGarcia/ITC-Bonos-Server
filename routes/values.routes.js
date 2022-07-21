const { Router } = require('express');
const { actualizarValues } = require('../controllers/values.controllers');

const router = Router();


/* TODO: MOdificar a futuro mandar el id o algo asi */
router.put('/', actualizarValues);



module.exports = router;