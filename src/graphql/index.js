'use strict'

const { buildSchema } = require('graphql')

const model = require('../models/product')

const mongoose = require('mongoose')
const productModel = mongoose.model('Product')

exports.schema = buildSchema(`
  type Product {
    id: String
    name: String
    price: Float
    active: Boolean
  }

  type Query {
    products: [Product]
  }
`)

class Product {
  constructor (product) {
    this.product = product
  }

  id () {
    return this.product._id
  }

  name () {
    return this.product.name
  }

  price () {
    return this.product.price
  }

  active () {
    return this.product.active
  }
}

exports.root = {
  products () {
    return productModel.find({ active: true })
      .then(products => {
        return products.map(product => new Product(product))
      })
      .catch(err => console.error(err.message))
  }
}
