# Mongoose Quaderno.io contact plugin

[![travis ci build](https://travis-ci.org/anthonyringoet/mongoose-quaderno.svg)](https://travis-ci.org/anthonyringoet/mongoose-quaderno)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Mongoose plugin to manage [Quaderno](https://quaderno.io/) contacts and their invoices. Add it to your Mongoose models to store:

- contact_id
- permalink
- invoices

## API
@todo Need to list it here, see [tests](https://github.com/anthonyringoet/mongoose-quaderno/blob/master/test/mongoose-quaderno.js)

## Usage

Install

```bash
$ npm install mongoose-quaderno
```

```javascript
var quadernoContact = require('mongoose-quaderno')
var SomeSchema = new mongoose.Schema({
  // your schema stuff here
})

SomeSchema.plugin(quadernoContact)
```

## License
MIT
