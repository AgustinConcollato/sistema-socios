const btnOptionBackup = document.getElementById('btn-option-backup')
const btnBackup = document.getElementById('backup')
const menuBackup = document.getElementById('menu-backup')

let menu = false

btnOptionBackup.onclick = () => {
    menu = !menu
    if (menu) {
        menuBackup.style.display = 'block'
        btnOptionBackup.childNodes[0].classList.remove('fa-ellipsis-vertical')
        btnOptionBackup.childNodes[0].classList.add('fa-xmark')
    } else {
        menuBackup.style.display = 'none'
        btnOptionBackup.childNodes[0].classList.add('fa-ellipsis-vertical')
        btnOptionBackup.childNodes[0].classList.remove('fa-xmark')
    }
}

document.addEventListener('click', (event) => {
    if (!event.target.closest('#btn-option-backup')) {
        menu = false
        menuBackup.style.display = 'none'
        btnOptionBackup.childNodes[0].classList.add('fa-ellipsis-vertical')
        btnOptionBackup.childNodes[0].classList.remove('fa-xmark')
    }
})

btnBackup.onclick = () => window.electronAPI.backup()