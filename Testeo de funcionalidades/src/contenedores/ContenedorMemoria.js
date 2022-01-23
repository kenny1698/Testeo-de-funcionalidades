class ContenedorMemoria {
  constructor() {
    this.elementos = []
  }

  listar(id) {
    const elem = this.elementos.find(elem => elem.idElem == id)
    if (!elem) {
      throw new Error('Error al listar por id: no encontrado')
    } else {
      return elem
    }
  }

  listarAll() {
    return [...this.elementos]
  }

  guardar(newElem) {
    const elems = this.elementos
    newElem.idElem = elems.length + 1
    if (this.listar(newElem.idElem))
      newElem.idElem =  newElem.idElem + 1
    this.elementos.push(newElem)
    return newElem
  }

  actualizar(id, newElem) {
    newElem.idElem = id
    const index = this.elementos.findIndex(p => p.idElem == id)
    if (index == -1) {
      throw new Error(`Error al actualizar: no se encontró el id ${id}`)
    } else {
      this.elementos[index] = newElem
      return newElem
    }
  }

  borrar(id) {
    const index = this.elementos.findIndex(elem => elem.idElem == id)
    if (index == -1) {
      throw new Error(`Error al borrar: no se encontró el id ${id}`)
    } else {
      return this.elementos.splice(index, 1)
    }
  }

  borrarAll() {
    this.elementos = []
  }
}

export default ContenedorMemoria
