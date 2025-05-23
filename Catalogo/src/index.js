const express = require('express');
const app = express();
const peliculasRoutes = require('./controllers/peliculasController'); // Importa el controlador

app.use(express.json());
app.use('/api', peliculasRoutes); // Prefijo de rutas

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
