const connection = require('./mysqlConnection')

function sqlPromiss(querySql) {
  return new Promise((resolve, reject) => {
    connection.query(querySql, (error, results) => {
      console.log('sqlPromiss', querySql, error, results)
      if (error) {
        reject(new Error(`SQL実行に失敗しました : ${error.message}`))
        return
      }
      resolve(results)
    })
  })
}

module.exports = {
  sqlPromiss,
}

