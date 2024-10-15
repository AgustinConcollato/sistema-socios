const { ipcMain } = require("electron/main");
const db = require('../utils/database')

ipcMain.handle('get-partner', async (_, args) => {
    const { collect, status, offset } = args

    return new Promise((resolve, reject) => {
        const sql = `
        WITH partner_data AS (
                SELECT partner.*, 
  '                     [' || COALESCE(GROUP_CONCAT(
                        json_object('amount', payments.amount, 'payment_date', payments.payment_date)
                        , ','), '') || ']' AS payments
                FROM partner
                LEFT JOIN (
                    SELECT *
                    FROM payments
                    ORDER BY payment_date DESC
                    LIMIT 12
                ) AS payments ON partner.id = payments.partner_id
                WHERE partner.collect = ? 
                AND partner.status = ?
                GROUP BY partner.id
            )
            SELECT *, 
                (SELECT COUNT(*) 
                    FROM partner 
                    WHERE collect = ? 
                    AND status = ?) AS total_partners
            FROM partner_data
            ORDER BY partner_data.name COLLATE NOCASE ASC
            LIMIT 20
            OFFSET ?
        `
        db.all(sql, [collect, status, collect, status, offset], (error, results) => {
            if (error) {
                reject(error.message);
            } else {
                const transformedResults = results.map(partner => ({
                    ...partner,
                    payments: JSON.parse(partner.payments)[0].amount && JSON.parse(partner.payments) // Asegurarse de que los pagos sean un array de objetos
                }));
                resolve(transformedResults);
            }
        });
    })
})