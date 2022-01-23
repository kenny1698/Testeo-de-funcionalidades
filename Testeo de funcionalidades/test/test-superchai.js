import supertest from 'supertest'
import { expect } from 'chai'
import cluster from 'cluster'
import { cpus } from 'os'

import { createServer } from '../src/server.js'
import config from '../src/config.js'
import { generar } from './generador/productos.js'

let request
let server
let connectedServer
let producto
const idElem = 5

describe('test api rest full', () => {

    before(async function () {
    //     await connectDb()
          await startServer()
         request = supertest(`http://localhost:${config.PORT}/api/productos`)
         producto = generar()
     })

     after(function () {
    //     mongoose.disconnect()
        connectedServer.close()
     })

    describe('GET', () => {
        it('debería retornar un status 200', async () => {
            const response = await request.get('/')
            expect(response.status).to.eql(200)
        })
    })

    describe('POST', () => {
        it('debería incorporar un producto', async () => {
            
            const response = await request.post('/').send(producto)
            expect(response.status).to.eql(200)
            const prod = response.body
            expect(prod).to.include.keys('title', 'price', 'thumbnail')
            expect(prod.title).to.eql(producto.title)
            expect(prod.price).to.eql(producto.price)
            expect(prod.thumbnail).to.eql(producto.thumbnail)
        })
    })
    describe('PUT', () => {
        it('debería actualizar un producto', async () => {
            
            const response = await request.put('/'+idElem).send(producto)
            expect(response.status).to.eql(200)
            const prod = response.body
            expect(prod).to.include.keys('title', 'price', 'thumbnail')
            expect(prod.title).to.eql(producto.title)
            expect(prod.price).to.eql(producto.price)
            expect(prod.thumbnail).to.eql(producto.thumbnail)
        })
    })
    describe('DELETE', () => {
        it('debería borrar un producto', async () => {
            const response = await request.delete('/'+idElem)
            expect(response.status).to.eql(200)
        })
    })
})

async function startServer() {
    if (config.mode == 'CLUSTER' && cluster.isMaster) {

        const numCPUs = cpus().length
        console.log(`Número de procesadores: ${numCPUs}`)
        console.log(`PID MASTER ${process.pid}`)
    
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }
    
        cluster.on('exit', worker => {
            console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
            cluster.fork()
        })
    
    } else {
    
        process.on('exit', code => {
            console.log('Salida con código de error: ' + code)
        })
    
        const app = createServer()
        try {
            connectedServer = await app.listen(config.PORT)
            console.log(`proceso #${process.pid} escuchando en el puerto ${connectedServer.address().port}`)
        } catch (error) {
            console.log(`Error en servidor ${error}`)
        }
    }
}