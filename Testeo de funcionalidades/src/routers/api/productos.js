import { Router } from 'express'
import { createNFakeProducts } from '../../mocks/productos.js'
import { logError } from '../../loggers/index.js'
import productosApi from '../../api/productos.js'

const productosApiRouter = new Router()

productosApiRouter.get('/productos-test', (req, res, next) => {
    try {
        res.json(createNFakeProducts(5))
    } catch (error) {
        logError(error.message)
        res.status(500).json({ error: error.message })
    }
})

productosApiRouter.get('/productos', async (req, res, next) => {
    try {
        const productos = await productosApi.listarAll()
        res.json(productos)
    } catch (error) {
        logError(error.message)
        res.json([])       
    }
})

productosApiRouter.post('/productos', async (req, res, next) => {
    try {
        const producto = req.body
        const result = await productosApi.guardar(producto)
        res.json(result)
    } catch (error) {
        logError(`error al guardar producto:
        ${error.message}`)
        res.json([])
    }
})

productosApiRouter.put('/productos/:id', async (req, res) => {
    try {
        const result = await productosApi.actualizar(req.params.id,req.body)
        res.json(result)
    } catch (error) {
        logError(`error al actualizar producto:
        ${error.message}`)
        res.json([])
    }
})

productosApiRouter.delete('/productos/:id', async (req, res) => {
    try {
        const result = await productosApi.borrar(req.params.id,req.body)
        res.json(result)
    } catch (error) {
        logError(`error al borrar producto:
        ${error.message}`)
        res.json([])
    }
})

productosApiRouter.delete('/productos', async (req, res) => {
    try {
        const productos = await productosApi.borrarAll()
        res.json(productos)
    } catch (error) {
        logError(error.message)
        res.json([])       
    }
})




export default productosApiRouter