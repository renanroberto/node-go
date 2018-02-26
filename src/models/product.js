'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true,
    unique: true
  },
  price: {
    type: Number,
    require: true
  },
  active: {
    type: Boolean,
    required: true
  }
})

module.exports = mongoose.model('Product', schema)
