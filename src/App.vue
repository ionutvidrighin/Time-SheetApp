<template>
  <v-app>
    <v-main>
    <router-view />
    </v-main>
  </v-app>
</template>

<script>
// import Login from './components/Login';

export default {
  name: 'App',
  components: {
    // Login
  },
  data () {
    return {
      calendar: false,
      login: false
    }
  },
  methods: {
    toggle() {
      return this.calendar = !this.calendar
    }
  }
}
</script>

<style lang="scss">

  .v-application--wrap {
    height: 100vh;
    width: 100%;
    background-image: url('./assets/background.jpg');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  
</style>
