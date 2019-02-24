<template>
  <div>
    <notifications group="nots" />
    <router-view></router-view>
    <pdf-document ref="pdfDocument"></pdf-document>
  </div>
</template>

<script>
import PdfDocument from '@/components/PdfDocument'
import EventBus from '@/eventBus'
import {Account} from '@/api'

export default {
  name: 'app',
  components: {PdfDocument},
  methods: {
    showDocument (file, title) {
      this.$refs.pdfDocument.showDocument(file, title)
    }
  },
  mounted () {
    EventBus.$on('show-document', (file, title) => {
      this.$refs.pdfDocument.showDocument(file, title)
    })
  },
  watch: {
    isAppIdle (value) {
      if (this.$store.state.user && value) {
        Account.logOut(this, 'Nastąpiło wylogowanie ze względu na nieaktywność')
      }
    }
  }
}
</script>

<style lang="scss">
  /* Import Font Awesome Icons Set */
  $fa-font-path: '~font-awesome/fonts/';
  @import '~font-awesome/scss/font-awesome.scss';
  /* Import Simple Line Icons Set */
  $simple-line-font-path: '~simple-line-icons/fonts/';
  @import '~simple-line-icons/scss/simple-line-icons.scss';
</style>
<style>
  /* Import Bootstrap Vue Styles */
  @import 'bootstrap-vue/dist/bootstrap-vue.css';
</style>
<style lang="scss">
  // Import Main styles for this application
  @import './assets/scss/style';
</style>
