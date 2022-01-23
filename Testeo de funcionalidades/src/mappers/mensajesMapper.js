import Mensaje from '../modelos/Mensaje.js'
import Autor from '../modelos/Autor.js'

export function asViewModel(mensaje) {
    const viewModel = {
        author: {
            email: mensaje.author.email,
            nombre: mensaje.author.nombre,
            apellido: mensaje.author.apellido,
            edad: mensaje.author.edad,
            alias: mensaje.author.alias,
            avatar: mensaje.author.avatar
        },
        text: mensaje.text,
        fyh: mensaje.fyh,
        id: mensaje.id
    }
    return viewModel
}

export function asViewModels(models) {
    const viewModels = models.map(asViewModel)
    return viewModels
}

export function asModel(datos) {
    const author = new Autor(datos.author)
    const mensaje = new Mensaje({ ...datos, author })
    return mensaje
}

export function asModels(datos) {
    const mensajes = datos.map(d => asModel(d))
    return mensajes
}

export function asDto(mensaje) {
    const dto = {
        author: {
            email: mensaje.author.email,
            nombre: mensaje.author.nombre,
            apellido: mensaje.author.apellido,
            edad: mensaje.author.edad,
            alias: mensaje.author.alias,
            avatar: mensaje.author.avatar
        },
        text: mensaje.text,
        fyh: mensaje.fyh,
        id: mensaje.id
    }
    return dto
}
export function asDtos(mensajes) {
    const dtos = mensajes.map(d => asDto(d))
    return dtos
}