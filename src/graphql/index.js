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
    return this.product.id
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

const tests = [
  {
    id: '01',
    name: 'Tenis',
    price: 100,
    active: true
  },
  {
    id: '02',
    name: 'Blusa',
    price: 99.1,
    active: true
  },
  {
    id: '03',
    name: 'Calça',
    price: 57.97,
    active: true
  }
]

exports.root = {
  products () {
    return tests.map(test => new Product(test))
  }
}
