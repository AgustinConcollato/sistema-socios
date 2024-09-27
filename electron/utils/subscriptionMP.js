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

ipcMain.handle('get-subscribers', async (_, id) => {
    try {
        const subs = await getSubscribers(id);
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

async function getSubscribers(id) {
    try {
        const response = await preApprovalClient.search({
            options: {
                preapproval_plan_id: id
            }
        })

        const results = response.results

        // results.id <---- este id es el que se utiliza para obtener el detalle, cancelar, pauser y reanudar a un suscriptor  
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
            status: "cancelled"
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
            status: "paused"
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
            status: "authorized" // o "active", dependiendo del flujo de pago
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
