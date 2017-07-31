import _ from 'lodash'

// transfrom from CM dictionary to flat format for display
var dictToDisplay = function (dict) {
  var metadata = {
    id: dict.id
  }
  var display = dict.entries.map((x) => {
    var y = _.cloneDeep(_.omit(x, 'identifiers'))
    y.contentmine = x.identifiers.contentmine
    if (!(x.identifiers.wikidata === undefined)) {
      y.wikidata = x.identifiers.wikidata
    }
    return y
  })
  return {display, metadata}
}

// transfrom from flat display format to CM dictionary for Download
var displayToDict = function (display, metadata) {
  var dict = {}
  dict.id = metadata.id
  dict.entries = display.map((x) => {
    var y = _.cloneDeep(_.omit(x, ['wikidata', 'contentmine']))
    y.identifiers = {}
    y.identifiers.contentmine = x.contentmine
    if (!(x.wikidata === undefined)) {
      y.identifiers.wikidata = x.wikidata
    }
    return y
  })
  return dict
}

var serialize = {
  displayToDict,
  dictToDisplay
}

export default serialize
