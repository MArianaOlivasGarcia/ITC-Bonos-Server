const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
/* const serverIndex = require('serve-index');
 */require('dotenv').config();
require('./database/config').dbConnection();
const app = express();




app.use(express.static('public'));
/* app.use('/uploads', serverIndex( __dirname + '/uploads'))
 */
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true  }) )


app.use(express.json() )
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/alumnos', require('./routes/alumno.routes'));
app.use('/api/encuestas', require('./routes/encuesta.routes'));
app.use('/api/uploads', require('./routes/uploads.routes'));
app.use('/api/busqueda', require('./routes/busqueda.routes'));
app.use('/api/values', require('./routes/values.routes'));
app.use('/api/grafica', require('./routes/grafica.routes'));
app.use('/api/test', require('./routes/test.routes'));


app.get('*', (req, res) => {
    res.sendFile( path.resolve(__dirname, 'public/index.html') )
})

// app.listen( process.env.PORT, '10.1.29.10' ,async (err) => {
app.listen( process.env.PORT, async (err) => {
    if (err) throw new Error(err);
    console.log('Servidor corriendo en puerto', process.env.PORT);

});



