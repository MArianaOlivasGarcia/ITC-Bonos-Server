const { Schema, model } = require('mongoose');

// REJ20220001
const CounterSchema = Schema({
   
    periodo: {
        type: String
    },
    currentValue: {
        type: Number
    }

}, { collection: 'counters' });


module.exports = model('Counter', CounterSchema)