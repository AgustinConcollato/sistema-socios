const { dialog, ipcMain, app } = require('electron');
const fs = require('fs');
const path = require('path');

ipcMain.on('backup', () => {
    chooseBackupLocation()
})

function chooseBackupLocation() {
    const dbPath = path.join(app.getPath('userData'), 'database.db');

    const date = new Date()

    dialog.showSaveDialog({
        title: 'Guardar copia de seguridad',
        defaultPath: path.join(__dirname, `database_backup_${date.getDate()}_${date.getMonth()+1}_${date.getFullYear()}.db`),
        buttonLabel: 'Guardar copia',
        filters: [{ name: 'SQLite Database', extensions: ['db'] }]
    }).then(file => {
        if (!file.canceled) {
            fs.copyFile(dbPath, file.filePath.toString(), (err) => {
                if (err) {
                    console.error('Error al hacer la copia de seguridad:', err);
                } else {
                    console.log('Copia de seguridad guardada en:', file.filePath);
                }
            });
        }
    }).catch(err => {
        console.error('Error al seleccionar la ubicación:', err);
    });
}
