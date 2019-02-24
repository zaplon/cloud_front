<template>
    <div class="card">
        <div class="card-header">{{ label }}
            <div class="card-toolbar">
                <router-link to="edycja"><i class="fa fa-pencil" title="edytuj" aria-hidden="true"></i></router-link>
            </div>
        </div>
        <div class="card-body">
            <backend-form :autoload="false" :readonly="1" ref="form" :klass="klass" :module="module"></backend-form>
        </div>
        <div class="card-footer">
            <router-link to="edycja" class="btn btn-primary pull-right">Edytuj</router-link>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'detail',
  props: {
    klass: {
      type: String,
      required: true
    },
    module: {
      type: String,
      required: true
    },
    resource: {
      type: String,
      required: true
    },
    backUrl: {
      type: String,
      required: true
    }
  },
  computed: {
    apiUrl () {
      return 'rest/' + this.resource + 's/'
    }
  },
  methods: {
    loadData () {
      if (!this.$route.params.id) {
        return
      }
      this.instanceId = this.$route.params.id ? parseInt(this.$route.params.id) : 0
      axios.get(this.apiUrl + this.instanceId + '/').then(response => {
        this.instance = response.data
        this.label = response.data.name
      })
      this.$refs.form.loadHtml(this.instanceId)
    }
  },
  data () {
    return {
      instanceId: 0,
      instance: {},
      label: this.instanceId
    }
  },
  watch: {
    '$route.path' () {
      this.loadData()
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>
