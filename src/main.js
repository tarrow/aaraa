// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import {ClientTable} from 'vue-tables-2'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

Vue.config.productionTip = false

var data = []
axios.get('https://rawgit.com/ContentMine/dictionaries/master/json/cochrane.json').then((response) => {
  response.data.entries.map((x) => { data.push(x) })
  // data.push(response.data.entries[0])
})

Vue.use(ClientTable)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    loaded: true,
    columns: ['term', 'name'],
    tableData: data,
    ready: () => {
      this.loaded = true
    },
    options: {
            // see the options API
    }
  }
})
