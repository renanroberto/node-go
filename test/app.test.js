'use strict'

process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const app = require('../src/app')

const expect = chai.expect

const models = require('../src/models/product')
const Product = mongoose.model('Product')

chai.use(chaiHttp)

before(function (done) {
  this.timeout(5000)
  mongoose.connect('mongodb://renan:renan@ds259865.mlab.com:59865/db-test', done)
})

after(done => {
  Product.remove({}, done)
})

describe('REST API', function () {
  this.timeout(5000)

  before(done => {
    Product.remove({}, done)
  })

  it('should create a new product', () => {
    const product = {
      name: 'Tenis',
      price: 100.00
    }

    return chai.request(app)
      .post('/api/products')
      .send(product)
      .then(response => {
        expect(response).to.have.status(201)
        expect(response.body).to.be.a('object').that.has.property('success')
        expect(response.body.success).to.be.true
      })
  })

  it('should return active products', () => {

    return chai.request(app)
      .get('/api/products')
      .then(response => {
        expect(response).to.have.status(200)
        expect(response.body).to.be.a('array').that.has.lengthOf(1)

        for (let product of response.body) {
          expect(product).to.have.property('name').that.is.a('string')
          expect(product).to.have.property('price').that.is.a('number')
          expect(product).to.have.property('active').that.is.true
        }
      })
  })
})

describe('GraphQL API', function () {
  this.timeout(5000)

  before(done => {
    Product.remove({}, done)
  })

  it('should create a new product', () => {
    const query = `
      mutation ($input: ProductInput) {
        createProduct(input: $input) {
          id
          name
          price
        }
      }
    `

    const variables = JSON.stringify({
      input: {
        name: 'Café',
        price: 1.50
      }
    })

    return chai.request(app)
      .post('/api/graphql')
      .query({ query, variables })
      .then(response => {
        const product = response.body.data.createProduct

        expect(response).to.have.status(200)
        expect(product).to.be.a('object')

        expect(product).to.have.property('id').that.is.a('string')
        expect(product).to.have.property('name').that.is.a('string')
        expect(product).to.have.property('price').that.is.a('number')
      })
  })

  it('should return name and price of all active products', () => {
    const query = `
      {
        products {
          name
          price
        }
      }
    `

    return chai.request(app)
      .post('/api/graphql')
      .query({ query })
      .then(response => {
        const products = response.body.data.products

        expect(response).to.have.status(200)
        expect(products).to.be.an('array').that.has.lengthOf(1)

        for (let product of products) {
          expect(product).to.have.property('name').that.is.a('string')
          expect(product).to.have.property('price').that.is.a('number')

          expect(product).to.not.have.property('id')
          expect(product).to.not.have.property('active')
        }
      })
  })
})
