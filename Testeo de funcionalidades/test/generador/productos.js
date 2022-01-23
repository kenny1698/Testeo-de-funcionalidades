import faker from 'faker'
faker.locale = 'es'

function generar() {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        thumbnail: faker.image.imageUrl()
    }
}

export {
    generar
}