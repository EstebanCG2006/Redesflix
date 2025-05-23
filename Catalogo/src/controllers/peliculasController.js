const express = require('express');
const router = express.Router();
const peliculasModel = require('../models/peliculasModel'); // Importa el modelo correctamente

// Obtener todas las películas
router.get('/peliculas', async (req, res) => {
    try {
        const peliculas = await peliculasModel.listarPeliculas();
        res.json(peliculas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener películas" });
    }
});

// Obtener película por ID
router.get('/peliculas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pelicula = await peliculasModel.obtenerPelicula(id);
        if (!pelicula) return res.status(404).json({ error: "Película no encontrada" });
        res.json(pelicula);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener la película" });
    }
});

// Buscar películas por nombre
router.get('/peliculas/nombre/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const peliculas = await peliculasModel.buscarPorNombre(name);
        if (peliculas.length === 0) return res.status(404).json({ error: "Película no encontrada" });
        res.json(peliculas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al buscar la película" });
    }
});

// Buscar películas por género
router.get('/peliculas/genero/:genre', async (req, res) => {
    try {
        const { genre } = req.params;
        const peliculas = await peliculasModel.buscarPorGenero(genre);
        if (peliculas.length === 0) return res.status(404).json({ error: "No hay películas de este género" });
        res.json(peliculas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al buscar películas por género" });
    }
});

// Buscar películas por director
router.get('/peliculas/director/:director', async (req, res) => {
    try {
        const { director } = req.params;
        const peliculas = await peliculasModel.buscarPorDirector(director);
        if (peliculas.length === 0) return res.status(404).json({ error: "No hay películas de este director" });
        res.json(peliculas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al buscar películas por director" });
    }
});

// Buscar películas por año
router.get('/peliculas/anio/:year', async (req, res) => {
    try {
        const { year } = req.params;
        const peliculas = await peliculasModel.buscarPorAño(year);
        if (peliculas.length === 0) return res.status(404).json({ error: "No hay películas de este año" });
        res.json(peliculas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al buscar películas por año" });
    }
});

// Buscar películas por país
router.get('/peliculas/pais/:country', async (req, res) => {
    try {
        const { country } = req.params;
        const peliculas = await peliculasModel.buscarPorPais(country);
        if (peliculas.length === 0) return res.status(404).json({ error: "No hay películas de este país" });
        res.json(peliculas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al buscar películas por país" });
    }
});

// Buscar películas por compañía
router.get('/peliculas/empresa/:company', async (req, res) => {
    try {
        const { company } = req.params;
        const peliculas = await peliculasModel.buscarPorEmpresa(company);
        if (peliculas.length === 0) return res.status(404).json({ error: "No hay películas de esta compañía" });
        res.json(peliculas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al buscar películas por compañía" });
    }
});

module.exports = router;

// Agregar una nueva película
router.post('/peliculas', async (req, res) => {
    try {
        const { name, rating, genre, year, released, score, votes, director, writer, star, country, budget, gross, company, runtime } = req.body;

        // Verificación básica de campos obligatorios
        if (!name || !rating || !genre || !year || !released) {
            return res.status(400).json({ error: "Todos los campos obligatorios deben ser proporcionados" });
        }

        // Llamar a la función para crear la película en la base de datos
        const nuevaPelicula = await peliculasModel.crearPelicula({ name, rating, genre, year, released, score, votes, director, writer, star, country, budget, gross, company, runtime });

        res.json({ message: "Película agregada con éxito", id: nuevaPelicula.insertId });
    } catch (error) {
        console.error("Error al agregar película:", error);
        res.status(500).json({ error: "Error al agregar película" });
    }
});

// Actualizar una película
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const peliculaActualizada = await peliculasModel.actualizarPelicula(id, req.body);

        if (peliculaActualizada.affectedRows === 0) {
            return res.status(404).json({ error: "Película no encontrada" });
        }

        res.json({ message: "Película actualizada con éxito" });
    } catch (error) {
        console.error("Error al actualizar la película:", error);
        res.status(500).json({ error: "Error al actualizar la película" });
    }
});


// Eliminar una película
router.delete('/peliculas/:id', async (req, res) => {
    try {
        const eliminado = await peliculasModel.eliminarPelicula(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ error: "Película no encontrada" });
        }
        res.json({ message: "Película eliminada con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar película" });
    }
});

router.post('/:id/calificar', async (req, res) => {
    try {
        const { id } = req.params;
        const { userScore } = req.body;

        if (!userScore || userScore < 0 || userScore > 10) {
            return res.status(400).json({ error: "La calificación debe estar entre 0 y 10" });
        }

        const peliculaActualizada = await peliculasModel.calificarPelicula(id, userScore);

        if (!peliculaActualizada) {
            return res.status(404).json({ error: "Película no encontrada" });
        }

        res.json({ message: "Calificación actualizada con éxito", pelicula: peliculaActualizada });
    } catch (error) {
        console.error("Error al calificar la película:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get('/suscripcion/:tipo', async (req, res) => {
    try {
        const { tipo } = req.params;
        const peliculas = await peliculasModel.obtenerPeliculasPorSuscripcion(tipo);

        if (!peliculas) {
            return res.status(400).json({ error: "Tipo de suscripción no válido" });
        }

        res.json({ peliculas });
    } catch (error) {
        console.error("Error al obtener películas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Coloca este único module.exports al final del archivo
module.exports = router;

