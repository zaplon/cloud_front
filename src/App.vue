<template>
  <div>
    <notifications group="nots" />
    <agreement :consents="agreements"></agreement>
    <div id="overlay" v-if="$store.state.loading">
      <atom-spinner :animation-duration="1000" :size="120"/>
    </div>
    <router-view></router-view>
    <pdf-document ref="pdfDocument"></pdf-document>
  </div>
</template>

<script>
import PdfDocument from '@/components/PdfDocument'
import EventBus from '@/eventBus'
import {Account} from '@/api'
import {AtomSpinner} from 'epic-spinners'
import Agreement from './components/Agreement'

export default {
  name: 'app',
  components: {Agreement, PdfDocument, AtomSpinner},
  data () {
    return {
      agreements: null
    }
  },
  methods: {
    showDocument (file, title) {
      this.$refs.pdfDocument.showDocument(file, title)
    }
  },
  mounted () {
    EventBus.$on('show-document', (file, title) => {
      this.$refs.pdfDocument.showDocument(file, title)
    })
    EventBus.$on('settings-changed', () => {
      Account.getUserData()
    })
    EventBus.$on('agreements-to-show', (agreements) => {
      this.agreements = agreements
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
