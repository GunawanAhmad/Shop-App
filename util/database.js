const mysql = require('mysql2')
const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    database : 'shopp-app',
    password : 'kaput123'
})

module.exports = pool.promise()