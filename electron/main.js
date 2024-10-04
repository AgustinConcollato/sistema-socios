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

        subscriberDetail.loadFile('./src/pages/subscriberDetail.html')
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

        editAmount.loadFile('./src/pages/editAmount.html')
            .then(() => {
                editAmount.webContents.send('send-subscriber-id', e);
            });

    });

    ipcMain.on('open-view-pause-subscriber', (_, e) => {
        const pauseSubscriber = new BrowserWindow({
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

        pauseSubscriber.loadFile('./src/pages/pauseSubscriber.html')
            .then(() => {
                pauseSubscriber.webContents.send('send-subscriber-id', e);
            });
    });

    ipcMain.on('open-view-resume-subscriber', (_, e) => {
        const resumeSubscriber = new BrowserWindow({
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

        resumeSubscriber.loadFile('./src/pages/resumeSubscriber.html')
            .then(() => {
                resumeSubscriber.webContents.send('send-subscriber-id', e);
            });
    });

    ipcMain.on('open-view-cancel-partner', (_, e) => {
        const resumeSubscriber = new BrowserWindow({
            width: 600,
            height: 350,
            minWidth: 600,
            minHeight: 350,
            modal: true,
            minimizable: false,
            fullscreenable: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            },
        });

        resumeSubscriber.loadFile('./src/pages/cancelPartner.html')
            .then(() => {
                resumeSubscriber.webContents.send('send-partner', e);
            });
    });

    ipcMain.on('subscriber-detail-updated', (_, newData) => {
        subscriberDetail.webContents.send('update-view-subscribed-detail', newData);
    });

    ipcMain.on('partner-list-update', (_, e) => {
        win.webContents.send('update-partner-list', e.collect);
    });

    ipcMain.on('open-view-payment-sheet', (_, e) => {
        const paymentSheet = new BrowserWindow({
            width: 1100,
            height: 700,
            minWidth: 1100,
            minHeight: 700,
            modal: true,
            fullscreenable: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            },
        });

        paymentSheet.loadFile('./src/pages/partnerPaymentSheet.html')
            .then(() => {
                paymentSheet.webContents.send('send-partner', e);
            });
    })
}

app.on('ready', () => {
    createWindow()
    require('./utils/database')
    require('./utils/partner')
    require('./utils/getPartner')
    require('./utils/getPartnerPayments')
    require('./utils/addPayment')
    require('./utils/subscriptionMP')
    require('./utils/generatePDF')
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

