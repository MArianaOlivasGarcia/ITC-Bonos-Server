const { Schema, model } = require('mongoose');


const ValueSchema = Schema({
   
    form: { type: String },
    values: { type: Object, },

}, { collection: 'values' });



module.exports = model('Value', ValueSchema)