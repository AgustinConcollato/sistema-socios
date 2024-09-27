const { ipcMain } = require("electron/main");
const db = require('../utils/database')

ipcMain.handle('get-partner', async (_, args) => {
    const { collect, status } = args

    return new Promise((resolve, reject) => {
        sql = `
            SELECT partner.*, 
                payments.amount AS last_payment_amount, 
                payments.payment_date AS last_payment_date
            FROM partner
            LEFT JOIN (
                SELECT partner_id, amount, payment_date
                FROM payments
                WHERE payment_date = (
                    SELECT MAX(payment_date)
                    FROM payments AS p2
                    WHERE p2.partner_id = payments.partner_id
                )
            ) AS payments ON partner.id = payments.partner_id
            WHERE partner.collect = ? 
            AND partner.status = ?
            ORDER BY partner.name COLLATE NOCASE ASC
        `

        db.all(sql, [collect, status], (error, results) => {
            if (error) {
                reject(error.message)
            } else {
                resolve(results);
            }
        })
    })
})