const Sequelize = require('sequelize')

const sql = new Sequelize('shopp-app', 'root', 'kaput123', {dialect : 'mysql', host : 'localhost'})

module.exports = sql