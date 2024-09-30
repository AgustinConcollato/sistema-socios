const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { ipcMain } = require('electron/main');

function createWindow() {
    // Menu.setApplicationMenu(null);   

    const win = new BrowserWindow({
        width: 1366,
        height: 768,
        minWidth: 1366,
        minHeight: 768,
        fullscreenable: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // win.maximize();

    win.loadFile('src/pages/index.html')

    win.on('closed', () => app.quit())

    ipcMain.on('open-view-add-partner', () => {
        const formNewPartner = new BrowserWindow({
            width: 550,
            height: 700,
            parent: win,
            modal: true,
            resizable: false,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            },
        });
        formNewPartner.loadFile('./src/pages/addPartner/addPartner.html');


        formNewPartner.on('closed', () => {
            console.log('Child window closed');
        });
    });

    let subscriberDetail;

    ipcMain.on('open-view-subscriber-detail', (_, e) => {
        subscriberDetail = new BrowserWindow({
            width: 600,
            height: 700,
            minWidth: 600,
            minHeight: 700,
            modal: true,
            fullscreenable: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            },
        });

        subscriberDetail.loadFile('./src/pages/subscriberDetail/subscriberDetail.html')
            .then(() => {
                subscriberDetail.webContents.send('send-subscriber-id', e);
            });

    });

    ipcMain.on('open-view-edit-amount', (_, e) => {
        const editAmount = new BrowserWindow({
            width: 600,
            height: 350,
            minWidth: 600,
            minHeight: 350,
            modal: true,
            parent: subscriberDetail,
            minimizable: false,
            fullscreenable: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            },
        });

        editAmount.loadFile('./src/pages/subscriberDetail/editAmount.html')
            .then(() => {
                editAmount.webContents.send('send-subscriber-id', e);
            });

    });

    ipcMain.on('subscriber-detail-updated', (_, newData) => {
        subscriberDetail.webContents.send('update-view-subscribed-detail', newData);
    });

    ipcMain.on('partner-list-update', (_, e) => {
        console.log(e)
        win.webContents.send('update-partner-list', e.collect);
    });
}



app.on('ready', () => {
    createWindow()
    require('./utils/database')
    require('./utils/addPartner')
    require('./utils/getPartner')
    require('./utils/getPartnerPayments')
    require('./utils/addPayment')
    require('./utils/subscriptionMP')
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

