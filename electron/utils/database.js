const path = require('node:path');
const sqlite3 = require('sqlite3').verbose()

const dbPath = path.resolve(__dirname, '../database/database.db');

// Crear una nueva conexión a la base de datos
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error abriendo la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

module.exports = db
