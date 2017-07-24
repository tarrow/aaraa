import serialize from '../../../src/lib/serialize.js'
import chai from 'chai'
import _ from 'lodash'

var flat = Object.freeze(require('../files/flat.json'))
var dict = Object.freeze(require('../files/dict.json'))
var cloneDict = _.clone(dict, true)
// console.log(cloneDict)
chai.config.includeStack = true
var assert = chai.assert

describe('serialiser', () => {
  it('should convert dictionaries to flat form', () => {
    var newFlat = serialize.dictToDisplay(dict)
    assert.deepEqual(newFlat.display, flat)
  })
  it('should convert flat form back to dictionaries', () => {
    var newDict = serialize.displayToDict(flat, {id: 'CM.foo'})
    assert.deepEqual(newDict, cloneDict)
    console.log('asdfasdfasdfasdfasd')
    console.log(cloneDict)
  })
})
