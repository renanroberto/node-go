'use strict'

const { buildSchema } = require('graphql')

const model = require('../models/product')

const mongoose = require('mongoose')
const productModel = mongoose.model('Product')

exports.schema = buildSchema(`
  input ProductInput {
    name: String
    price: Float
  }

  type Product {
    id: String
    name: String
    price: Float
    active: Boolean
  }

  type Query {
    products: [Product]
  }

  type Mutation {
    createProduct(input: ProductInput): Product
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
  },

  createProduct ({ input }) {
    const product = new productModel({
      name: input.name,
      price: input.price,
      active: true
    })

    return product.save()
      .then(() => {
        return new Product(product)
      })
      .catch(err => {
        return null
      })
  }
}
