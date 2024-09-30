const { ipcMain } = require("electron");
const db = require('../utils/database');
const { generateId } = require('./generateId')

ipcMain.handle('add-payment', async (event, args) => {
    const { id, payment, data } = args;
    const paymentId = generateId()

    const sql = 'INSERT INTO payments (payment_id, partner_id, amount, payment_date) VALUES (?, ?, ?, ?)';

    db.run(sql, [paymentId, id, payment, data], function (err) {
        if (err) {
            console.log(err)
        } else {
        }
    });
});