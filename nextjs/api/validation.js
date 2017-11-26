const mysql = require('mysql')
const { sqlPromiss } = require('./utils')

function validationNullText(text) {
  return new Promise((resolve, reject) => {
    if (text === null || text === '') {
      reject(new Error('テキストが入力されていません'))
      return
    }
    resolve()
  })
}
function validationLessText(text, count) {
  return new Promise((resolve, reject) => {
    if (text.length > count) {
      reject(new Error(`テキストが${count}文字以上です`))
      return
    }
    resolve()
  })
}

function validationOverlapTodoList(title) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM ?? WHERE ?? = ?'
    const table = ['todo_lists', 'title', title]
    sqlPromiss(mysql.format(query, table))
      .then((results) => {
        if (results.length > 0) {
          reject(new Error(`ToDoリストの名称が既に存在しています:${title}`))
          return
        }
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
  })
}
function validationOverlapTodo(todolistId, text) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM ?? WHERE ?? = ? AND ?? = ? '
    const table = ['todo_data', 'todo_list_id', todolistId, 'text', text]
    sqlPromiss(mysql.format(query, table))
      .then((results) => {
        if (results.length > 0) {
          reject(new Error(`ToDoの名称が既に存在しています:${text}`))
          return
        }
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
  })
}

module.exports = {
  validationNullText,
  validationLessText,
  validationOverlapTodoList,
  validationOverlapTodo,
}
