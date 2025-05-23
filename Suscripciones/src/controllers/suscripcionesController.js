const express = require('express');
const router = express.Router();
const axios = require('axios');
const { crearSuscripcion, actualizarEstado, obtenerSuscripcion } = require('../models/suscripcionesModel');

const USUARIOS_SERVICE_URL = 'http://localhost:3002/api/usuarios'; // URL del microservicio de usuarios
const CATALOGO_SERVICE_URL = 'http://localhost:3001/api/peliculas'; // URL del microservicio de catálogo

// Crear suscripción
router.post('/crear', async (req, res) => {
    try {
        const { usuario_id, tipo } = req.body;
        const result = await crearSuscripcion(usuario_id, tipo);
        res.json({ id: result.insertId, usuario_id, tipo, estado: 'inactivo' });
    } catch (error) {
        console.error("Error al crear suscripción:", error);
        res.status(500).json({ error: 'Error al crear suscripción' });
    }
});

// Validar pago
router.post('/validar-pago', async (req, res) => {
    const { usuario_id } = req.body;
    console.log(`Validando pago para usuario: ${usuario_id}`);

    try {
        const response = await axios.get(`${USUARIOS_SERVICE_URL}/${usuario_id}`);
        const usuario = response.data;

        console.log("Datos del usuario recibidos:", usuario);

        if (!usuario.tarjeta_numero) {
            return res.status(400).json({ error: 'El usuario no tiene tarjeta registrada' });
        }

        const tarjeta = usuario.tarjeta_numero;
        console.log("Número de tarjeta:", tarjeta);

        if (tarjeta.startsWith('1') && tarjeta.endsWith('90')) {
            await actualizarEstado(usuario_id, 'pendiente');
            res.json({ mensaje: 'Pago validado, pendiente de aprobación' });
        } else {
            res.status(400).json({ error: 'Tarjeta inválida' });
        }
    } catch (error) {
        console.error("Error en la solicitud a usuarios-service:", error.response?.data || error.message);
        res.status(500).json({ error: 'Error al validar pago' });
    }
});

// Activar suscripción
router.post('/activar', async (req, res) => {
    try {
        const { usuario_id } = req.body;
        await actualizarEstado(usuario_id, 'activo');
        res.json({ mensaje: 'Suscripción activada' });
    } catch (error) {
        console.error("Error al activar suscripción:", error);
        res.status(500).json({ error: 'Error al activar suscripción' });
    }
});

// Obtener películas permitidas según la suscripción
router.get('/permitidas/:usuario_id', async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const result = await obtenerSuscripcion(usuario_id);

        if (result.length === 0) {
            return res.status(403).json({ error: 'Sin suscripción activa' });
        }

        const tipo = result[0].tipo;
        const score_max = tipo === 'basico' ? 4 : tipo === 'estandar' ? 6 : 10;

        const peliculasResponse = await axios.get(`${CATALOGO_SERVICE_URL}?score_max=${score_max}`);
        res.json(peliculasResponse.data);
    } catch (error) {
        console.error("Error al obtener películas permitidas:", error.response?.data || error.message);
        res.status(500).json({ error: 'Error al obtener películas' });
    }
});

module.exports = router;
