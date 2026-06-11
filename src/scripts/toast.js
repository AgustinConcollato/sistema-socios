function showToast(message, type = 'success') {
    Toastify({
        text: message,
        duration: type === 'error' ? 4000 : 2000,
        close: true,
        gravity: "bottom",
        position: "left",
        stopOnFocus: true,
        style: {
            background: type === 'error' ? 'var(--color-danger, #c0392b)' : '#000000cc',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            boxShadow: 'none'
        },
    }).showToast();
}
