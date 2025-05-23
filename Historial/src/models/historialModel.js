const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'mysql',
    user: 'root',
    password: 'Gomez92150@',
    database: 'historial_db2' // Asegúrate de que esta base contenga la tabla correcta
});

// Agregar entrada al historial
async function agregarHistorial(usuarioId, peliculaId, titulo, genero) {
    const [result] = await connection.query(
        `INSERT INTO historial (
            usuario_id, 
            pelicula_id, 
            titulo_pelicula, 
            genero, 
            fecha_vista
        ) VALUES (?, ?, ?, ?, NOW())`,
        [usuarioId, peliculaId, titulo, genero]
    );
    return result.insertId;
}

// Obtener historial por usuario
async function obtenerHistorialPorUsuario(usuarioId) {
    const [result] = await connection.query(
        `SELECT * FROM historial WHERE usuario_id = ? ORDER BY fecha_vista DESC`, 
        [usuarioId]
    );
    return result;
}

// Eliminar una entrada
async function eliminarHistorial(id) {
    await connection.query(`DELETE FROM historial WHERE id = ?`, [id]);
}

module.exports = {
    agregarHistorial,
    obtenerHistorialPorUsuario,
    eliminarHistorial
};
