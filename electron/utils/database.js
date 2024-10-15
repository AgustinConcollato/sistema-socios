const { app } = require('electron');
const fs = require('fs')
const path = require('node:path');
const sqlite3 = require('sqlite3').verbose()

const sourceDbPath = path.join(__dirname, '../database/database.db');

// Ruta donde estará la base de datos en el directorio userData (en producción)
const dbPath = path.join(app.getPath('userData'), 'database.db');

// Verifica si la base de datos no existe en userData y la copia
if (!fs.existsSync(dbPath)) {
    try {
        fs.copyFileSync(sourceDbPath, dbPath);  // Copia el archivo de base de datos
        console.log('Base de datos copiada a userData.');
    } catch (error) {
        console.error('Error copiando la base de datos:', error.message);
    }
} else {
    console.log('La base de datos ya existe en userData.');
}

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error abriendo la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

module.exports = db
