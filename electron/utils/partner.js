const { ipcMain } = require("electron");
const db = require('./database');
const { generateId } = require('./generateId')

ipcMain.handle('add-partner', async (_, args) => {

    const partnerInstance = new Partner();

    try {
        const response = await partnerInstance.add(args);
        return response;
    } catch (error) {
        console.error(error);
        return { status: "error", message: error.message };
    }
});

ipcMain.handle('pause-partner', async (_, args) => {

    const partnerInstance = new Partner();

    try {
        const response = await partnerInstance.pause(args);
        return response;
    } catch (error) {
        console.error(error);
        return { status: "error", message: error.message };
    }
});

ipcMain.handle('resume-partner', async (_, args) => {

    const partnerInstance = new Partner();

    try {
        const response = await partnerInstance.resume(args);
        return response;
    } catch (error) {
        console.error(error);
        return { status: "error", message: error.message };
    }
});

ipcMain.handle('cancel-partner', async (_, args) => {

    const partnerInstance = new Partner();

    try {
        const response = await partnerInstance.cancel(args);
        return response;
    } catch (error) {
        console.error(error);
        return { status: "error", message: error.message };
    }
});

class Partner {
    constructor(parameters) { }

    add(e) {
        const { name, address, collect, neighborhood, contact, date } = e;
        const id = generateId()

        const sql = 'INSERT INTO partner (id, name, address, collect, neighborhood, contact, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

        return new Promise((resolve, reject) => {
            db.run(sql, [id, name, address, collect, neighborhood, contact, date, 'active'], function (err) {
                if (err) {
                    reject(err.message);
                } else {
                    resolve({ changes: this.changes, status: "success", partner: e });
                }
            });
        });
    }

    pause(id) {
        const sql = 'UPDATE partner SET status = ? WHERE id = ?';
        const newStatus = 'pause';

        return new Promise((resolve, reject) => {
            db.run(sql, [newStatus, id], function (err) {
                if (err) {
                    reject(err.message);
                } else {
                    resolve({ changes: this.changes, status: "success" });
                }
            });
        });
    }

    resume(id) {
        const sql = 'UPDATE partner SET status = ? WHERE id = ?';
        const newStatus = 'active';

        return new Promise((resolve, reject) => {
            db.run(sql, [newStatus, id], function (err) {
                if (err) {
                    reject(err.message);
                } else {
                    resolve({ changes: this.changes, status: "success" });
                }
            });
        });
    }

    cancel(partner) {
        const sqlDeletePartner = 'DELETE FROM partner WHERE id = ?';
        const sqlDeletePayments = 'DELETE FROM payments WHERE partner_id = ?';

        const { id } = partner

        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                db.run(sqlDeletePayments, [id], function (err) {
                    if (err) {
                        db.run('ROLLBACK');
                        return reject(err.message);
                    }

                    db.run(sqlDeletePartner, [id], function (err) {
                        if (err) {
                            db.run('ROLLBACK');
                            reject(err.message);
                        } else {
                            db.run('COMMIT');
                            resolve({ changes: this.changes, status: "success", partner });
                        }
                    });
                });
            });
        });
    }
}