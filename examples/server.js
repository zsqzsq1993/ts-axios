const express = require('express')
const parser = require('body-parser')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const app = express()
const router = express.Router()
const compiler = webpack(webpackConfig)
const port = process.env.PORT || 8080

registerRouteSimple()
registerRouteBase()
registerRouteError()
registerRouteExtend()


app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    color: true,
    chunk: false
  }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(parser.json())

app.use(parser.urlencoded({extended: true}))

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
}


