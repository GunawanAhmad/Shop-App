const fs = require('fs');
const path = require('path');
const Cart = require('./cart')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if(this.id) {
        const existingProduct = products.findIndex(prod => prod.id === this.id)
        const updatedProduct = [...products]
        updatedProduct[existingProduct] = this 
        fs.writeFile(p, JSON.stringify(updatedProduct), err => {
          console.log(err);
        });
      } else {
          this.id = Math.random().toString()
          products.push(this);
          fs.writeFile(p, JSON.stringify(products), err => {
            console.log(err);
          });
      }  
    });
  }
  static delete(id) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id)
      const updatedProduct = products.filter(prod => prod.id !== id)
      fs.writeFile(p, JSON.stringify(updatedProduct), err => {
        if (!err) {
          Cart.deleteCartP(id, product.price)
        }
      });
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
  
  static findById(id, cb) {
      getProductsFromFile(Products => {
        const product = Products.find(p => p.id === id)
        cb(product)
      })
  }

};
