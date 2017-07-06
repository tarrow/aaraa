import Vue from 'vue'
import {ClientTable} from 'vue-tables-2'

Vue.use(ClientTable)
new Vue({
  el: '#app',
  data: {
    columns: [
            { name: 'identifiers.contentmine', title: 'ContentMine Id' },
            { name: 'term' },
            { name: 'name' },
            { name: 'identifiers.wikidata', title: 'Wikidata ID', callback: 'formatWDLink' }
    ]
  },
  methods: {
    formatWDLink: function (wid) {
      if (wid) { return ('<a href="https://wikidata.org/wiki/' + wid + '">' + wid + '</a>') } else { return '' }
    }
  }
})
