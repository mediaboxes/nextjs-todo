const mysql = require('mysql')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'

const bodyParser = require('body-parser')
const { createServer } = require('http')
const { parse } = require('url')
const express = require('express')
const next = require('next')
const mobxReact = require('mobx-react')

// api
const apiReqest = require('./api/apiReqest')

const app = next({ dev })
const handle = app.getRequestHandler()
mobxReact.useStaticRendering(true)


app.prepare().then(() => {
  const server = express()

  server.use(bodyParser.urlencoded({
    extended: true,
  }))
  server.use(bodyParser.json())

  server.post('/api/add_todolist', apiReqest.post.addTodolist)
  server.get('/api/todolist', apiReqest.get.todolist)

  server.get('*', (req, res) => handle(req, res))

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

