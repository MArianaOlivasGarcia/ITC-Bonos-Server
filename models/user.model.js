const { Schema, model } = require('mongoose');


const UserSchema = Schema({
   
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true, default: 'USER_ROLE' },

}, { collection: 'users' });


UserSchema.method('toJSON', function() {
    const { __v, password, ...object } = this.toObject(); 
    return object;
})


 

module.exports = model('User', UserSchema)