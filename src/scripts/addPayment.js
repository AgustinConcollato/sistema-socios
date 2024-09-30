const addPayment = ({ id, e }) => {
    const formData = new FormData(e.target)

    const formObject = {
        id,
        data: new Date().getTime()
    }

    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    window.electronAPI.addPartnerPayment(formObject)
}