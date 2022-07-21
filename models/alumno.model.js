const { Schema, model, Types } = require('mongoose');


const AlumnoSchema = Schema({
   
    nombre: String,
    paterno: String,
    materno: String,
    sexo: String,
    fecha_nacimiento: String,
    curp: String,
    nacionalidad: String,
    lugar_nacimiento: {
        localidad_ciudad: String,
        municipio: String,
        estado: String
    },
    estado_civil: String,
    zona_recidencial: String,
    domicilio_actual:{
        calle_estado: String,
        colonia: String,
        codigo_postal: String,
        localidad_ciudad: String,
        municipio: String,
        estado: String,
    },
    telefono: String,
    celular: String,
    correo: String,
    discapacidad: String,
    origen_indigena: Boolean,
    tipo_origen: String,
    becado: Boolean,
    tipo_beca: String,
    turno: String,
    carrera: String,
    semestre_proximo: Number,
    promedio: Number,
    socioeconomicos: {
        trabaja: Boolean,
        nombre_empresa: String,
        ingreso_mensual: Number,
        depende_economicamente: Boolean,
        perdio_trabajo: Boolean,
        nombre_jefe: String,
        telefono: String,
        puesto: String,
        antiguedad: String,
        domicilio_laboral: {
            calle: String,
            no_exterior: String,
            colonia: String,
            municipio: String,
            localidad_ciudad: String,
            estado: String,
        }
    },
    tutor: {
        nombre: String,
        paterno: String,
        materno: String,
        parentesco: String,
        puesto: String,
        ingreso_mensual: Number,
        domicilio_laboral: {
            calle: String,
            no_exterior: String,
            colonia: String,
            municipio: String,
            localidad_ciudad: String,
            estado: String,
        },
        dependientes_economicos: Number,
        ingreso_familiar: Number,
        egresos: {
            alimentacion: Number,
            gas: Number,
            agua: Number,
            predial: Number,
            electricidad: Number,
            telefono: Number,
            celular: Number,
            recreacion: Number,
            transporte: Number,
            educacion: Number,
            gastos_medicos: Number,
            abonos_creditos: Number,
            ropa_calzado: Number,
            fondos_ahorro: Number,
            renta: Number,
        },
    },
    vivienda: {
        tenencia: String,
        tipo: String,
        no_dormitorios: Number,
        habitaciones: {
            sala: Boolean,
            comedor: Boolean,
            bano_privado: Boolean,
            bano_compartido: Boolean,
        },
        material: {
            paredes: String,
            techos: String,
            pisos: String,
        },
        mobiliario: {
            television: Boolean,
            estereo: Boolean,
            video: Boolean,
            dvd: Boolean,
            estufa: Boolean,
            microondas: Boolean,
            lavadora: Boolean,
            refri: Boolean,
            compu: Boolean,
        },
        servicios: {
            agua_potable: Boolean,
            luz_electrica: Boolean,
            drenaje: Boolean,
            pavimento: Boolean,
            transporte: Boolean,
            linea_tel: Boolean,
            internet: Boolean,
            tv_cable: Boolean,
        },
    },
    salud_fam: {
        imss: Boolean,
        issste: Boolean,
        centro_salud: Boolean,
        dispensario: Boolean,
        medico_priv: Boolean,
        frecuencia: String
    },
    familiares: [{
        nombre : String,
        edad : String,
        sexo : String,
        estado_civil : String,
        escolaridad : String,
        ocupacion : String,
    }],

    // Realizo la encuesta
    control: String,
    password: String,
    fecha_envio: String,
    enviado: { type: Boolean, default: false },
    puntos: { type: Number },

    /* Para dar bono */
    bono_aprobado: { type: Boolean, default: false },
    descuento: { type: Number },
    folio: { type: String },
    envio_archivos: { type: Boolean, default: false }
    /* fecha_bono_aprobado */
 

}, { collection: 'alumnos' });


AlumnoSchema.method('toJSON', function() {
    const { __v, password, ...object } = this.toObject(); 
    return object;
})


 

module.exports = model('Alumno', AlumnoSchema)