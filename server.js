
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const app = express()
const error = require('./controllers/error')
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/users')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
app.set('view engine', 'ejs')
app.set('views', 'views')
const adminRoutes = require('./routes/admin.js')
const shop = require('./routes/shop')


app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req,res,next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user
        console.log(user)
        next();
    })
    .catch(err => console.log(err))
})

app.use('/admin',adminRoutes)
app.use(shop)
app.use(error.get404)



Product.belongsTo(User, {constrains : true, onDelete : 'CASCADE'})

//Optional
User.hasMany(Product)


User.hasOne(Cart)

//optional
Cart.belongsTo(User)

Cart.belongsToMany(Product, {through : CartItem})
Product.belongsToMany(Cart, {through : CartItem})

sequelize.sync().then(result => {
    return User.findByPk(1) 
}).then(user => {
    if (!user) {
        return User.create({name  : 'Gunawan', email : 'test@email.com'})
    }
    return user
}).then(user => {
    return user.createCart()
}).then(result =>{
    app.listen(5000)
}).catch(err => {
    console.log(err)
})


