
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const app = express()
const error = require('./controllers/error')
const mongoConnect = require('./util/database').mongoConnect
app.set('view engine', 'ejs')
app.set('views', 'views')
const adminRoutes = require('./routes/admin.js')
const shop = require('./routes/shop')


app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req,res,next) => {
    // User.findByPk(1)
    // .then(user => {
    //     req.user = user
    //     console.log(user)
    //     next();
    // })
    // .catch(err => console.log(err))
    next()
})

app.use('/admin',adminRoutes)
app.use(shop)
// app.use(error.get404)

mongoConnect(()=> {
    app.listen(5000)
})




