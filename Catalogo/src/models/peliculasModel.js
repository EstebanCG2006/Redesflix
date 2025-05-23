const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'mysql',
    user: 'root',
    password: 'Gomez92150@',
    database: 'movies_db'
});

// Obtener todas las películas
async function listarPeliculas() {
    const [result] = await connection.query('SELECT * FROM movies');
    return result;
}

// Obtener una película por ID
async function obtenerPelicula(id) {
    const [result] = await connection.query('SELECT * FROM movies WHERE id = ?', [id]);
    return result[0]; // Retorna solo una película
}

// Buscar películas por nombre
async function buscarPorNombre(name) {
    const [result] = await connection.query('SELECT * FROM movies WHERE name LIKE ?', [`%${name}%`]);
    return result;
}

// Buscar películas por género
async function buscarPorGenero(genre) {
    const [result] = await connection.query('SELECT * FROM movies WHERE genre LIKE ?', [`%${genre}%`]);
    return result;
}

// Buscar películas por director
async function buscarPorDirector(director) {
    const [result] = await connection.query('SELECT * FROM movies WHERE director LIKE ?', [`%${director}%`]);
    return result;
}

// Buscar películas por año
async function buscarPorAño(year) {
    const [result] = await connection.query('SELECT * FROM movies WHERE year = ?', [year]);
    return result;
}

// Buscar películas por país
async function buscarPorPais(country) {
    const [result] = await connection.query('SELECT * FROM movies WHERE country LIKE ?', [`%${country}%`]);
    return result;
}

// Buscar películas por compañía
async function buscarPorEmpresa(company) {
    const [result] = await connection.query('SELECT * FROM movies WHERE company LIKE ?', [`%${company}%`]);
    return result;

}


const crearPelicula = async ({ 
    name, rating, genre, year, released, score, votes, 
    director, writer, star, country, budget, gross, company, runtime 
}) => {
    try {
        const sql = `
            INSERT INTO movies (name, rating, genre, year, released, score, votes, 
            director, writer, star, country, budget, gross, company, runtime) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await connection.query(sql, [
            name, rating, genre, year, released, score, votes, 
            director, writer, star, country, budget, gross, company, runtime
        ]);

        return { 
            id: result.insertId, name, rating, genre, year, released, 
            score, votes, director, writer, star, country, budget, gross, company, runtime 
        };
    } catch (error) {
        throw error;
    }
};



// Actualizar una película por ID
const actualizarPelicula = async (id, pelicula) => {
    try {
        const sql = `
            UPDATE movies 
            SET name = ?, rating = ?, genre = ?, year = ?, released = ?, score = ?, votes = ?, 
                director = ?, writer = ?, star = ?, country = ?, budget = ?, gross = ?, company = ?, runtime = ?
            WHERE id = ?
        `;

        const valores = [
            pelicula.name, pelicula.rating, pelicula.genre, pelicula.year, pelicula.released, 
            pelicula.score, pelicula.votes, pelicula.director, pelicula.writer, pelicula.star, 
            pelicula.country, pelicula.budget, pelicula.gross, pelicula.company, pelicula.runtime, id
        ];

        const [result] = await connection.query(sql, valores);
        return result;
    } catch (error) {
        throw error;
    }
};

// Eliminar una película por ID
const eliminarPelicula = async (id) => {
    try {
        const sql = `DELETE FROM movies WHERE id = ?`;
        const [result] = await connection.query(sql, [id]);
        return result;
    } catch (error) {
        throw error;
    }
};


const calificarPelicula = async (id, userScore) => {
    try {
        const [pelicula] = await connection.query(
            "SELECT score, votes FROM movies WHERE id = ?",
            [id]
        );

        if (pelicula.length === 0) {
            return null; // Película no encontrada
        }

        let { score, votes } = pelicula[0];
        votes += 1;
        score = ((score * (votes - 1)) + userScore) / votes; // Nuevo promedio

        await connection.query(
            "UPDATE movies SET score = ?, votes = ? WHERE id = ?",
            [score, votes, id]
        );

        return { id, score, votes };
    } catch (error) {
        throw error;
    }
};

const obtenerPeliculasPorSuscripcion = async (tipoSuscripcion) => {
    try {
        let maxScore;

        if (tipoSuscripcion === "basica") {
            maxScore = 3.3;
        } else if (tipoSuscripcion === "estandar") {
            maxScore = 6.6;
        } else if (tipoSuscripcion === "premium") {
            maxScore = 10;
        } else {
            return null; // Tipo de suscripción no válido
        }

        const [peliculas] = await connection.query(
            "SELECT * FROM movies WHERE score <= ?",
            [maxScore]
        );

        return peliculas;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    listarPeliculas,
    obtenerPelicula,
    crearPelicula,
    actualizarPelicula,
    eliminarPelicula,
    buscarPorNombre,
    buscarPorGenero,
    buscarPorDirector,
    buscarPorAño,
    buscarPorPais,
    buscarPorEmpresa,
    calificarPelicula, 
    obtenerPeliculasPorSuscripcion
};
