const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient


const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://gunawanfsdev:kaput123@cluster0-0jbmd.mongodb.net/?retryWrites=true&w=majority')
.then(client => {
    console.log('connected')
    callback(client)
})
.catch(err => console.log(err))
}

module.exports = mongoConnect;