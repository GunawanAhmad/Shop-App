
const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const path = require('path')
const MongoStore = require('connect-mongo')(session);


const User = require('./models/users')
const app = express()
const store = new MongoStore({
    url : 'mongodb://localhost:27017/db',
    collection : 'sessions',
    dbName : 'Shopping'
})

app.use(session({
    secret: 'foo',
    resave : false,
    saveUninitialized : false,
    store: store
}));
 


const error = require('./controllers/error')
const mongoConnect = require('./util/database').mongoConnect
app.set('view engine', 'ejs')
app.set('views', 'views')
const adminRoutes = require('./routes/admin.js')
const shop = require('./routes/shop')
const authRoutes = require('./routes/auth')


app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, 'public')))



app.use('/admin',adminRoutes)
app.use(shop)
app.use(authRoutes)
app.use(error.get404)

mongoConnect(()=> {
    app.listen(5000)
})




