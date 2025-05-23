const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { crearUsuario, traerUsuarios, traerUsuario } = require('../models/usuariosModel');



const router = express.Router();

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'mysql',
    user: 'root', // Cambia esto si tu usuario de MySQL es diferente
    password: 'Gomez92150@', // Si tienes una contraseña, agrégala aquí
    database: 'u_movies' // Base de datos del microservicio de usuarios
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('❌ Error al conectar a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL (u_movies)');
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await traerUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios", detalle: error.message });
    }
});

// Crear un usuario
router.post('/', async (req, res) => {
    try {
        const { nombre, email, password, rol = 'usuario', tarjeta_numero, tarjeta_vencimiento, tarjeta_cvv } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const nuevoUsuario = await crearUsuario(nombre, email, password, rol, tarjeta_numero, tarjeta_vencimiento, tarjeta_cvv);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});




// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await traerUsuario(id);

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el usuario", detalle: error.message });
    }
});



// Actualizar un usuario 
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, email, password } = req.body;

    // Construir la consulta de actualización
    const camposActualizados = {};
    if (nombre) camposActualizados.nombre = nombre;
    if (email) camposActualizados.email = email;
    if (password) camposActualizados.password = password;

    db.query('UPDATE usuarios SET ? WHERE id = ?', [camposActualizados, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar usuario', detalles: err });

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.json({ mensaje: 'Usuario actualizado' });
    });
});



// Eliminar un usuario 
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar usuario', detalles: err });

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.json({ mensaje: 'Usuario eliminado' });
    });
});


// Login de usuario 
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Se requiere email y contraseña' });
    }

    db.query('SELECT id, nombre, email, password FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor', detalles: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const usuario = results[0];

        // Comparar la contraseña directamente (sin encriptación)
        if (usuario.password !== password) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        res.json({ 
            mensaje: 'Login exitoso', 
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } 
        });
    });
});

//Actualizar tarjeta de usuario
router.put('/:id/tarjeta', async (req, res) => {
    try {
        const { id } = req.params;
        const { tarjeta_numero, tarjeta_vencimiento, tarjeta_cvv } = req.body;

        if (!tarjeta_numero || !tarjeta_vencimiento || !tarjeta_cvv) {
            return res.status(400).json({ error: 'Todos los datos de la tarjeta son obligatorios' });
        }

        const [result] = await connection.query(
            'UPDATE usuarios SET tarjeta_numero = ?, tarjeta_vencimiento = ?, tarjeta_cvv = ? WHERE id = ?',
            [tarjeta_numero, tarjeta_vencimiento, tarjeta_cvv, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ mensaje: 'Tarjeta actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la tarjeta', detalles: error.message });
    }
});


module.exports = router;
