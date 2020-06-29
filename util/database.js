
const Mongodb = require('mongodb');
MongoClient = Mongodb.MongoClient


// Database Name
let db;
// Use connect method to connect to the Server
const mongoConnect = (callback) => {
    MongoClient.connect('mongodb://localhost:27017/db')
    .then(client => {
        db = client.db('Shopping')
        console.log('connected')
        callback()
    })
    .catch(err => {
        console.log(err)
        throw err
    })
}

const getDb = () => {
    if(db) {
        return db;
    }
    throw 'No Database'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb
