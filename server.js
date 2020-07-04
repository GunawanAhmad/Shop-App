
const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const path = require('path')
const mongoose = require('mongoose')
const MongoDBStore = require('connect-mongodb-session')(session)



const User = require('./models/users')
const app = express()
const store = new MongoDBStore({
    uri : 'mongodb://localhost:27017/myShoppingApp',
    collection : 'sessions',
    dbName : 'myShoppingApp'
})

app.use(session({
    secret: 'foo',
    resave : false,
    saveUninitialized : false,
    store : store
}));
 


const error = require('./controllers/error')
app.set('view engine', 'ejs')
app.set('views', 'views')
const adminRoutes = require('./routes/admin.js')
const shop = require('./routes/shop')
const authRoutes = require('./routes/auth')




app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req,res,next) => {
    if(!req.session.user) {
        return next()
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user
        next()
    })
    .catch(err => console.log(err))
})


app.use('/admin',adminRoutes)
app.use(shop)
app.use(authRoutes)
app.use(error.get404)


mongoose.connect('mongodb://localhost:27017/db', {
    dbName : 'myShoppingApp'
})
.then(result => {
    User.findOne().then(user => {
        if(!user) {
            const user = new User({
                name : 'Gunawan',
                email : 'test@email.com',
                cart : {
                    items : []
                }
            })
            user.save()
        }
    })
    
    app.listen(5000)
})
.catch(err => console.log(err))



