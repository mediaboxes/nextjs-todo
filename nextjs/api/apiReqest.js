const mysql = require('mysql')
const connection = require('./mysqlConnection')

function todolist() {
  return (req, res) => {
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
}
function addTodolist() {
  return (req, res) => {
    const query = 'insert into ?? (??) values(?)'
    const table = ['todo_lists', 'title', req.body.title]
    const querySql = mysql.format(query, table)
    connection.query(querySql, (error, results, fields) => {
      if (error) {
        res.status(500)
        res.send('{success:false}')
      }
      res.send('{success:true}')
    })
  }
}


function makeRequest(queryFunc) {
  return (req, res) => {
    const query = queryFunc(req)
    connection.query(query, (error, results, fields) => {
      res.send(results)
      // connection.destroy()
    })
  }
}


module.exports = {
  get: {
    todolist: todolist(),
  },
  post: {
    addTodolist: addTodolist(),
  },
}
