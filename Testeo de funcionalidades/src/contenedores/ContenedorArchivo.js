import { promises as fs } from 'fs'

class ContenedorArchivo {
  constructor(ruta) {
    this.ruta = ruta
  }

  async listar(id) {
    const elems = await this.listarAll()
    const buscado = elems.find(e => e.idElem == id)
    if (!buscado) {
      throw new Error('Error al listar por id: no encontrado')
    } else {
      return buscado
    }
  }

  async listarAll() {
    try {
      const elems = await fs.readFile(this.ruta, 'utf-8')
      return JSON.parse(elems)
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Error al parsear ${this.ruta} como JSON:

       ${error.message}`)
        } else {
          return []
        }
      }
  }

  async guardar(newElem) {
    const elems = await this.listarAll()
    newElem.idElem = elems.length + 1
    if (await this.listar(newElem.idElem))
      newElem.idElem =  newElem.idElem + 1
    elems.push(newElem)
    try {
      await fs.writeFile(this.ruta, JSON.stringify(elems, null, 2))
      return newElem
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`)
    }
  }

  async actualizar(id, elem) {
    elem.idElem = id
    const elems = await this.listarAll()
    const index = elems.findIndex(e => e.idElem == id)
    if (index == -1) {
      throw new Error(`Error al actualizar: no se encontró el id ${id}`)
    } else {      
      elems[index] = elem
      elems[index].idElem = parseInt(id)
      try {
        await fs.writeFile(this.ruta, JSON.stringify(elems, null, 2))
        return elem
      } catch (error) {
        throw new Error(`Error al actualizar: ${error}`)
      }
    }
  }

  async borrar(id) {
    const elems = await this.listarAll()
    const index = elems.findIndex(e => e.idElem == parseInt(id))
    if (index == -1) {
      throw new Error(`Error al borrar: no se encontró el id ${id}`)
    }

    elems.splice(index, 1)
    try {
      await fs.writeFile(this.ruta, JSON.stringify(elems, null, 2))
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`)
    }
  }

  async borrarAll() {
    try {
      await fs.writeFile(this.ruta, JSON.stringify([], null, 2))
    } catch (error) {
      throw new Error(`Error al borrar todo: ${error}`)
    }
  }
}

export default ContenedorArchivo
