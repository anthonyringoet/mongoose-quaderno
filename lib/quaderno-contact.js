var mongoose = require('mongoose')
var moment = require('moment')
var _ = require('lodash')
var Schema = mongoose.Schema

module.exports = function quadernoContact (schema, options) {
  var InvoiceSchema = new Schema({
    invoice_id: {
      type: String,
      unique: true
    },
    number: String,
    payed: {
      type: Boolean,
      default: false
    },
    issue_date: Date,
    due_date: Date,
    permalink: String,
    state: String,
    pdf: String,
    url: String
  })

  schema.add({
    quaderno: {
      contact_id: String,
      permalink: String,
      invoices: [InvoiceSchema]
    }
  })

  // instance methods
  schema.methods.setContactId = function (id) {
    this.quaderno.contact_id = id
    return this
  }
  schema.methods.getContactId = function () {
    return this.quaderno.contact_id
  }
  schema.methods.setLink = function (url) {
    this.quaderno.permalink = url
    return this
  }
  schema.methods.getLink = function () {
    return this.quaderno.permalink
  }
  schema.methods.hasInvoices = function () {
    return !!this.quaderno.invoices.length
  }
  schema.methods.getInvoices = function () {
    return this.quaderno.invoices
  }
  schema.methods.getInvoice = function (invoiceId) {
    var invoices = this.getInvoices()
    var invoicePosition = invoices.map(function (p) {
      return p.invoice_id
    }).indexOf(invoiceId)

    if (invoicePosition === -1) {
      return null
    }

    return this.quaderno.invoices[invoicePosition]
  }
  schema.methods.createInvoice = function (newInvoice, cb) {
    newInvoice.issue_date = moment(newInvoice.issue_date)
    newInvoice.due_date = moment(newInvoice.due_date)

    this.quaderno.invoices.push(newInvoice)
    return this.save(cb)
  }
  schema.methods.removeInvoice = function (invoiceId, cb) {
    var invoices = this.getInvoices()

    if (!invoices) {
      return cb({error: 'No invoices found'})
    }

    var invoicePosition = invoices.map(function (p) {
      return p.invoice_id
    }).indexOf(invoiceId)

    if (invoicePosition === -1) {
      return this.save({error: 'Invoice not found'})
    }

    this.quaderno.invoices.splice(invoicePosition, 1)
    return this.save(cb)
  }
  schema.methods.updateInvoice = function (invoice, cb) {
    var invoices = this.getInvoices()

    if (!invoices) {
      return cb({error: 'No invoices found'})
    }
    if (!invoice.invoice_id) {
      return cb({error: 'invoice_id is required'})
    }

    var invoicePosition = invoices.map(function (p) {
      return p.invoice_id
    }).indexOf(invoice.invoice_id)

    if (invoicePosition === -1) {
      return this.save({error: 'Invoice not found'})
    }

    var currentInvoice = this.quaderno.invoices[invoicePosition]
    currentInvoice = _.assign(currentInvoice, invoice)
    return this.save(cb)
  }

  // todo: pre and post save actions
}
