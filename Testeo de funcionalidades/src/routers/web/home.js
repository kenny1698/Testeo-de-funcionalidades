import { Router } from 'express'
import config from '../../config.js'
import compression from 'compression'

import path from 'path'
import ApiProd from '../../controlador/operaciones.js'
const ApiProductos = new ApiProd()
const productos = ApiProductos.listar()

const homeWebRouter = new Router()

homeWebRouter.get('/', (req, res) => {
  res.redirect('/home')
})

homeWebRouter.get('/home', webAuth, (req, res) => {
  const nombreSesion = req.user.username
  console.log(req.user.username)
  res.render('index', {nombreSesion})
})

homeWebRouter.get('/productos-test', (req, res) => {
  res.render('../plantillas/tabla-productos', {productos});
  
})

homeWebRouter.get('/info', (req, res)=>{
  res.send({specs:config.getSpecs()})
})

function webAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

export default homeWebRouter
