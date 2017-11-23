const mysql = require('mysql')
const connection = require('./mysqlConnection')

function todoList(reqQuery) {
  const query = 'select * from ??'
  const table = ['todo_lists']
  return mysql.format(query, table)
}

const apiList = {
  todoList,
}
const getRequest = (req, res) => {
  console.log(apiList, req.params.pages, apiList.hasOwnProperty(req.params.pages))
  if (!(apiList.hasOwnProperty(req.params.pages))) {
    res.status(404)
    res.send()
    return
  }
  const queryFunc = apiList[req.params.pages]
  const query = queryFunc(req.query)
  connection.query(query, (error, results, fields) => {
    res.send(results)
  })
}
module.exports = { get: getRequest }
