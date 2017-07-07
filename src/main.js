// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import {ClientTable, Event} from 'vue-tables-2'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import _ from 'lodash'

Vue.config.productionTip = false

var data = []
var getAndLoadDict = function (url) {
  axios.get(url).then((response) => {
    response.data.entries.map((x) => { data.push(x) })
    // data.push(response.data.entries[0])
  })
}

Vue.use(ClientTable)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    loaded: true,
    columns: ['term', 'name'],
    tableData: data,
    options: {
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
    dictLoad: (dict) => {
      getAndLoadDict(dict.url)
      this.loaded = false
    },
    prefixFilter: (prefix) => {
      Event.$emit('vue-tables.filter::prefix', prefix)
    }
  }
})
