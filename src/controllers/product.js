'use strict'

const mongoose = require('mongoose')

const Product = mongoose.model('Product')

exports.get = (req, res) => {
  Product.find({ active: true })
    .then(product => {
      res.status(200).send(product)
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

exports.getById = (req, res) => {
  Product.find({ _id: req.params.id })
    .then(product => {
      res.status(200).send(product)
    })
    .catch(err => {
      res.status(400).send(err)
    })
}

exports.post = (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    active: true
  })

  product.save()
    .then(() => {
      res.status(201).send({
        action: 'Save product',
        message: 'Product saved',
        success: true,
        error: null
      })
    })
    .catch(err => {
      res.status(400).send({
        action: 'Save product',
        message: 'Error on save product',
        success: false,
        error: err.message
      })
    })
}
