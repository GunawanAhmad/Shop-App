
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const app = express()
const error = require('./controllers/error')
const sequelize = require('./util/database')
app.set('view engine', 'ejs')
app.set('views', 'views')
const adminRoutes = require('./routes/admin.js')
const shop = require('./routes/shop')


app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin',adminRoutes)
app.use(shop)
app.use(error.get404)

sequelize.sync().then(result => {
    app.listen(5000)
}).catch(err => {
    console.log(err)
})


