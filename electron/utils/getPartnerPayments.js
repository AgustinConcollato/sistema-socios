const { ipcMain } = require("electron/main");
const db = require('./database')

ipcMain.handle('get-partner-payments', async (_, args) => {

    const { id, year } = args

    return new Promise((resolve, reject) => {
        sql = `
    SELECT p.*, pay.*
    FROM partner p
    LEFT JOIN payments pay 
        ON p.id = pay.partner_id 
        AND strftime('%Y', pay.payment_date / 1000, 'unixepoch') = ?
    WHERE p.id = ?
    ORDER BY pay.payment_date ASC
        `

        db.all(sql, [year, id], (error, results) => {
            if (error) {
                reject(error.message)
            } else {
                if (results.length > 0) {
                    const partner = results[0]

                    const payments = results
                        .filter(row => row.payment_date)
                        .map(row => ({
                            id: row.payment_id,
                            amount: row.amount,
                            payment_date: row.payment_date,
                        }));

                    resolve({
                        partner,
                        payments
                    });
                } else {
                    resolve({
                        partner: null,
                        payments: []
                    });
                }
            }
        })
    })
})