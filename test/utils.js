/* eslint-env mocha */
var mongoose = require('mongoose')
var quadernoContact = require('../lib/quaderno-contact')
var Faker = require('faker')
var DatabaseCleaner = require('database-cleaner')
var dbConnection = 'mongodb://127.0.0.1/mongoose-quaderno'

module.exports.createDummySchema = function () {
  var UserSchema = new mongoose.Schema({
    name: String,
    email: String
  })
  UserSchema.plugin(quadernoContact)
  return UserSchema
}

module.exports.setFakeUserData = function (user) {
  user.name = Faker.company.companyName()
  user.email = Faker.internet.email()
  return user
}

module.exports.setDb = function (cb) {
  mongoose.connect(dbConnection)
  var db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  mongoose.connection.db.once('open', function (err, db) {
    if (err) throw err
    cb()
  })
}

module.exports.cleanDb = function (cb) {
  var databaseCleaner = new DatabaseCleaner('mongodb')
  databaseCleaner.clean(mongoose.connection.db, function () {
    mongoose.connection.close(function () {
      mongoose.disconnect(function () {
        cb()
      })
    })
  })
}
