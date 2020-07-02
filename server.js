
const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const path = require('path')
const mongoSession = require('connect-mongodb-session')(session)


const User = require('./models/users')
const app = express()

const MONGODB_URI = 'mongodb://localhost:27017/db'
const store = new mongoSession({
    uri : MONGODB_URI,
    collection : session
})

store.on('error', function(err) {
    console.log(err)
})

const error = require('./controllers/error')
const mongoConnect = require('./util/database').mongoConnect
app.set('view engine', 'ejs')
app.set('views', 'views')
const adminRoutes = require('./routes/admin.js')
const shop = require('./routes/shop')
const authRoutes = require('./routes/auth')


app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    secret : 'sem',
    resave : true,
    saveUninitialized:true,
    store : store
}))
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
app.use(authRoutes)
app.use(error.get404)

mongoConnect(()=> {
    app.listen(5000)
})




