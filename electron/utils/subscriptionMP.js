const { ipcMain } = require('electron/main');
const mercadopago = require('mercadopago');

let appConfig;
try {
    appConfig = require('../config');
} catch {
    throw new Error('Falta electron/config.js. Copiá electron/config.example.js a electron/config.js y completá el token de Mercado Pago.');
}

const TOKEN = appConfig.mercadoPagoToken;

const config = new mercadopago.MercadoPagoConfig({
    accessToken: TOKEN
})

const preApproval = new mercadopago.PreApprovalPlan(config);
const preApprovalClient = new mercadopago.PreApproval(config);

function toErrorResponse(error) {
    return { status: 'error', message: typeof error === 'string' ? error : error.message }
}

ipcMain.handle('get-plans', async () => {
    try {
        return await getPlans();
    } catch (error) {
        console.error('Error obteniendo planes:', error);
        return toErrorResponse(error)
    }
})

ipcMain.handle('get-subscribers', async (_, e) => {
    try {
        return await getSubscribers(e);
    } catch (error) {
        console.error('Error obteniendo suscriptores:', error);
        return toErrorResponse(error)
    }
})

ipcMain.handle('get-subscriber-detail', async (_, id) => {
    try {
        return await getSubscriberDetail(id);
    } catch (error) {
        console.error('Error obteniendo detalle del suscriptor:', error);
        return toErrorResponse(error)
    }
})

ipcMain.handle('update-subscriber-amount', async (_, { id, newAmount }) => {
    try {
        return await updateSubscriberAmount(id, newAmount);
    } catch (error) {
        console.error('Error actualizando monto:', error);
        return toErrorResponse(error)
    }
})

ipcMain.handle('pause-subscriber', async (_, { id }) => {
    try {
        return await pauseSubscriber(id);
    } catch (error) {
        console.error('Error pausando suscriptor:', error);
        return toErrorResponse(error)
    }
})

ipcMain.handle('resume-subscriber', async (_, { id }) => {
    try {
        return await resumeSubscriber(id);
    } catch (error) {
        console.error('Error reactivando suscriptor:', error);
        return toErrorResponse(error)
    }
})

ipcMain.handle('cancel-subscriber', async (_, { id }) => {
    try {
        return await cancelSubscriber(id);
    } catch (error) {
        console.error('Error cancelando suscriptor:', error);
        return toErrorResponse(error)
    }
})

async function getPlans() {
    const response = await preApproval.search({
        options: {
            limit: 90,
            offset: 0,
            status: 'active',
            q: 'tobiassanrafael',
        }
    });

    return response.results;
}

async function getSubscribers({ id, status, offset }) {
    const response = await preApprovalClient.search({
        options: {
            preapproval_plan_id: id,
            status,
            limit: status == 'authorized' ? 10 : 90,
            offset,
            sort: 'payer_first_name:asc'
        }
    })

    return response.results
}

async function getSubscriberDetail(id) {
    return await preApprovalClient.get({ id })
}

async function cancelSubscriber(id) {
    return await preApprovalClient.update({
        id,
        body: {
            status: "cancelled"
        }
    });
}

async function pauseSubscriber(id) {
    return await preApprovalClient.update({
        id,
        body: {
            status: "paused"
        }
    });
}

async function resumeSubscriber(id) {
    return await preApprovalClient.update({
        id,
        body: {
            status: "authorized"
        }
    });
}

async function updateSubscriberAmount(id, newAmount) {
    return await preApprovalClient.update({
        id,
        body: {
            auto_recurring: {
                transaction_amount: newAmount
            }
        }
    });
}
