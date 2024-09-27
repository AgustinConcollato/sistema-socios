export const formatDate = (date) => {

    if (!date) return '--'

    return new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
}