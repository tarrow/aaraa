// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import {ClientTable, Event} from 'vue-tables-2'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import _ from 'lodash'
import serialize from './lib/serialize'
import Modal from './components/Modal'

Vue.config.productionTip = false

var data = []
var metadata = { log: [] }
var getAndLoadDict = function (url) {
  axios.get(url).then((response) => {
    var displayData = serialize.dictToDisplay(response.data)
    loadDict(displayData)
  })
}

var loadDict = function (displayData) {
  data.push.apply(data, displayData.display)
  metadata = _.cloneDeep(displayData.metadata)
}

var addEntry = function (entry) {
  var term = _.get(entry, 'wikidata.labels.en.value')
  if (!(term === undefined)) {
    data.push({
      wikidata: entry.text,
      contentmine: getNextID(),
      name: term,
      term
    })
  }
}

var logQuery = function (queryString) {
  metadata.log.push({
    type: 'wdqs',
    query: queryString,
    time: Date.now()
  })
}

var logPagePile = function (PagePileID) {
  metadata.log.push({
    type: 'pagepile',
    id: PagePileID,
    time: Date.now()
  })
}

var getNextID = function () {
  var ids = data.map((row) => {
    return parseInt(row.contentmine.match(/(\d+)$/)[0])
  })
  var max = _.max(ids)
  if (max === undefined) max = -1
  var newid = parseInt(max) + 1
  return 'CM.' + metadata.id + newid
}

Vue.component('wikidata', {
  props: ['data'],
  template: '<a v-bind:href="wUrl">{{data.wikidata}}</a>',
  computed: {
    wUrl () {
      return 'https://wikidata.org/wiki/' + this.data.wikidata
    }
  }
})

Vue.component('modal', Modal)

Vue.use(ClientTable)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    showModal: false,
    downloadContent: null,
    showDictSelector: true,
    showTable: false,
    columns: ['contentmine', 'term', 'name', 'wikidata'],
    tableData: data,
    metadata: metadata,
    options: {
      templates: {
        wikidata: 'wikidata'
      },
      customFilters: [{
        name: 'prefix',
        callback: (row, query) => {
          return _.upperCase(row.term[0]) === query
        }
      }]
    },
    dicts: [
      {name: 'Cochrane', url: 'https://rawgit.com/ContentMine/dictionaries/master/json/cochrane.json'},
      {name: 'Wikidata Country', url: 'https://rawgit.com/ContentMine/dictionaries/master/json/wikidatacountry.json'},
      {name: 'insecticides', url: 'https://rawgit.com/ContentMine/dictionaries/master/json/insecticides.json'},
      {name: 'disease', url: 'https://rawgit.com/ContentMine/dictionaries/master/json/disease.json'}
    ],
    prefixes: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  },
  methods: {
    dictLoad (dict) {
      getAndLoadDict(dict.url)
      this.showDictSelector = false
      this.showTable = true
    },
    prefixFilter (prefix) {
      Event.$emit('vue-tables.filter::prefix', prefix)
    },
    startDownload () {
      this.downloadContent = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(serialize.displayToDict(this.tableData, this.metadata)))
    },
    newDict () {
      this.showDictSelector = false
      this.showTable = true
    },
    loadDictionary (e) {
      var fReader = new window.FileReader()
      var self = this
      fReader.onload = function (event) {
        var displayData = serialize.dictToDisplay(JSON.parse(event.target.result))
        loadDict(displayData)
        self.showDictSelector = false
        self.showTable = true
      }
      fReader.readAsText(e.target.files[0])
    }
  }
})
.$on('newentity', addEntry)
.$on('updateQuery', logQuery)
.$on('updatePagePile', logPagePile)
