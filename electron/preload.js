const { contextBridge, ipcRenderer } = require("electron/renderer")

ipcRenderer.setMaxListeners(20)

contextBridge.exposeInMainWorld('electronAPI', {
    getPlans: () => ipcRenderer.invoke('get-plans', true),
    getSubscribers: (e) => ipcRenderer.invoke('get-subscribers', e),
    addPartner: (e) => ipcRenderer.invoke('add-partner', e),
    getPartners: (e) => ipcRenderer.invoke('get-partner', e),
    getSubscriberDetail: (e) => ipcRenderer.invoke('get-subscriber-detail', e),
    openViewAddPartner: () => ipcRenderer.send('open-view-add-partner'),
    openViewSubscribedDetail: (e) => ipcRenderer.send('open-view-subscriber-detail', e),
    onReceiveSubscriberId: (e) => ipcRenderer.on('send-subscriber-id', e),
    openViewEditAmount: (e) => ipcRenderer.send('open-view-edit-amount', e),
    updateSubscriberAmount: (e) => ipcRenderer.invoke('update-subscriber-amount', e),
    updateViewSubscribedDetail: (e) => ipcRenderer.on('update-view-subscribed-detail', e),
    updatePartnerList: (e) => {
        ipcRenderer.removeAllListeners('update-partner-list');
        ipcRenderer.on('update-partner-list', e);
    },
    notifySubscriberDetailUpdate: (e) => ipcRenderer.send('subscriber-detail-updated', e),
    notifyPartnerListUpdate: (e) => ipcRenderer.send('partner-list-update', e)
})