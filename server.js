
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const User = require('./models/users')
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
    User.findById("5efb0bedb3fa2e0f38e22d0d")
    .then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id)
        next();
    })
    .catch(err => console.log(err))
})

app.use('/admin',adminRoutes)
app.use(shop)
app.use(error.get404)

mongoConnect(()=> {
    app.listen(5000)
})




