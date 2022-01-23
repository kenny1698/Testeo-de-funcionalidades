import faker from 'faker'

faker.locale = 'es'

const getProductos = () => {
    return {
        nombre: faker.commerce.productName(),
        precio: faker.commerce.price(),
        url: faker.random.image()
    }
}

export default getProductos 