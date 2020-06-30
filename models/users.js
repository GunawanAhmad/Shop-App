const mongodb = require('mongodb')
const getDb = require('../util/database').getDb
const ObjectID = mongodb.ObjectID


class User {
    constructor(name, email, cart, id) {
        this.name = name
        this.email = email
        this.cart = cart
        this._id = id
    }
    save() {
        let db = getDb();
        return db.collection('users').inserOne(this)
        .then(res => console.log('user Inserted'))
        .catch(err => console.log(err))
    }
    addToCart(product) {
        const cartProduct = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        })

        let newQuantity = 1
        const updatedCartItem = [...this.cart.items]
        if (cartProduct >= 0) {
            newQuantity = this.cart.items[cartProduct].quantity + 1;
            updatedCartItem[cartProduct].quantity = newQuantity;

        } else {
            updatedCartItem.push({
                productId : new ObjectID(product._id),
                quantity : newQuantity
            })
        }

        const updatedCart = {
            items : updatedCartItem
        };
        const db = getDb();
        return db.collection('users').updateOne({_id : new ObjectID(this._id)}, {$set : {cart : updatedCart}})
        .then(res => {
            console.log('')
        })
        .catch(err =>  console.log(err))
    }
    static findById(userId) {
        const db = getDb()
        return db.collection('users').findOne({_id : new ObjectID(userId)})
        .then(user => user)
        .catch(err => console.log(err))
    }
    getCart() {
        const db = getDb()
        const productIds = this.cart.items.map(i => {
            return i.productId;
        })
        return db.collection('products').find({_id : {$in : productIds}}).toArray()
        .then(products => {
            return products.map(p => {
                return {...p, quantity : this.cart.items.find(i => {
                    return i.productId.toString() === p._id.toString()
                }).quantity}
            })
        })
        .catch(err => console.log(err))
    }
    deleteCart(prodId) {
        const updatedCart = this.cart.items.filter(prod => {
            return prod.productId.toString() != prodId;
        })
        const db = getDb();
        return db.collection('users').updateOne({_id : new ObjectID(this._id)}, {$set :{cart : {items : updatedCart}}})
        .then(res => {
            console.log('')
        })
        .catch(err =>  console.log(err))

    }
    
}
module.exports = User