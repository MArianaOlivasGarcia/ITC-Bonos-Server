const { Schema, model } = require('mongoose');


const RecepcionSchema = Schema({
   
    semestre: { type: String },
    fecha_inicio: { type: String },
    fecha_termino: { type: String }

}, { collection: 'recepciones' });



module.exports = model('Recepcion', RecepcionSchema)