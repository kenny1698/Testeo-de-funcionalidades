import express from 'express'
import session from 'express-session'
import passport from 'passport'
import compression from 'compression'
import flash from 'connect-flash'

import config from './config.js'

import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'
import handlebars from 'express-handlebars'

import authWebRouter from './routers/web/auth.js'
import homeWebRouter from './routers/web/home.js'
import productosApiRouter from './routers/api/productos.js'
import randomsApiRouter from './routers/api/randoms.js'

import addProductosHandlers from './routers/ws/productos.js'
import addMensajesHandlers from './routers/ws/mensajes.js'

import { logInfo, logError, logWarning } from './loggers/index.js'
import path from 'path'

function createServer() {

    //--------------------------------------------
    // instancio servidor, socket y api

    const app = express()
    const httpServer = new HttpServer(app)
    const io = new Socket(httpServer)

    //--------------------------------------------
    // configuro el socket

    io.on('connection', async socket => {
        // console.log('Nuevo cliente conectado!')
        addProductosHandlers(socket, io.sockets)
        addMensajesHandlers(socket, io.sockets)
    })

    //--------------------------------------------
    // configuro el servidor
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use(express.static(path.join(process.cwd(), './public')))
    //app.use(express.static('public/js'))

    app.engine(
        "hbs",
        handlebars({
            extname: ".hbs",
            defaultLayout: "index"
        })
    )
    
    app.set('views', path.join(process.cwd(),'./public/views'))
    app.set('view engine', 'hbs')

    app.use(session(config.session))

    app.use(passport.initialize())
    app.use(passport.session())

    app.use(compression())
    app.use(flash())

    //--------------------------------------------
    // logging general

    app.use((req, res, next) => {
        logInfo(`${req.method} ${req.url}`)
        next()
    })

    //--------------------------------------------
    // rutas del servidor API REST

    app.use('/api', productosApiRouter)
    app.use('/api', randomsApiRouter)

    //--------------------------------------------
    // rutas del servidor web

    app.use(authWebRouter)
    app.use(homeWebRouter)

    //--------------------------------------------
    // logging casos no manejados

    app.use('*', (req, res, next) => {
        logWarning(`${req.method} ${req.originalUrl} - ruta inexistente!`)
        next()
    })

    //--------------------------------------------

    return {
        listen: port => new Promise((resolve, reject) => {
            const connectedServer = httpServer.listen(port, () => {
                resolve(connectedServer)
            })
            connectedServer.on('error', error => {
                reject(error)
            })
        })
    }
}

export { createServer }

