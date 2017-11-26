const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'password',
  database: 'todo_database',
})

module.exports = connection

