const addPayment = ({ id, e }) => {
    const selectedMonth = document.getElementById('months-payment').value
    const formData = new FormData(e.target)
    const selectedDate = new Date()
    const currentdate = new Date()

    let data = currentdate.getTime()

    if (currentdate.getMonth() != selectedMonth) {
        selectedDate.setMonth(parseInt(selectedMonth))
        selectedDate.setDate(1)
        selectedDate.setHours(0, 0, 0, 0)

        data = selectedDate
    }

    const formObject = { id, data }

    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    window.electronAPI.addPartnerPayment(formObject)
}