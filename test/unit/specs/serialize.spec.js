import serialize from '../../../src/lib/serialize.js'
import chai from 'chai'
var flat = require('../files/flat.json')
var dict = require('../files/dict.json')
chai.config.includeStack = true
var assert = chai.assert

describe('serialiser', () => {
  it('should convert dictionaries to flat form', () => {
    var newFlat = serialize.dictToDisplay(dict)
    console.log(newFlat)
    assert.deepEqual(newFlat, flat)
  })
  it('should convert flat form back to dictionaries', () => {
    var newDict = serialize.displayToDict(flat)
    assert.deepEqual(newDict, dict)
  })
})
