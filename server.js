
const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const path = require('path')
const mongoose = require('mongoose')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')



const User = require('./models/users')
const app = express()
const store = new MongoDBStore({
    uri : 'mongodb://localhost:27017/myShoppingApp',
    collection : 'sessions',
    dbName : 'myShoppingApp'
})

const csrfProtection = csrf()

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
const fileStorage  = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'images')
    },
    filename : (req,file,cb) => {
        cb(null,  Math.random() + file.originalname)
    }
})

const filterImg = (req,file,cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}


app.use(bodyParser.urlencoded({extended : true}))
app.use(multer({storage : fileStorage, fileFilter : filterImg}).single('image'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images',express.static(path.join(__dirname, 'images')))
app.use(csrfProtection);

app.use(flash())

app.use((req,res,next) => {
    if(!req.session.user) {
        return next()
    }
    User.findById(req.session.user._id)
    .then(user => {
        if(!user) {
            return next()
        }
        req.user = user
        next()
    })
    .catch(err => {
        next(new Error(err))
    })
})

app.use((req,res,next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use('/500', error.get500)
app.use('/admin',adminRoutes)
app.use(shop)
app.use(authRoutes)

app.use(error.get404)


app.use((error, req,res,next) => {
    console.log(error)
    res.redirect('/500')
})


mongoose.connect('mongodb://localhost:27017/db', {
    dbName : 'myShoppingApp'
})
.then(result => {
    app.listen(5000)
})
.catch(err => console.log(err))



