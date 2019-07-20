<template>
    <div class="align-items-center">
        <header class="app-header navbar setup-header">
            <b-link class="navbar-brand" to="#"></b-link>
            <b-dropdown id="ddown-divider" variant="link" class="m-2 pull-right">
                <template slot="button-content"><i class="fa fa-user"></i></template>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item-button @click="logOut">Wyloguj</b-dropdown-item-button>
            </b-dropdown>
        </header>
        <div class="app-body">
            <div class="container">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import {Account} from '../api'
export default {
  name: 'setup',
  methods: {
    logOut () {
      Account.logout()
    }
  }
}
</script>
<style>
    header.setup-header {
        flex-direction: row-reverse!important;
    }
</style>
