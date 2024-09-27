const { ipcMain } = require("electron");
const db = require('../utils/database');

ipcMain.handle('add-partner', async (event, args) => {
    const { id, name, address, collect, neighborhood, contact, date } = args;

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