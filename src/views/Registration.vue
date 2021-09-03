<template>
    <v-sheet class="d-flex justify-center align-center" height="100vh" width="100%" color="transparent">
    <v-sheet class="d-flex flex-column justify-space-between align-center" color="rgba(232, 232, 232, 0.9)" elevation="5" height="450" width="300" rounded >
    
      <v-form v-if="registrationForm" class="pa-5" ref="form" @submit.prevent="submitAccountRegistration">
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
            <v-btn type="submit" color="rgba(100, 199, 232, 0.7)" 
              class="px-3" elevation="5" width="fit-content" :disabled="loading" >
              Înregistrează-te
              <v-progress-circular
                v-if="loading"
                class="ml-2"
                indeterminate
                color="#00ACC1"
                size="25" >
              </v-progress-circular>
            </v-btn>
          </div>
        </v-container>
      </v-form>

      <v-sheet rounded 
        v-if="accountCreated"
        color="transparent" 
        width="fit-content" 
        height="fit-content" 
        class="d-flex flex-column justify-center align-center mt-5" >
        <img src="../assets/nurse.png" height="250" alt="smile">
        <p class="grey--text text-darken-1 ma-0 text-center">
          Contul tău a fost creat cu succes !
          <br>
          Poți merge la pagina de login.
        </p>
      </v-sheet>

      <v-sheet class="d-flex justify-start pb-2 pl-1" width="100%" color="transparent">
        <v-btn text class="pa-1" @click.prevent="goToLogin">
          <v-progress-circular v-if="loadingBackLogin" class="mr-2" indeterminate color="#00ACC1" size="25"></v-progress-circular>
          <v-icon v-if="showArrow" class="pr-1" color="#6a6a69">mdi-arrow-left-thick</v-icon>
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
import { auth, dataBase } from '../firebase'
import { doc, setDoc } from "firebase/firestore"; 
import API from '../firebase/utils'

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
    ],
    loading: false,
    showArrow: true,
    loadingBackLogin: false,
    registrationForm: true,
    accountCreated: false
  }),
  methods: {
    async submitAccountRegistration() {
      const formIsValid = this.$refs.form.validate();
      if (this.password != this.repeatPassword) {
        this.repeatPasswordRule = ['Parolele nu se potrivesc', ...this.repeatPasswordRule]
        setTimeout(() => {
          this.repeatPasswordRule.shift()
        }, 500)
        return
      }

      if (formIsValid) {
        try {
          const res = await API.createNewAccount(this.email, this.password)
          this.loading = true
          console.log(res)
          console.log(auth)

          await setDoc(doc(dataBase, "users", res.user.uid), {
            id: res.user.uid,
            email: res.user.email
          })

          auth.signOut()
          console.log(auth)
          setTimeout(() => {
            this.loading = false
            this.registrationForm = false
            this.accountCreated = true
          }, 1600)
        } catch (error) {
          const weakPass = 'auth/weak-password'
          const accountExists = 'auth/email-already-in-use'

          switch(error.code) {
            case weakPass: 
              this.passwordRule = ['Te rog alege o parolă mai complexă', ...this.passwordRule]
              this.repeatPasswordRule = ['Te rog alege o parolă mai complexă', ...this.repeatPasswordRule]
              setTimeout(() => {
                this.passwordRule.shift()
                this.repeatPasswordRule.shift()
              }, 500)
            break
            case accountExists:
              this.emailRule = ['Există deja un cont cu această adresă e-mail', ...this.passwordRule]
              setTimeout(() => {
                this.emailRule.shift()
              }, 500)
            break
          }
        }
      } 
    },
    goToLogin(){
      this.loadingBackLogin = true
      this.showArrow = false
      setTimeout(() => {
        this.loadingBackLogin = false
        this.$router.push({path: '/'})
      }, 1600)
    }
  }
}
</script>

<style>

</style>