const mongodb = require('mongodb')
const getDb = require('../util/database').getDb
const ObjectID = mongodb.ObjectID


class User {
    constructor(name, email, cart, id) {
        this.name = name
        this.email = email
        this.cart = cart
        this.id = id
    }
    save() {
        const db = getDb();
        return db.collection('users').inserOne(this)
        .then(res => console.log('user Inserted'))
        .catch(err => console.log(err))
    }
    addToCart(product) {
        // const cartProduct = this.cart.items.find(cp => {
        //     return cp._id === product._id
        // })
        console.log('added to cart')
        product.quantity = 1
        const updatedCart = {items : [{...product, quantity : 1}]}
        const db = getDb()
        return db.collection('users').updateOne({_id : ObjectID(this._id)}, {$set : {cart : updatedCart}})
    }
    static findById(userId) {
        const db = getDb()
        return db.collection('users').findOne({_id : new ObjectID(userId)})
        .then(user => user)
        .catch(err => console.log(err))
    }
    
}
module.exports = User