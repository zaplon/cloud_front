<template>
    <div></div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'templates',
  data () {
    return {
      templates: []
    }
  },
  mounted () {
    axios.get('rest/templates/').then(response => { this.templates = response.data })
  }
}
</script>
