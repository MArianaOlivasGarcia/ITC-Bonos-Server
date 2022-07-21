const { Router } = require('express');
const { buscar } = require('../controllers/busqueda.controllers');
const router = Router();


router.get('/:coleccion/:termino', buscar );


module.exports = router;