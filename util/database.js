
const Mongodb = require('mongodb');
MongoClient = Mongodb.MongoClient


// Database Name
let db;
const url = `mongodb://test:test@localhost:27017/?authMechanism=DEFAULT`;

// Use connect method to connect to the Server
const mongoConnect = (callback) => {
    MongoClient.connect('mongodb://localhost:27017')
    .then(client => {
        console.log('connected')
        db = client.db('shop')
        callback(client)
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
