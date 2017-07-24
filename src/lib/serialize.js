// transfrom from CM dictionary to flat format for display
var dictToDisplay = function (dict) {
  var display = []
  dict.entries.map((x) => {
    x.contentmine = x.identifiers.contentmine
    if (!(x.identifiers.wikidata === undefined)) {
      x.wikidata = x.identifiers.wikidata
    }
    x.identifiers = null
    delete x.identifiers
    display.push(x)
  })
  return display
}

// transfrom from flat display format to CM dictionary for Download
var displayToDict = function (display) {

}

var serialize = {
  displayToDict,
  dictToDisplay
}

module.exports = serialize
