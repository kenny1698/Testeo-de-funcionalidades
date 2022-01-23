import config from '../../config.js'
import { Router } from 'express'
import path from 'path'

import {
  createHash,
  isValidPassword
} from '../middleware/utils.js'

import authApi from '../../api/auth.js'

import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

const authWebRouter = new Router()

const newUser = {}

//dotenv.config({ path: "../.env"})

//mongoose.connect(process.env.MONGODB_LOCAL)

passport.use('login', new LocalStrategy(
  (username, password, done) => {
    //return User.findOne({ username })
    return buscarUser(username)
      .then(user => {
        if (!user.length) {
          return done(null, false, { message: 'Usuario de usuario incorrecto' })
        }

        if (!isValidPassword(user[0].password, password)) {
          return done(null, false, { message: 'Contraseña incorrecta' })
        }        

        user = user[0]

        return done(null, user)
      })
      .catch(err => {
        return done(err)
      })
  }
))

passport.use('register', new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, done) => {
  //return User.findOne({ username })
  return buscarUser(username)
    .then(user => {
      if (user.length) {
        return done(null, false, { message: 'El usuario de usuario ya existe' })
      }
       
      
      
      // let pass = createHash(password)
       
       newUser.password = createHash(password)
       newUser.username = req.body.username
      user = newUser
       
      return authApi.guardar(newUser)
    })
    .then(user => {
      user = newUser
      console.log(user)
      return done(null, user)
    })
    .catch(err => {
      return done(err)
    })
}))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

authWebRouter.get('/login', (req, res) => {
  if (req.isAuthenticated()) {    
    res.redirect('/')
  } else {
    res.render('login')
  }
})

authWebRouter.post('/login',
  passport.authenticate('login', { successRedirect: '/',
                                   failureRedirect: '/faillogin',
                                   failureFlash: true })
)

authWebRouter.get('/faillogin', (req, res) => {
  return res.render('faillogin', { message: req.flash('error') })
})

authWebRouter.post('/logout', (req, res) => {
  const nombreSesion = req.user.username
  req.logout()
  res.render('logout', {nombreSesion ,
    specs: config.getSpecs(),
  }) 
})

authWebRouter.get('/register', (req, res) => {
  return res.render('register')
})

authWebRouter.post('/register', 
  passport.authenticate('register', { successRedirect: '/',
                                   failureRedirect: '/failregister',
                                   failureFlash: true })
)

authWebRouter.get('/failregister', (req, res) => {
return res.render('failregister', { message: req.flash('error') })
})


async function buscarUser(username) {
  try {
      const user = await authApi.listarAll()  
      const result = user.filter(obj => obj.username == username)
      return result
  } catch (error) {
      return []
  }
}
export default authWebRouter
