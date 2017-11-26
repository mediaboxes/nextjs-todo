const mysql = require('mysql')
const connection = require('./mysqlConnection')

function todolists(req, res) {
  const query = 'select * from ??'
  const table = ['todo_lists']
  const querySql = mysql.format(query, table)
  connection.query(querySql, (error, results, fields) => {
    if (error) {
      res.status(500)
      res.send('error')
    }
    res.send(results)
  })
}

function todolist(req, res) {
  const query = 'select * from ?? where ?? = ?'
  const table = ['todo_lists', 'id', req.query.id]
  const querySql = mysql.format(query, table)
  connection.query(querySql, (error, results, fields) => {
    if (error) {
      res.status(500)
      res.send('error')
    }
    res.send(results)
  })
}

function todos(req, res) {
  const query = 'select * from ?? where ?? = ?'
  const table = ['todo_data', 'todo_list_id', req.query.todolist_id]
  const querySql = mysql.format(query, table)
  connection.query(querySql, (error, results, fields) => {
    if (error) {
      res.status(500)
      res.send('error')
    }
    res.send(results)
  })
}

function addTodolist(req, res) {
  const query = 'insert into ?? (??) values(?)'
  const table = ['todo_lists', 'title', req.body.title]
  const querySql = mysql.format(query, table)
  connection.query(querySql, (error, results, fields) => {
    if (error) {
      res.status(500)
      res.send({ success: false })
    }
    res.send({ success: true })
  })
}

function addTodo(req, res) {
  const query = 'insert into ?? (??, ??, ??) values(?, ?, ?)'
  const table = ['todo_data', 'todo_list_id', 'text', 'deadline_at', req.body.todolist_id, req.body.text, req.body.deadline_at]
  const querySql = mysql.format(query, table)
  connection.query(querySql, (error, results, fields) => {
    if (error) {
      res.status(500)
      res.send({ success: false })
    }
    res.send({ success: true })
  })
}
function changeTodo(req, res) {
  const query = 'update ?? set ?? = ? where ?? = ?'
  const table = ['todo_data', 'complete', req.body.complete, 'id', req.body.id]
  const querySql = mysql.format(query, table)
  connection.query(querySql, (error, results, fields) => {
    if (error) {
      res.status(500)
      res.send({ success: false })
    }
    res.send({ success: true })
  })
}

function search(req, res) {
  const queryTodoList = 'select * from ?? where ?? LIKE ?'
  const tableTodoList = ['todo_lists', 'title', `%${req.query.q}%`]
  const querySqlTodoList = mysql.format(queryTodoList, tableTodoList)

  const queryTodo = 'select * from ?? where ?? LIKE ?'
  const tableTodo = ['todo_data', 'text', `%${req.query.q}%`]
  const querySqlTodo = mysql.format(queryTodo, tableTodo)

  const resData = {}

  console.log('querySqlTodoList', querySqlTodoList)
  console.log('querySqlTodo', querySqlTodo)

  new Promise((resolve, reject) => {
    connection.query(querySqlTodoList, (error, results, fields) => {
      console.log('querySqlTodoList', error, results)
      if (error) {
        reject(error)
        return
      }
      resData.list = results
      resolve()
    })
  })
    .then(() => new Promise((resolve, reject) => {
      connection.query(querySqlTodo, (error, results, fields) => {
        console.log('querySqlTodo', error, results)
        if (error) {
          reject(error)
          return
        }
        resData.data = results
        resolve()
      })
    }))
    .then(() => {
      console.log('resData', resData)
      res.send(resData)
    })
    .catch(() => {
      res.status(500)
      res.send({ success: false })
    })
}


module.exports = {
  get: {
    todolist,
    todolists,
    todos,
    search,
  },
  post: {
    addTodolist,
    addTodo,
  },
  patch: {
    changeTodo,
  },
}
