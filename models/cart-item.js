const Sequelize = require('sequelize')
const sql = require('../util/database')

const CartItem = sql.define('CartItem', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    quantity : Sequelize.INTEGER
})

module.exports = CartItem
