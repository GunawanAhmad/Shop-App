const Sequelize = require('sequelize')
const sql = require('../util/database')

const User = sql.define('users', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true

    },
    name : {
        type : Sequelize.STRING,
        allowNull : false,
    },
    email : {
        type : Sequelize.STRING,
        allowNull : false
    }

})

module.exports = User