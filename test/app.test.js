'use strict'

process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const app = require('../src/app')

const expect = chai.expect

chai.use(chaiHttp)

before(done => {
  mongoose.connect('mongodb://renan:renan@ds247698.mlab.com:47698/nodestore', done)
})

describe('REST product route', () => {
  it('should return active products', () => {
    return chai.request(app)
      .get('/api/products')
      .then(response => {
        expect(response).to.have.status(200)
        expect(response.body).to.be.a('array')

        for (let product of response.body) {
          expect(product).to.have.property('name').that.is.a('string')
          expect(product).to.have.property('price').that.is.a('number')
          expect(product).to.have.property('active').that.is.true
        }
      })
  })
})
