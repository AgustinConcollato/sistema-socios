const { contextBridge, ipcRenderer } = require("electron/renderer")

ipcRenderer.setMaxListeners(20)

contextBridge.exposeInMainWorld('electronAPI', {
    getPlans: () => ipcRenderer.invoke('get-plans', true),
    getSubscribers: (e) => ipcRenderer.invoke('get-subscribers', e),
    addPartner: (e) => ipcRenderer.invoke('add-partner', e),
    addPartnerPayment: (e) => ipcRenderer.invoke('add-payment', e),
    getPartners: (e) => ipcRenderer.invoke('get-partner', e),
    getSubscriberDetail: (e) => ipcRenderer.invoke('get-subscriber-detail', e),
    getPartnerPayments: (e) => ipcRenderer.invoke('get-partner-payments', e),
    openViewAddPartner: () => ipcRenderer.send('open-view-add-partner'),
    openViewSubscribedDetail: (e) => ipcRenderer.send('open-view-subscriber-detail', e),
    onReceiveSubscriberId: (e) => ipcRenderer.on('send-subscriber-id', e),
    openViewEditAmount: (e) => ipcRenderer.send('open-view-edit-amount', e),
    openViewPauseSubscriber: (e) => ipcRenderer.send('open-view-pause-subscriber', e),
    openViewResumeSubscriber: (e) => ipcRenderer.send('open-view-resume-subscriber', e),
    updateSubscriberAmount: (e) => ipcRenderer.invoke('update-subscriber-amount', e),
    pauseSubscriber: (e) => ipcRenderer.invoke('pause-subscriber', e),
    resumeSubscriber: (e) => ipcRenderer.invoke('resume-subscriber', e),
    updateViewSubscribedDetail: (e) => ipcRenderer.on('update-view-subscribed-detail', e),
    updatePartnerList: (e) => {
        ipcRenderer.removeAllListeners('update-partner-list');
        ipcRenderer.on('update-partner-list', e);
    },
    notifySubscriberDetailUpdate: (e) => ipcRenderer.send('subscriber-detail-updated', e),
    notifyPartnerListUpdate: (e) => ipcRenderer.send('partner-list-update', e)
})