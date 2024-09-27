
export const generateId = () => {
    const a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const id = []

    for (let i = 0; i < 19; i++) {
        id.push(a.charAt(Math.floor(Math.random() * a.length)))
    }
    return id.join('')
}