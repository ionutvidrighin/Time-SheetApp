<template>
  <v-app>
    <v-main>
    <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { dataBase } from './firebase'
import { collection, getDocs } from "firebase/firestore";

export default {
  name: 'App',
  created(){
    const getDataFromDB = async () => { 
      const querySnapshot = await getDocs(collection(dataBase, "events"));
      querySnapshot.forEach( (doc) => {
        this.$store.dispatch('storeEvent', doc.data())
      })
    }
    getDataFromDB()
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
