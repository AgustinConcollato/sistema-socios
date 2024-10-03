const { contextBridge, ipcRenderer } = require("electron/renderer")

ipcRenderer.setMaxListeners(20)

contextBridge.exposeInMainWorld('electronAPI', {

    //////////////////// acciones Mercado Pago

    getPlans: () => ipcRenderer.invoke('get-plans', true),
    getSubscribers: (e) => ipcRenderer.invoke('get-subscribers', e),
    getSubscriberDetail: (e) => ipcRenderer.invoke('get-subscriber-detail', e),
    pauseSubscriber: (e) => ipcRenderer.invoke('pause-subscriber', e),
    resumeSubscriber: (e) => ipcRenderer.invoke('resume-subscriber', e),

    ///////////////////// obtener info socios fuera de Mercado Pago

    getPartnerPayments: (e) => ipcRenderer.invoke('get-partner-payments', e),
    getPartners: (e) => ipcRenderer.invoke('get-partner', e),

    //////////////////// acciones socios fuera de Mercado Pago

    addPartner: (e) => ipcRenderer.invoke('add-partner', e),
    pausePartner: (e) => ipcRenderer.invoke('pause-partner', e),
    resumePartner: (e) => ipcRenderer.invoke('resume-partner', e),
    cancelPartner: (e) => ipcRenderer.invoke('cancel-partner', e),
    addPartnerPayment: (e) => ipcRenderer.invoke('add-payment', e),

    //////////////////// abrir nuevas ventanas

    openViewAddPartner: () => ipcRenderer.send('open-view-add-partner'),
    openViewSubscribedDetail: (e) => ipcRenderer.send('open-view-subscriber-detail', e),
    openViewEditAmount: (e) => ipcRenderer.send('open-view-edit-amount', e),
    openViewPauseSubscriber: (e) => ipcRenderer.send('open-view-pause-subscriber', e),
    openViewResumeSubscriber: (e) => ipcRenderer.send('open-view-resume-subscriber', e),
    openViewCancelPartner: (e) => ipcRenderer.send('open-view-cancel-partner', e),

    //////////////////// 

    onReceiveSubscriberId: (e) => ipcRenderer.on('send-subscriber-id', e),
    onReceivePartner: (e) => ipcRenderer.on('send-partner', e),

    //////////////////// actualizar vistas

    updateSubscriberAmount: (e) => ipcRenderer.invoke('update-subscriber-amount', e),
    updateViewSubscribedDetail: (e) => ipcRenderer.on('update-view-subscribed-detail', e),
    updatePartnerList: (e) => {
        ipcRenderer.removeAllListeners('update-partner-list');
        ipcRenderer.on('update-partner-list', e);
    },

    //////////////////// no se --- ayuda actualizar cosas en las vistas -- lo m

    notifySubscriberDetailUpdate: (e) => ipcRenderer.send('subscriber-detail-updated', e),
    notifyPartnerListUpdate: (e) => ipcRenderer.send('partner-list-update', e),


    /////////////////// generar pdf --- planillas

    generatePDF: (e) => ipcRenderer.invoke('payment-sheet', e)
})