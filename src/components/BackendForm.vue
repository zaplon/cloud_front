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
    blank: {
      type: Boolean,
      required: false,
      default: false
    },
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
      if (!id && this.klass in this.$forms) {
        this.htmlData = this.$forms[this.klass]
        return {then: callback => callback()}
      }
      let params = {klass: this.klass, module: this.module, id: id, data: data}
      if (this.blank) { params.blank = 1 }
      if (this.readonly) { params.read_only = 1 }
      return axios.get(this.url, {params: params}).then(response => {
        if (response.data.success) {
          this.htmlData = response.data.form_html
          if (!id) { this.$forms[this.klass] = this.htmlData }
        }
      })
    },
    getData () {
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
      return data
    },
    handleSubmit (callback) {
      let data = this.getData()
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
