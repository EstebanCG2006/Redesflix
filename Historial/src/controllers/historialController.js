// Crear una nueva entrada de historial
exports.agregarVista = async (req, res) => {
    try {
        const { usuarioId, peliculaId } = req.body;

        // Validar existencia del usuario
        const usuarioResponse = await axios.get(`http://localhost:3002/api/usuarios/${usuarioId}`);
        if (!usuarioResponse.data || usuarioResponse.status !== 200) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Obtener datos de la película
        const peliculaResponse = await axios.get(`http://localhost:3001/api/peliculas/${peliculaId}`);
        if (!peliculaResponse.data || peliculaResponse.status !== 200) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        // Obtener título y género usando los nombres correctos del catálogo
        const { name: titulo, genre: genero } = peliculaResponse.data;

        // Guardar en el historial
        const id = await historialModel.agregarHistorial(usuarioId, peliculaId, titulo, genero);

        res.status(201).json({ mensaje: 'Historial guardado', id });
    } catch (error) {
        console.error('🔥 Error en agregarVista:', error);
        res.status(500).json({
            error: 'Error al guardar historial',
            detalles: error.message
        });
    }
};

// Obtener historial por usuario
exports.obtenerHistorialUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const historial = await historialModel.obtenerHistorialPorUsuario(usuarioId);
        res.json(historial);
    } catch (error) {
        console.error('🔥 Error en obtenerHistorialUsuario:', error);
        res.status(500).json({ error: 'Error al obtener historial' });
    }
};
