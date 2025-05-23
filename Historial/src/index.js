const express = require('express');
const morgan = require('morgan');
const app = express();
const historialController = require('./controllers/historialController');

app.use(express.json());
app.use(morgan('dev')); // Muestra logs HTTP de cada petición

// Rutas del microservicio historial
app.post('/historial', historialController.agregarVista);
app.get('/historial/:usuarioId', historialController.obtenerHistorialUsuario);

// Middleware para capturar errores internos
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar el servidor
const PORT = 3006;
app.listen(PORT, () => {
    console.log(`Historial service corriendo en http://localhost:${PORT}`);
});
