import faker from 'faker'

faker.locale = 'es'

const getProductos = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        thumbnail: faker.random.image()
    }
}


export default getProductos
