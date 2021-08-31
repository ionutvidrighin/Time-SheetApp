<template>
    <v-sheet class="d-flex justify-center align-center" height="100vh" width="100%" color="transparent">
    <v-sheet class="d-flex flex-column justify-space-between align-center" color="rgba(232, 232, 232, 0.9)" elevation="5" height="450" width="300" rounded >
      <v-form class="pa-5" ref="form" @submit.prevent="submitAccountRegistration">
        <v-container>
          <h2 class="d-flex justify-center mb-5">Crează cont nou</h2>
          <v-text-field 
            label="Adresă e-mail" 
            type="email" 
            prepend-inner-icon="mdi-account"
            :value="email"
            :rules="emailRule"
            v-model="email"
            validate-on-blur>
          </v-text-field>
          <v-text-field 
            label="Parolă" 
            type="password" 
            prepend-inner-icon="mdi-lock"
            :value="password"
            :rules="passwordRule"
            v-model="password"
            validate-on-blur>
          </v-text-field>
          <v-text-field 
            label="Confirmă parola" 
            type="password" 
            prepend-inner-icon="mdi-lock"
            :value="repeatPassword"
            :rules="repeatPasswordRule"
            v-model="repeatPassword" >
          </v-text-field>
          <div class="d-flex justify-center mt-5">
            <v-btn type="submit" color="rgba(100, 199, 232, 0.7)" elevation="5" width="80%">
              Înregistrează-te
            </v-btn>
          </div>
        </v-container>
      </v-form>
      <v-sheet class="d-flex justify-start pb-2 pl-1" width="100%" color="transparent">
        <v-btn text class="pa-1" @click.prevent="goToLogin">
          <v-icon class="pr-1" color="#6a6a69">mdi-arrow-left-thick</v-icon>
          <p class="ma-0 cyan--text text-accent-3 text-capitalize">
            Înapoi 
            <span class="text-lowercase">la </span> 
            <span class="text-uppercase">login</span> 
          </p>
        </v-btn>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script>
import { auth } from '../firebase'
import { createNewAccount } from '../firebase/utils'

export default {
  name: 'Registration',
  data: () => ({
    email: null,
    password: null,
    repeatPassword: null,
    emailRule: [
      (val) => !!val || 'Adresa e-mail lipsește',
      (val) => !val || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Adresă e-mail invalidă'
    ],
    passwordRule: [
      (val) => !!val || 'Parola lipsește' 
    ],
    repeatPasswordRule: [
      (val) => !!val || 'Parola lipsește' 
    ]
  }),
  methods: {
    submitAccountRegistration() {
      const formIsValid = this.$refs.form.validate();
      if (this.password != this.repeatPassword) {
        this.repeatPasswordRule = ['Parolele nu se potrivesc']
        return
      }
      if(formIsValid) {
        createNewAccount(auth, this.email, this.password)
      }
    },
    goToLogin(){
      this.$router.push({path: '/'})
    }
  }
}
</script>

<style>

</style>