# Inspired by and using demo code from https://vuejs.org/v2/examples/modal.html
    
    <template>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              Add Items to Dictionary
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <form @submit.prevent="doSparqlQuery">
                  <textarea style="height: 100%;" name="sparql_query" id="sparql_query" placeholder="Paste your query here where the ?item parameter returns all the items you want in the dictionary" v-model="queryString"></textarea>
                  <button class="btn" type="submit">Run Query</button>
              </form>
              <form @submit.prevent="doPagePile">
                <input v-model="pagePileID" placeholder="PagePile ID">
                <button class="btn" type="submit">Run PagePile</button>
              </form>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn-danger modal-default-button" @click="$emit('close')">
                Close
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
    </template>

<script>
import axios from 'axios'
import wdk from 'wikidata-sdk'
import _ from 'lodash'
import jsonp from 'jsonp'

export default {
  name: 'modal',
  methods: {
    emitNewEntries (wids) {
      var urls = wdk.getManyEntities(wids)
      var downloadPromises = urls.map((url) => { return axios.get(url) })
      axios.all(downloadPromises)
      .then((responses) => {
        var entities = {}
        responses.map((response) => {
          _.merge(entities, response.data.entities)
        })
        _.forEach(entities, (value, key) => {
          this.$parent.$emit('newentity', { wikidata: value, text: key })
        })
      })
    },
    doSparqlQuery () {
      // Snippet inspired by wikidata-sdk https://github.com/maxlath/wikidata-sdk/blob/master/lib/utils/utils.js
      const encodeCharacter = (c) => '%' + c.charCodeAt(0).toString(16)
      const escapedQueryString = encodeURIComponent(this.queryString).replace(/[!'()*]/g, encodeCharacter)
      axios.get(`https://query.wikidata.org/sparql?format=json&query=${escapedQueryString}`)
      .then((response) => {
        var wids = wdk.simplifySparqlResults(response.data)
        return Promise.resolve(wids)
      })
      .then(this.emitNewEntries)
    },
    doPagePile () {
      var me = this
      jsonp(`https://tools.wmflabs.org/pagepile/api.php?id=${this.pagePileID}&action=get_data&doit&format=json`, null, function (err, data) {
        if (err) {
          console.error(err.message)
        } else {
          me.emitNewEntries(data.pages)
        }
      })
    }
  },
  data: function () {
    return {
      queryString: undefined,
      pagePileID: undefined
    }
  }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 60%;
  height: 60%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

</style>
