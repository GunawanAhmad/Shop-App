const fs = require('fs')
const { deepStrictEqual } = require('assert')

const deleteFile = (filepath) => {
    fs.unlink(filepath, (err) => {
        if(err) {
            throw (err)
        }
    })
}

exports.deleteFile = deleteFile