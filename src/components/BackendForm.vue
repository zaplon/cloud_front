<template>
    <form :action="url" @submit="handleSubmit" method="post">
        <div v-html="htmlData"></div>
    </form>
</template>
<script>
import axios from 'axios'
export default {
  name: 'backend-form',
  data () {
    return {
      url: axios.defaults.baseURL + 'get-form/',
      htmlData: ''
    }
  },
  props: {
    klass: {
      type: String,
      required: true
    },
    module: {
      type: String,
      required: true
    },
    readonly: {
      type: Boolean,
      required: false,
      default: null
    },
    autoload: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  methods: {
    loadHtml (id, data) {
      return axios.get(this.url, {params: {klass: this.klass, module: this.module, read_only: this.readonly, id: id, data: data}}).then(response => {
        if (response.data.success) {
          this.htmlData = response.data.form_html
        }
      })
    },
    handleSubmit (callback) {
      var data = {}
      let id = parseInt(this.$el.getAttribute('pk'))
      if (id) { data.id = id }
      var form = new FormData(this.$el)
      for (var pair of form.entries()) {
        if (pair[0].startsWith('factory_')) {
          data[pair[0]] = [pair[1]]
        } else {
          if (pair[0] in data) {
            if (typeof (data[pair[0]]) !== 'object') {
              data[pair[0]] = [data[pair[0]]]
            }
            data[pair[0]].push(pair[1])
          } else {
            data[pair[0]] = pair[1]
          }
        }
      }
      return axios.post(this.url, {klass: this.klass, module: this.module, data: data}).then(response => {
        if (response.data.success) {
          if (callback) {
            callback(response.data.result)
          }
        } else { this.htmlData = response.data.form_html }
      })
    }
  },
  mounted () {
    if (this.autoload) { this.loadHtml() }
  }
}
</script>
