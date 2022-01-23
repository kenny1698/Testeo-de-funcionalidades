import { MongoClient } from 'mongodb'

import ContenedorArchivo from '../../contenedores/ContenedorArchivo.js'
import ContenedorMemoria from '../../contenedores/ContenedorMemoria.js'
import ContenedorSQL from '../../contenedores/ContenedorSQL.js'
import ContenedorMongoDb from '../../contenedores/contenedorMongoDb.js'

import { PERSISTENCIA_PRODUCTOS, RUTA_PRODUCTOS } from '../../config.js'

import config from '../../config.js'

let productosDao
switch (PERSISTENCIA_PRODUCTOS) {
    case 'FILE':
        productosDao = new ContenedorArchivo(RUTA_PRODUCTOS)
        break
    case 'SQL':
        productosDao = new ContenedorSQL(config.mariaDb, 'productos')
        break
    case 'MONGO':
        const uri = config.mongoRemote.cnxStr
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        await client.connect()
        const dbproductos = client.db("proyectoProductosMensajes").collection("productos")
        productosDao = new ContenedorMongoDb(dbproductos)
        break
    default:
        productosDao = new ContenedorMemoria()
}

export function getProductosDao() {
    return productosDao
}
