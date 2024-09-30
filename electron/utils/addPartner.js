const { ipcMain } = require("electron");
const db = require('../utils/database');
const { generateId } = require('./generateId')

ipcMain.handle('add-partner', async (event, args) => {
    const { name, address, collect, neighborhood, contact, date } = args;
    const id = generateId()

    const sql = 'INSERT INTO partner (id, name, address, collect, neighborhood, contact, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.run(sql, [id, name, address, collect, neighborhood, contact, date, 'active'], function (err) {
            if (err) {
                reject(err.message);
            } else {
                resolve({ changes: this.changes, status: "success", partner: args });
            }
        });
    });
});