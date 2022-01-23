import { MongoClient } from 'mongodb'

import ContenedorArchivo from '../../contenedores/ContenedorArchivo.js';
import ContenedorMemoria from '../../contenedores/ContenedorMemoria.js'
import ContenedorSQL from '../../contenedores/ContenedorSQL.js'
import ContenedorMongoDb from '../../contenedores/contenedorMongoDb.js';

import config from '../../config.js'

import { PERSISTENCIA_MENSAJES, RUTA_MENSAJES } from '../../config.js'

let mensajesDao
switch (PERSISTENCIA_MENSAJES) {
    case 'FILE':
        mensajesDao = new ContenedorArchivo(RUTA_MENSAJES)
        break
    case 'SQL':
        mensajesDao = new ContenedorSQL()
        break
    case 'MONGO':
        const uri = config.mongoRemote.cnxStr;
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect()
        const dbMensajes = client.db("chat").collection("mensajes");
        mensajesDao = new ContenedorMongoDb(dbMensajes)
        break
    default:
        mensajesDao = new ContenedorMemoria()
}

export function getMensajesDao() {
    return mensajesDao
}
