const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'mysql',
    user: 'root',
    password: 'Gomez92150@',
    database: 'suscripciones_db'
});

const crearSuscripcion = async (usuario_id, tipo) => {
    const query = 'INSERT INTO suscripciones (usuario_id, tipo, estado) VALUES (?, ?, "inactivo")';
    const [result] = await connection.execute(query, [usuario_id, tipo]);
    return result;
};

const actualizarEstado = async (usuario_id, estado) => {
    const query = 'UPDATE suscripciones SET estado = ? WHERE usuario_id = ?';
    const [result] = await connection.execute(query, [estado, usuario_id]);
    return result;
};

const obtenerSuscripcion = async (usuario_id) => {
    const query = 'SELECT * FROM suscripciones WHERE usuario_id = ? AND estado = "activo"';
    const [result] = await connection.execute(query, [usuario_id]);
    return result;
};

module.exports = { connection, crearSuscripcion, actualizarEstado, obtenerSuscripcion };
