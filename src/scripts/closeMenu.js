const closeAllMenus = () => {
    document.querySelectorAll('.partner-options').forEach(option => {
        option.style.display = 'none';
    });
    document.querySelectorAll('.btn i').forEach(icon => {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-ellipsis-vertical');
    });
};

document.addEventListener('click', (event) => {
    if (!event.target.closest('.btn') && !event.target.closest('.partner-options')) {
        closeAllMenus();
    }
});