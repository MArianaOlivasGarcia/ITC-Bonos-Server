const { Router } = require('express');
const Value = require('../models/value.model')
const Alumno = require('../models/alumno.model')
const router = Router();
const fs = require('fs');
const path = require('path');


router.get('/', async (req, res = response) => {

    const carpetaPath = path.join( __dirname, '../uploads/', '17530054' )
    if (!fs.existsSync(carpetaPath)) {
        fs. mkdirSync(carpetaPath)
    }


});


module.exports = router;
