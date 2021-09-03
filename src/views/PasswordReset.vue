<template>
  <v-sheet class="d-flex justify-center align-center" height="100vh" width="100%" color="transparent">
    <v-sheet class="d-flex flex-column justify-space-between align-center" color="rgba(232, 232, 232, 0.9)" elevation="5" height="450" width="300" rounded >
      <v-sheet class="d-flex flex-column justify-center align-center" color="transparent" height="90%">
        <v-form v-if="passwordResetForm" class="pa-5" ref="form" @submit.prevent="resetPassword">
          <v-container>
            <h2 class="d-flex justify-center mb-5">Resetează-ți parola</h2>
            <v-text-field 
              label="Adresă e-mail" 
              type="email" 
              prepend-inner-icon="mdi-account"
              :value="email"
              :rules="emailRule"
              v-model="email"
              validate-on-blur>
            </v-text-field>
            <div class="d-flex justify-center mt-5">
              <v-btn class="px-3" type="submit" 
              color="rgba(100, 199, 232, 0.7)" elevation="5" 
              width="fit-content" :disabled="loading">
                Resetează parola
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
          v-if="passwordResetSuccess"
          color="transparent" 
          width="fit-content" 
          height="fit-content" 
          class="d-flex flex-column justify-center align-center" >
          <img src="../assets/nurse.png" height="250" alt="smile">
          <p class="grey--text text-darken-1 ma-0 text-center">
            Tocmai ți-am trimis un e-mail cu instrucțiuni de resetare a parolei.
            <br>
            Te rog verifică-ți inbox-ul.
          </p>
        </v-sheet>
      </v-sheet>

      <v-sheet class="d-flex justify-start pb-2 pl-1" width="100%" color="transparent">
        <v-btn text class="pa-1" @click.prevent="goToLogin">
          <v-icon v-if="showArrow" class="pr-1" color="#6a6a69">mdi-arrow-left-thick</v-icon>
          <v-progress-circular v-if="loadingBackLogin" class="mr-2" indeterminate color="#00ACC1" size="25"></v-progress-circular>
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
import { sendPasswordResetEmail  } from 'firebase/auth'

export default {
  name: 'PasswordReset',
  data: () => ({
    email: null,
    emailRule: [
      (val) => !!val || 'Adresa e-mail lipsește',
      (val) => !val || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Adresă e-mail invalidă'
    ],
    showArrow: true,
    loading: false,
    loadingBackLogin: false,
    passwordResetForm: true,
    passwordResetSuccess: false
  }),
  methods: {
    async resetPassword() {
      const formIsValid = this.$refs.form.validate();

      if(formIsValid) {
        try {
          await sendPasswordResetEmail(auth, this.email)
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.passwordResetForm = false
            this.passwordResetSuccess = true
          }, 2000)

        } catch (error) {
          this.emailRule = ['Această adresă e-mail nu există', ...this.emailRule]
          setTimeout(() => {
            this.emailRule.shift()
          }, 1000)
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