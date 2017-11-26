const mysql = require('mysql')
const connection = require('./mysqlConnection')
const { sqlPromiss } = require('./utils')
const {
  validationNullText,
  validationLessText,
  validationOverlapTodoList,
} = require('./validation')


function todolists(req, res) {
  const query = `
  SELECT ??, ??, COUNT(??) AS ??, COUNT(?? = ? or NULL) AS ??, MIN(IF(?? = ?, ??, NULL)) AS ??
  FROM ?? 
  LEFT OUTER JOIN ?? ON(?? = ??) 
  GROUP BY ??
  ORDER BY MAX(??) desc,?? desc;
  `
  const table = [
    'todo_lists.id', 'todo_lists.title', 'todo_data.id', 'all_count', 'todo_data.complete', 1, 'complete_count', 'todo_data.complete', 0, 'todo_data.deadline_at', 'min_deadline',
    'todo_lists',
    'todo_data', 'todo_lists.id', 'todo_data.todo_list_id',
    'todo_lists.id',
    'todo_data.created_at', 'todo_lists.created_at',
  ]

  sqlPromiss(mysql.format(query, table))
    .then((results) => {
      res.send(results)
    })
    .catch((error) => {
      res.status(500)
      res.send({ success: false, errorMessage: error.message })
    })
}


function todolist(req, res) {
  const query = 'select * from ?? where ?? = ?'
  const table = ['todo_lists', 'id', req.query.id]
  sqlPromiss(mysql.format(query, table))
    .then((results) => {
      res.send(results)
    })
    .catch((error) => {
      res.status(500)
      res.send({ success: false, errorMessage: error.message })
    })
}

function todos(req, res) {
  const query = 'select * from ?? where ?? = ?'
  const table = ['todo_data', 'todo_list_id', req.query.todolist_id]
  const querySql = mysql.format(query, table)
  connection.query(querySql, (error, results, fields) => {
    if (error) {
      res.status(500)
      res.send({ success: false, errorMessage })
    }
    res.send(results)
  })
}

function addTodolist(req, res) {
  validationNullText(req.body.title)
    .catch(() => {
      throw new Error('ToDoリストの名称は1文字以上にしてください')
    })
    .then(() => validationLessText(req.body.title, 30))
    .catch(() => {
      throw new Error('ToDoリストの名称は30文字以内にしてください')
    })
    .then(() => validationOverlapTodoList(req.body.title))
    .then(() => {
      const query = 'insert into ?? (??) values(?)'
      const table = ['todo_lists', 'title', req.body.title]
      return sqlPromiss(mysql.format(query, table))
    })
    .then((results) => {
      res.send(results)
    })
    .catch((error) => {
      res.status(500)
      res.send({ success: false, errorMessage: error.message })
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
