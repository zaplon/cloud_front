<template>
    <div>
        <textarea class="form-control visit-tab" v-model="content"></textarea>
        <tab-templates :name="name" :content="content" :templates="templates" @setData="setData"></tab-templates>
    </div>
</template>
<script>
import TabTemplates from '@/components/Visit/TabTemplates'
export default {
  name: 'visit-tab',
  components: {TabTemplates},
  props: {
    initial: String,
    active: Boolean,
    templates: Array,
    name: String
  },
  data () {
    return {
      content: this.initial
    }
  },
  methods: {
    getData () { return this.content },
    setData (content) {
      this.content = this.content + ' ' + content
    }
  }
}
</script>
<style>
    textarea.visit-tab {
        width: 100%;
    }
</style>
