/* eslint-env mocha */
var mongoose = require('mongoose')
var moment = require('moment')
var should = require('should')
var utils = require('./utils')

describe('Mongoose Quaderno plugin', function () {
  var user
  var ModelUser
  var UserSchema = utils.createDummySchema()

  before(function (done) {
    utils.setDb(function () {
      ModelUser = mongoose.model('users', UserSchema)
      user = new ModelUser()
      user = utils.setFakeUserData(user)
      user.save(function (user, arr) {
        done()
      })
    })
  })

  it('should add the quaderno property to the schema', function (done) {
    should.exist(user)
    user.should.have.property('quaderno')
    done()
  })

  describe('#setContactId() / #getContactId()', function () {
    it('should set / get the Quaderno contact id', function (done) {
      var id = 'foobar123'
      user.setContactId(id)
      user.getContactId().should.equal(id)
      done()
    })
  })

  describe('#setLink() / #getLink()', function () {
    it('should set / get the Quaderno contact permalink', function (done) {
      var url = 'https://foo.bar/123456'
      user.setLink(url)
      user.getLink().should.equal(url)
      done()
    })
  })

  describe('#hasInvoices()', function () {
    it('should return false if contact has no invoices', function (done) {
      var hasInvoices = user.hasInvoices()
      hasInvoices.should.eql(false)
      done()
    })
    it('should return true if contact has invoices', function (done) {
      var hasInvoices = user.hasInvoices()
      hasInvoices.should.eql(false)
      done()
    })
  })

  describe('#getInvoices()', function () {
    it('should return the contacts invoices', function (done) {
      var invoices = user.getInvoices()
      invoices.should.be.an.Array()
      done()
    })
  })

  describe('#getInvoice(invoiceId)', function () {
    it('should return null if there\'s no invoice', function (done) {
      var result = user.getInvoice('foobar')

      should.equal(result, null)
      done()
    })
    it('should return the existing invoice', function (done) {
      var params = {
        invoice_id: 'getinvoice-123456',
        number: '452',
        payed: true,
        issue_date: moment(),
        due_date: moment(),
        permalink: '5454546226215484',
        state: 'paid'
      }
      user.createInvoice(params, function (err, updated) {
        should.not.exist(err)
        should.exist(updated)

        var invoice = updated.getInvoice(params.invoice_id)
        invoice.number.should.eql(params.number)
        invoice.permalink.should.eql(params.permalink)
        invoice.state.should.eql(params.state)
        done()
      })
    })
  })

  describe('#createInvoice(invoice)', function () {
    it('should create the invoice for the current contact', function (done) {
      var count = user.getInvoices().length
      var params = {
        invoice_id: 'foobar-123456',
        number: '452',
        payed: true,
        issue_date: moment(),
        due_date: moment(),
        permalink: '5454546226215484',
        state: 'paid'
      }
      user.createInvoice(params, function (err, updated) {
        should.not.exist(err)
        should.exist(updated)
        var invoices = updated.getInvoices()

        updated.getInvoices().length.should.eql(count + 1)
        should.exist(invoices[0].invoice_id)
        should.exist(invoices[0].number)
        should.exist(invoices[0].payed)
        should.exist(invoices[0].issue_date)
        should.exist(invoices[0].due_date)
        should.exist(invoices[0].permalink)
        should.exist(invoices[0].state)
        done()
      })
    })
  })

  describe('#removeInvoice(invoiceId)', function () {
    it('should remove the invoice for the current invoiceId', function (done) {
      var params = {
        invoice_id: 'remove-123456',
        number: '455',
        payed: true,
        issue_date: moment(),
        due_date: moment(),
        permalink: '4554545454',
        state: 'draft'
      }

      user.createInvoice(params, function (err, updated) {
        should.not.exist(err)
        should.exist(updated)
        var invoices = updated.getInvoices()
        var count = invoices.length

        user.removeInvoice(params.invoice_id, function (err, updatedUser) {
          should.not.exist(err)
          should.exist(updatedUser)

          var updatedCount = updatedUser.getInvoices().length
          updatedCount.should.eql(count - 1)
          done()
        })
      })
    })
  })

  describe('#updateInvoice(invoice)', function () {
    it('should update the invoice with the current params', function (done) {
      var params = {
        invoice_id: 'update-123',
        number: '455',
        payed: true,
        issue_date: moment(),
        due_date: moment(),
        permalink: '4554545454',
        state: 'draft'
      }
      var paramsNew = {
        invoice_id: 'update-123',
        number: '455',
        payed: false,
        issue_date: moment(),
        due_date: moment(),
        permalink: '88888888',
        state: 'draft'
      }

      user.createInvoice(params, function (err, updated) {
        should.not.exist(err)
        should.exist(updated)
        var count = updated.getInvoices().length

        user.updateInvoice(paramsNew, function (err, updatedUser) {
          should.not.exist(err)
          should.exist(updatedUser)

          var invoices = updatedUser.getInvoices()
          var updatedCount = invoices.length
          updatedCount.should.eql(count)
          invoices[2].permalink.should.eql(paramsNew.permalink)
          invoices[2].invoice_id.should.eql(paramsNew.invoice_id)
          done()
        })
      })

    })
  })

  after(function (done) {
    utils.cleanDb(done)
  })
})
