const express = require('express');
const cors = require('cors');
const usuariosController = require('./controllers/usuariosController');

const app = express();

// Middleware
app.use(express.json()); 
app.use(cors()); 

// Rutas
app.use('/api/usuarios', usuariosController); 

// Configuración del servidor
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
