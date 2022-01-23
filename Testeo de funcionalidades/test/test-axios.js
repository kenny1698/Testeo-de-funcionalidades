import axios from 'axios'
import cluster from 'cluster'
import { cpus } from 'os'

import { createServer } from '../src/server.js'
import config from '../src/config.js'
import { generar } from './generador/productos.js'

let request
let server
let connectedServer
let producto
let idElem = 18


await startServer()
request = `http://localhost:${config.PORT}/api/productos`
producto = generar()

axios.get(request)
    .then(function (response) {
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error)
    })
// axios.post(request, producto)
//     .then(function (response) {
//         console.log(response.data)
//     })
//     .catch(function (error) {
//         console.log(error)
//     })
axios.put(request + '/' +  idElem, producto)
    .then(function (response) {
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error)
    })
axios.delete(request + '/' +  parseInt(idElem))
    .then(function (response) {
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error)
    })
    .then(function(){
        connectedServer.close()
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