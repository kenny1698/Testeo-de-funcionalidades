import { MongoClient } from 'mongodb'

import ContenedorArchivo from '../../contenedores/ContenedorArchivo.js';
import ContenedorMemoria from '../../contenedores/ContenedorMemoria.js'
import ContenedorSQL from '../../contenedores/ContenedorSQL.js'
import ContenedorMongoDb from '../../contenedores/contenedorMongoDb.js';

import config from '../../config.js'

import { PERSISTENCIA_AUTH, RUTA_AUTH } from '../../config.js'

let authDao
switch (PERSISTENCIA_AUTH) {
    case 'FILE':
        authDao = new ContenedorArchivo(RUTA_AUTH)
        break
    case 'SQL':
        authDao = new ContenedorSQL()
        break
    case 'MONGO':
        const uri = config.mongoRemote.cnxStr;
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        await client.connect()
        const dbauth = client.db("proyectoProductosMensajes").collection("user")
        authDao = new ContenedorMongoDb(dbauth)
        break
    default:
        authDao = new ContenedorMemoria()
}

export function getauthDao() {
    return authDao
}
