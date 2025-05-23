const express = require('express');
const suscripcionRoutes = require('./controllers/suscripcionesController');
const { connection } = require('./models/suscripcionesModel');

const app = express();
app.use(express.json());
app.use('/suscripciones', suscripcionRoutes);

connection.getConnection()
    .then(() => console.log('✅ Conectado a MySQL (suscripciones_db)'))
    .catch(err => console.error('❌ Error al conectar a MySQL:', err));

app.listen(3004, () => console.log('Microservicio de Suscripciones en puerto 3004'));