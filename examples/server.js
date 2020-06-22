const express = require('express')
const parser = require('body-parser')
const cookie_parser = require('cookie-parser')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const multipart = require('connect-multiparty')
const path = require('path')
const atob = require('atob')
require('./server2.js')

const app = express()
const router = express.Router()
const compiler = webpack(webpackConfig)
const port = process.env.PORT || 8080

registerRouteSimple()
registerRouteBase()
registerRouteError()
registerRouteExtend()
registerRouteInterceptor()
registerRouteDefaultConfig()
registerRouteCancellation()
registerRouteMore()
registerRouteXsrf()

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    color: true,
    chunk: false
  }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname, {
  setHeaders (res) {
    res.cookie('X-XSRF-TOKEN-DOLLY','abc1234')
  }
}))

app.use(multipart({
  uploadDir: path.resolve(__dirname, 'upload')
}))

app.use(parser.json())

app.use(parser.urlencoded({extended: true}))

app.use(cookie_parser())

app.use(router)

module.exports = app.listen(port, () => {
  console.log(`Server's listening on http://localhost:${port}, crtl + c to stop`)
})

function registerRouteSimple() {
  router.get('/simple/get', (req,res) => {
    res.json({
      msg: 'hello dolly!'
    })
  })
}

function registerRouteBase() {
  router.get('/base/get', (req,res) => {
    res.json(req.query)
  })

  router.post('/base/post', (req,res) => {
    res.json(req.body)
  })
}

function registerRouteError() {
  router.get('/error/get', (req,res) => {
    res.status(500)
    res.end()
  })

  router.get('/error/timeout', (req,res) => {
    setTimeout(() => {
      res.json({
        msg: 'you can\'t get me'
      })
    },3000)
  })
}

function registerRouteExtend() {
  router.get('/extend/get', (req,res) => {
    res.json({
      msg: 'hi, get'
    })
  })

  router.head('/extend/head', (req, res) => {
    res.end()
  })

  router.delete('/extend/delete', (req, res) => {
    res.end()
  })

  router.options('/extend/options', (req, res) => {
    res.end()
  })

  router.post('/extend/post', (req,res) => {
    res.json(req.body)
  })

  router.put('/extend/put', (req, res) => {
    res.json(req.body)
  })

  router.patch('/extend/patch', (req,res) => {
    res.json(req.body)
  })

  router.get('/extend/getUser', (req,res) => {
    res.json({
      code: 0,
      message: 'ok',
      data: {
        first: 'dolly',
        last: 'zhang'
      }
    })
  })
}

function registerRouteInterceptor() {
  router.post('/interceptor/post',(req,res) => {
    res.json({
      test: '1'
    })
  })
}

function registerRouteDefaultConfig() {
  router.post('/config/post', (req,res) => {
    res.json({
      msg: 'ok'
    })
  })

  router.post('/config/transform', (req,res) => {
    res.json({
      greet: 'ok'
    })
  })
}

function registerRouteCancellation() {
  router.get('/cancel/get',(req,res) => {
    setTimeout(() => {
      res.end('Not important, cancelled anyway.')
    }, 200)
  })

  router.post('/cancel/post',(req,res) => {
    setTimeout(() => {
      res.end('Not important, cancelled anyway.')
    },200)
  })
}

function registerRouteMore() {
  router.get('/more/get', (req,res) => {
    res.json(req.cookies)
  })

  router.post('/more/upload', (req, res) => {
    res.end('hi')
  })

  router.post('/more/auth', (req,res) => {
    const [type, credential] = req.headers.authorization.split(' ')
    const [username, password] = atob(credential).split(':')
    if (type === 'Basic' && username === 'dolly' && password === 'dolly123') {
      res.json(req.body)
    } else {
      res.status(401)
      res.end()
    }
  })

  router.get('/more/304', (req,res) => {
    res.status(304)
    res.end('good')
  })

  router.get('/more/306', (req,res) => {
    res.status(306)
    res.end('good')
  })
}

function registerRouteXsrf() {
  router.get('/xsrf/get', (req,res) => {
    res.end('hi')
  })
}

