<template>
    <div class="align-items-center">
        <header class="app-header navbar setup-header">
            <b-link class="navbar-brand" to="#"></b-link>
            <button class="btn-link mr-2" @click="logOut">Wyloguj</button>
        </header>
        <div class="app-body">
            <div class="container">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>

export default {
  name: 'mobile'
}
</script>
