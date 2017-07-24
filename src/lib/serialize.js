// import _ from 'lodash'

// transfrom from CM dictionary to flat format for display
var dictToDisplay = function (dict) {
  var display = []
  var metadata = {
    id: dict.id
  }
  dict.entries.map((x) => {
    x.contentmine = x.identifiers.contentmine
    if (!(x.identifiers.wikidata === undefined)) {
      x.wikidata = x.identifiers.wikidata
    }
    x.identifiers = null
    delete x.identifiers
    display.push(x)
  })
  return {display, metadata}
}

// transfrom from flat display format to CM dictionary for Download
var displayToDict = function (display, metadata) {
  var dict = {}
  dict.id = metadata.id
  dict.entries = []
  display.map((x) => {
    x.identifiers = {}
    x.identifiers.contentmine = x.contentmine
    if (!(x.wikidata === undefined)) {
      x.identifiers.wikidata = x.wikidata
    }
    x.contentmine = null
    x.wikidata = null
    delete x.contentmine
    delete x.wikidata
    dict.entries.push(x)
  })
  return dict
}

var serialize = {
  displayToDict,
  dictToDisplay
}

module.exports = serialize
