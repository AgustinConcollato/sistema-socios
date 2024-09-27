import { generateId } from '../../../electron/utils/generateId.js';

const FORM_ADD_PARTNET = document.getElementById('form-add-partner');

FORM_ADD_PARTNET.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = {
        id: generateId(),
        date: new Date().getTime()
    };

    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    try {
        const response = await window.electronAPI.addPartner(formObject);
        if (response.status === 'success') {
            window.electronAPI.notifyPartnerListUpdate(response.partner);
            window.close();
        }

    } catch (error) {
        console.error('Error adding partner:', error);
    }
})