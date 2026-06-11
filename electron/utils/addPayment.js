const { ipcMain } = require("electron");
const db = require('../utils/database');
const { generateId } = require('./generateId')

ipcMain.handle('add-payment', async (_, args) => {
    const { id, payment, data } = args;
    const paymentId = generateId()

    const sql = 'INSERT INTO payments (payment_id, partner_id, amount, payment_date) VALUES (?, ?, ?, ?)';

    return new Promise((resolve) => {
        db.run(sql, [paymentId, id, payment, data], function (err) {
            if (err) {
                console.error(err)
                resolve({ status: 'error', message: err.message })
            } else {
                resolve({ status: 'success', changes: this.changes })
            }
        });
    });
});