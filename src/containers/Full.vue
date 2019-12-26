<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
      <main class="main">
        <breadcrumb :list="list"/>
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
      <AppAside/>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import nav from '../_nav'
import {Header as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb} from '../components/'

export default {
  name: 'full',
  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter,
    Breadcrumb
  },
  data () {
    return {
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    },
    nav () {
      if (!this.$store.state.user.modules) { return [] }
      var items = []
      var me = this
      nav.items.forEach(function (item) {
        console.log(item)
        if (item.children) {
          var allowedChildren = []
          item.children.forEach(function (c) {
            if (c.id) {
              if (me.$store.state.user.modules.includes(c.id)) {
                allowedChildren.push(c)
              }
            } else {
              allowedChildren.push(c)
            }
          })
          item.children = allowedChildren
        }
        if (me.$store.state.user.modules.includes(item.id) || (item.children && item.children.length > 0)) { items.push(item) }
      })
      console.log(items)
      return items
    }
  }
}
</script>
