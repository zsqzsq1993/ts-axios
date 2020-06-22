const exporess = require('express')
const body_parser = require('body-parser')
const cookie_parser = require('cookie-parser')

const port = 8088
const app = new exporess()
const router = exporess.Router()
const cors = {
  'Access-Control-Allow-Origin': 'http://localhost:8080',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-AlLow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Name'
}

registerRoutes()
app.use(body_parser.json())
app.use(body_parser.urlencoded({extended: true}))
app.use(cookie_parser())
app.use(router)

app.listen(port)

function registerRoutes() {
  router.options('/more/post', (req,res) => {
    res.set(cors)
    res.end()
  })

  router.post('/more/post', (req,res) => {
    res.set(cors)
    res.json(req.cookies)
  })

  router.get('/more/get', ((req, res) => {
    res.end('hi')
  }))
}


