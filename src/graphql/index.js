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
    products(count: Int, page: Int): [Product]
    product(id: String!): Product
  }

  type Mutation {
    createProduct(input: ProductInput): Product
    removeProduct(id: String): String
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
  products ({ count, page }) {
    return productModel.find({ active: true })
      .then(products => {
        if (!count) count = products.length
        if (!page) page = 1

        page = (page - 1) * count

        return products.map(product => new Product(product)).slice(page, count + page)
      })
      .catch(err => console.error(err.message))
  },

  product ({ id }) {
    return productModel.find({ _id: id })
      .then(product => {
        return new Product(product[0])
      })
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
  },

  removeProduct ({ id }) {
    return productModel.remove({ _id: id }, err => {
      if (err) console.error(err.message)
      return "Product deleted"
    })
  }
}
