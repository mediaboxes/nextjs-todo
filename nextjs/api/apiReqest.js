const mysql = require('mysql')
const connection = require('./mysqlConnection')
const { sqlPromiss } = require('./utils')
const {
  validationNullText,
  validationLessText,
  validationOverlapTodoList,
  validationOverlapTodo,
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
      res.send(Object.assign({ success: true }, { results }))
    })
    .catch((error) => {
      res.status(500)
      res.send({ success: false, errorMessage: error.message })
    })
}


function todolist(req, res) {
  const query = 'SELECT * FROM ?? WHERE ?? = ?'
  const table = ['todo_lists', 'id', req.query.id]
  sqlPromiss(mysql.format(query, table))
    .then((results) => {
      res.send(Object.assign({ success: true }, { results }))
    })
    .catch((error) => {
      res.status(500)
      res.send({ success: false, errorMessage: error.message })
    })
}

function todos(req, res) {
  const query = 'SELECT * FROM ?? WHERE ?? = ? ORDER BY ?? desc'
  const table = ['todo_data', 'todo_list_id', req.query.todolist_id, 'created_at']
  sqlPromiss(mysql.format(query, table))
    .then((results) => {
      res.send(Object.assign({ success: true }, { results }))
    })
    .catch((error) => {
      res.status(500)
      res.send({ success: false, errorMessage: error.message })
    })
}

function addTodolist(req, res) {
  Promise.resolve()
    .then(() => Promise.resolve()
      .then(() => validationNullText(req.body.title))
      .catch(() => {
        throw new Error('ToDoリストの名称は1文字以上にしてください')
      }))
    .then(() => Promise.resolve()
      .then(() => validationLessText(req.body.title, 30))
      .catch(() => {
        throw new Error('ToDoリストの名称は30文字以内にしてください')
      }))
    .then(() => Promise.resolve()
      .then(() => validationOverlapTodoList(req.body.title)))
    .then(() => Promise.resolve()
      .then(() => {
        const query = 'INSERT INTO ?? (??) values(?)'
        const table = ['todo_lists', 'title', req.body.title]
        return sqlPromiss(mysql.format(query, table))
      }))
    .then((results) => {
      res.send(Object.assign({ success: true }, { results }))
    })
    .catch((error) => {
      res.status(500)
      res.send({ success: false, errorMessage: error.message })
    })
}

function addTodo(req, res) {
  Promise.resolve()
    .then(() => Promise.resolve()
      .then(() => validationNullText(req.body.text))
      .catch(() => {
        throw new Error('ToDoの名称は1文字以上にしてください')
      }))
    .then(() => Promise.resolve()
      .then(() => validationLessText(req.body.text, 30))
      .catch(() => {
        throw new Error('ToDoの名称は30文字以内にしてください')
      }))
    .then(() => Promise.resolve()
      .then(() => validationOverlapTodo(req.body.todolist_id, req.body.text)))
    .then(() => Promise.resolve()
      .then(() => {
        const query = 'INSERT INTO ?? (??, ??, ??) values(?, ?, ?)'
        const table = ['todo_data', 'todo_list_id', 'text', 'deadline_at', req.body.todolist_id, req.body.text, req.body.deadline_at]
        return sqlPromiss(mysql.format(query, table))
      }))
    .then((results) => {
      res.send(Object.assign({ success: true }, { results }))
    })
    .catch((error) => {
      res.status(500)
      res.send({ success: false, errorMessage: error.message })
    })
}
function changeTodo(req, res) {
  const query = 'UPDATE ?? SET ?? = ? WHERE ?? = ?'
  const table = ['todo_data', 'complete', req.body.complete, 'id', req.body.id]
  sqlPromiss(mysql.format(query, table))
    .then((results) => {
      res.send(Object.assign({ success: true }, { results }))
    })
    .catch((error) => {
      res.status(500)
      res.send({ success: false, errorMessage: error.message })
    })
}

function search(req, res) {
  const resData = {}
  const queryText = req.query && req.query.q || ''
  Promise.resolve()
    .then(() => Promise.resolve()
      .then(() => {
        const query = 'SELECT * FROM ?? WHERE ?? LIKE ? ORDER BY ?? desc'
        const table = ['todo_lists', 'title', `%${queryText}%`, 'created_at']
        return sqlPromiss(mysql.format(query, table))
      }))
    .then((results) => {
      resData.todolists = results
    })
    .then(() => Promise.resolve()
      .then(() => {
        const query = `
          SELECT ??, ??, ??, ??, ??, ?? AS ??, ?? AS ??
          FROM ?? 
          LEFT OUTER JOIN ?? ON(?? = ??) 
          WHERE ?? LIKE ? 
          ORDER BY ?? desc;
          `
        const table = [
          'todo_data.id', 'todo_data.text', 'todo_data.complete', 'todo_data.deadline_at', 'todo_data.created_at', 'todo_lists.title', 'todo_list_title', 'todo_lists.id', 'todo_list_id',
          'todo_data',
          'todo_lists', 'todo_data.todo_list_id', 'todo_lists.id',
          'todo_data.text', `%${queryText}%`,
          'todo_data.created_at',
        ]
        return sqlPromiss(mysql.format(query, table))
      }))
    .then((results) => {
      resData.tododata = results
      return resData
    })
    .then((results) => {
      res.send(Object.assign({ success: true }, { results }))
    })
    .catch((error) => {
      res.status(500)
      res.send({ success: false, errorMessage: error.message })
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
