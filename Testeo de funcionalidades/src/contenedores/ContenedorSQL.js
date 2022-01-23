import knex from 'knex'

class ContenedorSQL {

    constructor(config, tabla) {
        this.knex = knex(config)
        this.tabla = tabla
    }

    async listar(id) {
        try {
            return this.knex.select('*').from(this.tabla).where('idElem', id)
        } catch (error) {
            throw new Error(`Error al listar por id: ${error}`)
        }
    }

    async listarAll() {
        try {
            return this.knex.select('*').from(this.tabla)
        } catch (error) {
            throw new Error(`Error al listar todo: ${error}`)
        }
    }

    async guardar(newElem) {
        try {
            const elems = await this.listarAll()
            newElem.idElem = elems.length + 1
            if (await this.listar(newElem.idElem))
                newElem.idElem =  newElem.idElem + 1
            return this.knex.insert(newElem).into(this.tabla)
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }
    }

    async actualizar(id, elem) {
        elem.idElem = id
        try {
            return this.knex.from(this.tabla).where('idElem', id).update(elem)
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }



    async borrar(id) {
        try {
            return this.knex.delete().from(this.tabla).where('idElem', id)
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }

    async borrarAll() {
        try {
            return this.knex.delete().from(this.tabla)
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }

    async desconectar() {
        await this.knex.destroy();
    }
}

export default ContenedorSQL