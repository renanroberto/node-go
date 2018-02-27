'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const graphqlHttp = require('express-graphql')
const graphql = require('./graphql')

const Product = require('./models/product')
const productRoute = require('./routes/product')

const app = express()

// Database
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://renan:renan@ds247698.mlab.com:47698/nodestore')
    .then(() => console.log('Database connected'))
    .catch(err => console.error(err.message))
}

// Use body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Static
const view = express.static('view')
app.use(view)

// Routes
app.use('/api/products', productRoute)

app.use('/api/graphql', graphqlHttp({
  schema: graphql.schema,
  rootValue: graphql.root,
  graphiql: true
}))

//Page not found
app.use((req, res) => {
  res.status(404).send({ error: "page not found" })
})

module.exports = app
