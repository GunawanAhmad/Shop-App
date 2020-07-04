
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    cart : {
        items : [{
            productId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Product',
                required : true
            },
            quantity : {
                type : Number,
                required : true
            }
        }]
    }
})

UserSchema.methods.addToCart = function(product) {
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
            productId : product._id,
            quantity : newQuantity
             })
        }
        
        const updatedCart = {   
            items : updatedCartItem
        };
        this.cart = updatedCart
        this.save()
}

UserSchema.methods.deleteCartItem = function(prodId) {
    const updatedCart = this.cart.items.filter(prod => {
        return prod.productId.toString() != prodId;
     })
    this.cart.items = updatedCart;
    return this.save()
}

UserSchema.methods.clearCart = function() {
    this.cart = {items : []}
    return this.save()
} 


module.exports = mongoose.model('User', UserSchema)

// const mongodb = require('mongodb')
// const getDb = require('../util/database').getDb
// const ObjectID = mongodb.ObjectID


// class User {
//     constructor(name, email, cart, id) {
//         this.name = name
//         this.email = email
//         this.cart = cart
//         this._id = id
//     }
//     save() {
//         let db = getDb();
//         return db.collection('users').inserOne(this)
//         .then(res => console.log('user Inserted'))
//         .catch(err => console.log(err))
//     }
//     addToCart(product) {
//         const cartProduct = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         })

//         let newQuantity = 1
//         const updatedCartItem = [...this.cart.items]
//         if (cartProduct >= 0) {
//             newQuantity = this.cart.items[cartProduct].quantity + 1;
//             updatedCartItem[cartProduct].quantity = newQuantity;

//         } else {
//             updatedCartItem.push({
//                 productId : new ObjectID(product._id),
//                 quantity : newQuantity
//             })
//         }

//         const updatedCart = {
//             items : updatedCartItem
//         };
//         const db = getDb();
//         return db.collection('users').updateOne({_id : new ObjectID(this._id)}, {$set : {cart : updatedCart}})
//         .then(res => {
//             console.log('')
//         })
//         .catch(err =>  console.log(err))
//     }
//     static findById(userId) {
//         const db = getDb()
//         return db.collection('users').findOne({_id : new ObjectID(userId)})
//         .then(user => user)
//         .catch(err => console.log(err))
//     }
//     getCart() {
//         this.cleanCart()
//         const db = getDb()
//         const productIds = this.cart.items.map(i => {
//             return i.productId;
//         })
//         return db.collection('products').find({_id : {$in : productIds}}).toArray()
//         .then(products => {
//             return products.map(p => {
//                 return {...p, quantity : this.cart.items.find(i => {
//                     return i.productId.toString() === p._id.toString()
//                 }).quantity}
//             })
            
//         })
//         .catch(err => console.log(err))
       
//     }
//     deleteCart(prodId) {
//         const updatedCart = this.cart.items.filter(prod => {
//             return prod.productId.toString() != prodId;
//         })
//         const db = getDb();
//         return db.collection('users').updateOne({_id : new ObjectID(this._id)}, {$set :{cart : {items : updatedCart}}})
//         .then(res => {
//             console.log('')
//         })
//         .catch(err =>  console.log(err))
//     }


//     addOrder() {
//         const db = getDb()
//         return this.getCart().then(products => {
//             let order = {
//                 items : products,
//                 user : {
//                     _id : new ObjectID(this._id),
//                     name : this.name,
//                     email : this.email
//                 }
//             };
//             return db.collection('order').insertOne(order)
//         })
//         .then(result => {
//             this.cart = {items : []}
//             return db.collection('users').updateOne({_id : new ObjectID(this._id)}, {$set :{cart : {items : [] } } } )
//             .then(result => {
//                 console.log('ordered')
//             })
//             .catch(err => console.log(err))
//         })
//     }
//     getOrder() {
//         const db = getDb();
//         return db.collection('order').find({'user._id' : new ObjectID(this._id)}).toArray()
//     }


//     cleanCart() {
//         let prodCartId = this.cart.items;
//         let id = []
//         for(let i = 0; i< prodCartId.length; i++) {
//             id.push(prodCartId[i].productId)
//         }
//         const db = getDb();
//         db.collection('products').find({}).toArray()
//         .then(prod => {
//             for(let i=0; i< id.length; i++) {
//                 let check = true
//                 for(let j =0; j<prod.length; j++) {
//                     if (id[i].toString() === prod[j]._id.toString()) {
//                         check = false
//                     }
//                 }
//                 if(check) {
//                     this.cart.items.splice(i, 1)
//                 }
//             }
//             db.collection('users').updateOne({_id : new ObjectID(this._id)}, {$set : {cart : {items : this.cart.items}}})
//             .then(result => console.log('cleaning succes'))
//             .catch(err => console.log(err))
//         })
//         .catch(err => console.log(arr))

//     }
    
// }
// module.exports = User