<template>
  <v-sheet class="d-flex justify-center align-center" height="100vh" width="100%" color="transparent">
    <v-sheet class="d-flex flex-column justify-space-around align-center login-box" color="rgba(232, 232, 232, 0.9)" elevation="5" height="450" width="300" rounded >
      <v-form class="pa-2" @submit.prevent="login" ref="form">
        <v-container>
          <h2 class="d-flex justify-center mb-5">Login</h2>
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
          <div class="d-flex justify-end mt-3" @click="goToResetPassw">
            <p class="forgot_pass mb-2">Ai uitat parola?</p>
          </div>
          <div class="d-flex justify-center mt-2">
            <v-btn type="submit" color="rgba(100, 199, 232, 0.7)" elevation="5" width="80%" :disabled="loading">
              <v-icon left>mdi-login</v-icon>
              Login
              <v-progress-circular v-if="loading" class="ml-5" indeterminate color="#00ACC1" size="25"></v-progress-circular>
            </v-btn>
          </div>

          <v-sheet color="transparent mt-5">
            <v-btn @click.prevent="loginWithGoogle" elevation="5" 
              color="rgba(100, 199, 232, 0.7)" class="px-1 mb-2 d-flex justify-start" 
              width="210" :disabled="loading">
              <v-sheet rounded color="white" width="27" height="27" class="d-flex justify-center align-center">
                <img src="../assets/google.png" width="25" height="25" alt="logo">
              </v-sheet>
              <p class="caption ma-0 px-2 font-weight-medium text-lowercase">
                <span class="text-capitalize">C</span>onectează-te cu 
                <span class="text-capitalize">G</span>oogle
              </p>
            </v-btn>
          </v-sheet>
        </v-container>
      </v-form>

      <v-sheet width="100%" class="d-flex justify-end pa-2" color="transparent">
        <v-btn text class="pa-1" @click.prevent="goToRegister" :disabled="loading">
          <p class="ma-0 cyan--text text-accent-3 text-lowercase pr-2">
            <span class="text-capitalize">Crează</span> cont nou
          </p>
          <v-icon v-if="showArrow" class="pr-1" color="#6a6a69">mdi-arrow-right-thick</v-icon>
          <v-progress-circular v-if="loadingRegister" class="ml-2" indeterminate color="#00ACC1" size="25"></v-progress-circular>
        </v-btn>
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script>
import { auth } from '../firebase'
import { 
signInWithPopup, 
GoogleAuthProvider } from 'firebase/auth'
import API from '../firebase/utils'

export default {
  name: 'Login',
  data: () => ({
    email: null,
    password: null,
    emailRule: [
      (val) => !!val || 'Adresa e-mail lipsește',
      (val) => !val || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Adresă e-mail invalidă'
    ],
    passwordRule: [
      (val) => !!val || 'Parola lipsește'
    ],
    loading: false,
    loadingRegister: false,
    showArrow: true
  }),
  methods: {
    goToRegister(){
      this.loadingRegister = true
      this.showArrow = false
      setTimeout(() => {
        this.loadingRegister = false
        this.$router.push({path: '/register'})
      }, 1600)
    },
    goToResetPassw() {
      this.$router.push({path: '/reset'})
    },
    async login() {
      const formIsValid = this.$refs.form.validate();

      if (formIsValid) {      
        try {
          const response = await API.loginUser(this.email, this.password)
          console.log(response)
          const user = {
            logged: true,
            uid: response.user.uid,
            email: response.user.email,
            avatar: response.user.photoURL
          }
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.$store.dispatch('logUserIn', user)
            this.$router.push({path: '/home'})
            this.email = null
            this.password = null
          }, 1600)
        } catch (error) {
          console.log(error)
          const wrongPass = 'auth/wrong-password'
          const wrongEmail = 'auth/user-not-found'

          switch(error.code) {
            case wrongPass:
              this.passwordRule = ['Parolă incorectă', ...this.passwordRule]
              setTimeout(() => {
                this.passwordRule.shift()
              }, 500)
            break
            case wrongEmail: 
              this.emailRule = ['Adresă e-mail incorectă', ...this.emailRule]
              setTimeout(() => {
                this.emailRule.shift()
              }, 500)
            break
          }
        }
      }
    },
    async loginWithGoogle(){
      const provider = new GoogleAuthProvider()
      try {
        const response = await signInWithPopup(auth, provider)
        const user = {
          logged: true,
          uid: response.user.uid,
          email: response.user.email,
          avatar: response.user.photoURL
        }
        console.log(user)
        this.$store.dispatch('logUserIn', user)
        this.$router.push({path: '/home'})
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>


<style scoped lang="scss">  
  .v-btn__content {
    color: white !important;
  }

  .forgot_pass {
    user-select: none;
    margin: -1rem 0rem 2rem 0;
    font-family: 'Quicksand', sans-serif;
    font-style: italic;
    font-size: .9rem;
    &:hover {
      color: rgba(100, 199, 232, 0.7);
      cursor: pointer;
    }
  }

  .login-box {
    background-image: linear-gradient(rgba(255,255,255, .9), rgba(255,255,255, .9)), url('../assets/nurse.png');
    background-position: center;
    background-size: cover;
  }
</style>
