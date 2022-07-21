const { Router } = require('express');
const { fileUpload, filesUpload, upload } = require('../controllers/uploads.controller');
const { validarJWT } = require('../middlewares/validar-jwt.middleware');
const router = Router();


/* id usuario */
router.post('/archivo', validarJWT, fileUpload);
router.post('/archivos', validarJWT, filesUpload);

module.exports = router;