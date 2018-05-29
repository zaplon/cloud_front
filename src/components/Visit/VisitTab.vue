<template>
    <textarea class="form-control visit-tab" v-model="content"></textarea>
</template>
<script>
export default {
  name: 'visit-tab',
  props: {
    initial: String
  },
  data () {
    return {
      content: this.initial
    }
  },
  methods: {
    getData () { return this.content }
  }
}
</script>
<style>
    textarea.visit-tab {
        width: 100%;
    }
</style>
