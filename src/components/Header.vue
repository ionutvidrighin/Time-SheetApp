<template>
  <v-sheet class="d-flex justify-center align-center" color="#00e3fc" width="100%" height="10vh">
    <v-sheet class="d-flex align-center justify-space-between" height="85%" width="99.5%" color="rgba(255, 255, 255, 0.3)" elevation="3" rounded>
      <v-sheet class="d-flex bla bla" height="100%" width="fit-content" color="transparent">
        <v-sheet class="d-flex justify-center align-center" height="100%" width="100px" color="transparent">
          <v-avatar>
            <img
              :src="setAvatar"
              alt="John" >
          </v-avatar>
        </v-sheet>
        <v-sheet class="d-flex justify-space-between" height="100%" width="250px" color="transparent">
          <div class="d-flex flex-column justify-center align-start" style="height: 100%">
            <p class="ma-0">Bun venit,</p>
            <p class="ma-0 align-self-center font-weight-bold">
              {{ capitalizeName(manipulateName(getUserData.email))  }}
            </p>
          </div>

          <div class="d-flex justify-center align-center" style="height: 100%">
            <v-row justify="center">
              <v-dialog v-model="toggleDialog" persistent max-width="350">

                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" >
                    <p class="text-capitalize mb-0"> Adaugă pontaj </p>
                  </v-btn>
                </template>

                <v-sheet width="350" height="340" style="overflow-x: hidden">
                  <v-sheet width="100%" height="70px" class="text-h5 d-flex flex-column align-center justify-center" style="position: relative">
                    <p class="mb-1 subtitle-1"> Adaugă pontaj nou pentru azi, </p> 
                    <p class="mb-0 subtitle-1 font-weight-medium light-blue--text text--lighten-1">
                      {{ new Date().toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
                    </p>
                    <div class="close-btn">
                      <v-icon class="align-self-center" @click.prevent="closeBox">mdi-close-box</v-icon>
                    </div>
                  </v-sheet>

                  <v-divider></v-divider>

                    <v-form @submit.prevent="submitCurrentEntry" ref="form">
                      <v-sheet class="d-flex" width="100%">
                        <v-text-field 
                          label="Oră început" 
                          type="time" 
                          class="pa-4"
                          :value="startHour"
                          v-model="startHour"
                          :rules="hoursRule" >
                        </v-text-field>

                        <v-text-field 
                          label="Oră sfârșit" 
                          type="time" 
                          class="pa-4"
                          :value="endHour"
                          v-model="endHour"
                          :rules="hoursRule"  >
                        </v-text-field>
                      </v-sheet>
 
                      <v-sheet class="pa-0 ma-auto" width="80%" height="fit-content">
                        <v-menu>
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              class="pa-0"
                              v-on="on" 
                              :value="color ? color.hex : ''"
                              :rules="colorRule"
                              label="Culoare"
                              prepend-icon="mdi-format-color-fill">
                            </v-text-field>
                          </template>
                          <v-color-picker v-model="color" mode="hexa" dot-size="20" width="200" canvas-height="110">
                          </v-color-picker>
                        </v-menu>
                      </v-sheet>

                      <v-divider></v-divider>

                      <v-sheet class="d-flex justify-center align-center mt-2">
                        <v-btn color="light-blue lighten-3" type="submit" :disabled="loading">
                          <p class="mb-0">confirmă pontaj</p>
                          <v-progress-circular v-if="loading" indeterminate color="#02c782" size="25" class="ml-1">
                          </v-progress-circular>
                        </v-btn>
                      </v-sheet>
                    </v-form>

                  <v-sheet class="d-flex flex-column justify-center align-center" height="fit-content" width="100%">
                    <p class="mb-0">sau</p>
                    <v-btn color="light-blue lighten-3" @click="addForLaterDate" :disabled="loading">
                      <p class="mb-0">Adaugă pentru o altă dată</p>
                    </v-btn>
                  </v-sheet>

                </v-sheet>
              </v-dialog>
            </v-row>
          </div>
        </v-sheet>
      </v-sheet>
      
      <v-sheet class="d-flex justify-center align-center" height="100%" width="200px" color="transparent">
        <v-btn @click.prevent="logoutPopUp = true">
          <p class="text-capitalize mb-0"> deconectează-</p> <span class="text-lowercase">mă</span>
        </v-btn>
      </v-sheet>
    </v-sheet>

    <v-sheet 
      v-if="logoutPopUp" rounded elevation="4" 
      class="logout-popup pa-2 d-flex flex-column justify-center align-center" 
      height="fit-content" 
      width="fit-content" 
      color="#f5f5f5">
        <p class="ma-0 font-weight-medium">Confirm deconectarea?</p>
        <v-sheet width="100%" color="transparent" class="d-flex justify-center align-center">
          <v-btn text @click.prevent="logOut">DA</v-btn>
          <v-btn text @click.prevent="logoutPopUp = false">NU</v-btn>
        </v-sheet>
    </v-sheet>

    <v-sheet v-if="this.$store.state.addForLater">
      <LaterDateDialog />
    </v-sheet>

  </v-sheet>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { auth } from '../firebase'
import LaterDateDialog from './LaterDateDialog'

export default {
  name: 'Header',
  components: {
    LaterDateDialog
  },
  data: () => ({
    logoutPopUp: false,
    loading: false,
    startHour: null,
    endHour: null,
    color: null,
    hoursRule: [
      (val) => {
        if (!val)  return 'Nicio oră selectată'
        return true
      }
    ],
    colorRule: [
      (val) => {
        if (!val) return 'Nicio culoare aleasă'
        return true
      }
    ]
  }),
  methods: {
    capitalizeName(string) {
      return string && string[0].toUpperCase() + string.slice(1)
    },
    manipulateName(string) {
      let charsToRemove = ['.', '@']

      for (let char of charsToRemove){
          string = string.split(char).join('-');
      }
      return string.split('-')[0]
    },
    closeBox(){
      this.$store.commit('updateAddForNow')
    },
    addForLaterDate(){
      this.$store.commit('updateAddForLater')
      this.$store.commit('updateAddForNow')
    },
    submitCurrentEntry(){
      const formIsValid = this.$refs.form.validate();
      if (formIsValid) {
        let startTimeHH = this.startHour.substr(0, 2)
        startTimeHH = startTimeHH.replace(/^0+/, '')
        // ------------------ //
        let startTimeMM = this.startHour.substr(3, 4)
        startTimeMM = startTimeMM.replace(/^0+/, '')

        let endTimeHH = this.endHour.substr(0, 2)
        endTimeHH = endTimeHH.replace(/^0+/, '')
        // ------------------ //
        let endTimeMM = this.endHour.substr(3, 4)
        endTimeMM = endTimeMM.replace(/^0+/, '')

        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth()
        const day = today.getDate()

        let startDate = new Date(year, month, day, startTimeHH, startTimeMM)
        let endDate = new Date(year, month, day, endTimeHH, endTimeMM)
        let hoursDifference;
        let minutesDifference;

        if (endDate < startDate) {
          console.log('error')
          this.hoursRule = ['Oră sfârșit este în trecut']
          setTimeout( () => {
            this.startHour = null
            this.endHour = null 
            this.$refs.form.reset()
            this.hoursRule = [true]
          }, 1300)
        } else {
          console.log('it works!')
          let timeDifference = endDate.getTime() - startDate.getTime()
          let milliseconds = timeDifference
          hoursDifference = Math.floor(milliseconds / 1000 / 60 / 60)
          milliseconds -= hoursDifference * 1000 * 60 * 60
          minutesDifference = Math.floor(milliseconds / 1000 / 60)

          this.loading = true

          setTimeout(() => {
            this.loading = false
            this.$store.commit('updateAddForNow')
            const event = {
              start: new Date().toISOString().substr(0, 10),
              name: `${this.capitalizeName(this.manipulateName(this.userName))} * (${this.startHour} - ${this.endHour}) - ${hoursDifference} ore și ${minutesDifference} minute`,
              end: new Date().toISOString().substr(0, 10),
              color: this.color.hex,
              user: this.capitalizeName(this.manipulateName(this.userName))
            }
          this.$store.dispatch('storeEvent', event)
          }, 2000)
        }
      }
    },
    logOut() {
      auth.signOut()
      console.log(auth)
      const user = {}
      this.$store.dispatch('logUserOut', user)
      this.$router.push({path: '/'})
    }
  },
  computed: {
    ...mapGetters(['getUserData']),
    ...mapState({
      avatar: state => state.user.avatar,
      userName : state => state.user.email,
      workedHours: state => state.user.workedHours
    }),
    setAvatar(){
      if (this.avatar) return this.avatar
      else return require('../assets/avatar.png')
    },
    toggleDialog: {
      get(){
        return this.$store.state.addForNow
      },
      set(){
        this.$store.commit('updateAddForNow')
      }
    }
  }
}
</script>

<style>
.logout-popup {
  position: absolute;
  top: 4rem;
  right: 1rem;
  z-index: 10;
}

input[type="time"]{
  cursor: pointer;
}
.close-btn {
  position: absolute;
  top: -0.39rem;
  right: 0;
  cursor: pointer;
}

.close-box {
  cursor: pointer;
}

.v-picker__body {
  width: 180px !important;
  height: fit-content !important;
}

.v-menu__content {
  min-width: unset !important;
}

.v-date-picker-table {
  height: unset !important;
}

.v-picker__title {
  display: none !important;
}

.v-date-picker-table--date .v-btn {
  height: unset !important;
  width: 25px;
}

.v-card {
  display: unset !important;
}

.v-date-picker-header__value button {
  font-size: .8rem;
  padding: 0;
}

th {
  padding: 0 !important
}

</style>