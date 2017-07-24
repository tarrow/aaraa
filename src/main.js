// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import {ClientTable, Event} from 'vue-tables-2'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import _ from 'lodash'
import serialize from './lib/serialize'

Vue.config.productionTip = false

var data = []
var metadata = {}
var getAndLoadDict = function (url) {
  axios.get(url).then((response) => {
    var displayData = serialize.dictToDisplay(response.data)
    data.push.apply(data, displayData.display)
    metadata = displayData.metadata
    console.log(metadata)
  })
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

Vue.use(ClientTable)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    downloadContent: null,
    showDictSelector: () => {
      return true
    },
    columns: ['contentmine', 'term', 'name', 'wikidata'],
    tableData: data,
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
    },
    prefixFilter (prefix) {
      Event.$emit('vue-tables.filter::prefix', prefix)
    },
    startDownload () {
      this.downloadContent = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(serialize.displayToDict(this.tableData, 'foo')))
    }
  }
})
