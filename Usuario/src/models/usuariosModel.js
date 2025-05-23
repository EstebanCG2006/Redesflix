// src/models/usuariosModel.js
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'mysql',
    user: 'root',
    password: 'Gomez92150@',
    database: 'u_movies'
});

// Obtener todos los usuarios
async function traerUsuarios() {
    const [result] = await connection.query(
        'SELECT id, nombre, email, password, rol, tarjeta_numero, tarjeta_vencimiento, tarjeta_cvv FROM usuarios'
    );
    return result;
}

// Obtener un usuario por ID
async function traerUsuario(id) {
    const [result] = await connection.query(
        'SELECT id, nombre, email, password, rol, tarjeta_numero, tarjeta_vencimiento, tarjeta_cvv FROM usuarios WHERE id = ?',
        [id]
    );
    return result[0];  
}

// Crear un usuario
const crearUsuario = async (nombre, email, password, rol = 'usuario', tarjeta_numero = null, tarjeta_vencimiento = null, tarjeta_cvv = null) => {
    try {
        const [result] = await connection.query(
            'INSERT INTO usuarios (nombre, email, password, rol, tarjeta_numero, tarjeta_vencimiento, tarjeta_cvv) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre, email, password, rol, tarjeta_numero, tarjeta_vencimiento, tarjeta_cvv]
        );
        return { id: result.insertId, nombre, email, rol, tarjeta_numero, tarjeta_vencimiento };
    } catch (error) {
        throw error;
    }
};

// Validar usuario (Login sin encriptación)
async function validarUsuario(email, password) {
    const [result] = await connection.query(
        'SELECT id, nombre, email FROM usuarios WHERE email = ? AND password = ?',
        [email, password] // ❌ Comparación directa (NO SEGURA)
    );
    return result[0] || null; // Si no hay usuario, retorna null
}

module.exports = { traerUsuarios, traerUsuario, crearUsuario, validarUsuario};
   
