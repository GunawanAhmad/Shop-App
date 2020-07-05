const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    products : [{
        productData : {type : Object, required : true},
        quantity : {type : Number, require : true}
    }],
    user : {
        email: {type : String, required : true},
        userId : {type : mongoose.Schema.Types.ObjectId, required : true}
    }
})

module.exports = mongoose.model('Order', OrderSchema)