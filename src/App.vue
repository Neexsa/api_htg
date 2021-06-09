<template>
  <v-app id="app">
    <base-spinner/>
    <base-navigation/>
    <v-content class="ma-4">
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import BaseNavigation from './components/global/BaseNavigation.vue'
import BaseSpinner from './components/global/BaseSpinner.vue'
export default {
  name: 'App',
  components: { BaseNavigation, BaseSpinner },
  data () {
    return {
      rota: window.rota
    }
  }
}
</script>

<style lang="scss">
  #app {
      color: var(--dark-low);
      background-color: var(--light-gray);
    }
</style>
