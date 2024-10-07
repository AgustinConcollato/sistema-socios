const { ipcMain } = require('electron/main');
const mercadopago = require('mercadopago');

const TOKEN = '...'

const config = new mercadopago.MercadoPagoConfig({
    accessToken: TOKEN
})

const preApproval = new mercadopago.PreApprovalPlan(config);
const preApprovalClient = new mercadopago.PreApproval(config);

ipcMain.handle('get-plans', async () => {
    try {
        const plans = await getPlans();
        return plans
    } catch (error) {
        console.error('Error obteniendo planes:', error);
    }
})

ipcMain.handle('get-subscribers', async (_, e) => {
    try {
        const subs = await getSubscribers(e);
        return subs
    } catch (error) {
        console.error('Error obteniendo planes:', error);
    }
})

ipcMain.handle('get-subscriber-detail', async (_, id) => {
    try {
        const sub = await getSubscriberDetail(id);
        return sub
    } catch (error) {
        console.error('Error obteniendo planes:', error);
    }
})

ipcMain.handle('update-subscriber-amount', async (_, { id, newAmount }) => {
    try {
        const response = await updateSubscriberAmount(id, newAmount);
        return response
    } catch (error) {
        console.error('Error obteniendo planes:', error);
    }
})

ipcMain.handle('pause-subscriber', async (_, { id }) => {
    try {
        const response = await pauseSubscriber(id);
        return response
    } catch (error) {
        console.error('Error obteniendo planes:', error);
    }
})

ipcMain.handle('resume-subscriber', async (_, { id }) => {
    try {
        const response = await resumeSubscriber(id);
        return response
    } catch (error) {
        console.error('Error obteniendo planes:', error);
    }
})

ipcMain.handle('cancel-subscriber', async (_, { id }) => {
    try {
        const response = await cancelSubscriber(id);
        return response
    } catch (error) {
        console.error('Error obteniendo planes:', error);
    }
})

async function getPlans() {
    try {
        const response = await preApproval.search({
            options: {
                limit: 90,
                offset: 0,
                status: 'active',
                q: 'plan_prueba', // cambiar a la referencia seleccionada
                // q: 'tobiassanrafael', // cambiar a la referencia seleccionada
            }
        });

        return response.results;

    } catch (error) {
        console.log(error);
    }
}

async function getSubscribers({ id, status, offset }) {
    try {
        const response = await preApprovalClient.search({
            options: {
                preapproval_plan_id: id,
                status,
                limit: status == 'authorized' ? 10 : 90,
                offset,
                sort: 'payer_first_name:asc'
            }
        })

        const results = response.results

        return results
    } catch (error) {
        console.log(error);
    }
}

async function getSubscriberDetail(id) {
    try {
        const subscriber = await preApprovalClient.get({ id })
        return subscriber
    } catch (error) {
        console.log(error);
    }
}

async function cancelSubscriber(id) {
    try {
        const response = await preApprovalClient.update({
            id,
            body: {
                status: "cancelled"
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

async function pauseSubscriber(id) {
    try {
        const response = await preApprovalClient.update({
            id,
            body: {
                status: "paused"
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

async function resumeSubscriber(id) {
    try {
        const response = await preApprovalClient.update({
            id,
            body: {
                status: "authorized"
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

async function updateSubscriberAmount(id, newAmount) {
    try {
        const response = await preApprovalClient.update({
            id,
            body: {
                auto_recurring: {
                    transaction_amount: newAmount
                }
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}
