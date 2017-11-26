
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
    const query = 'select * from ?? where ?? = ?'
    const table = ['todo_lists', 'title', title]
    sqlPromiss(mysql.format(query, table))
      .then((results) => {
        if (results.length > 0) {
          reject(new Error(`ToDoリストの名称が既に存在しています:${title}`))
          return
        }
        resolve()
      })
  })
}

module.exports = {
  validationNullText,
  validationLessText,
  validationOverlapTodoList,
}
