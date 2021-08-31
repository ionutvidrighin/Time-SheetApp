<template>
  <v-row justify="center">
    <v-dialog v-model="toggleDialog" persistent max-width="350">
      <v-sheet width="350" height="330px">
        <v-sheet width="100%" height="70px" class="text-h5 d-flex align-center justify-center">
          <p class="mb-1"> Adaugă pontaj nou: </p> 
        </v-sheet>
        <v-divider></v-divider>

        <v-form @submit.prevent="submitEntry" ref="form">
          <v-menu>
            <template v-slot:activator="{ on }">
              <v-sheet class="pa-0 ma-auto" width="80%">
                <v-text-field 
                  :value="date"
                  single-line
                  v-on="on" 
                  label="Dată pontaj" 
                  prepend-icon="mdi-calendar"
                  class="text-input"
                  :rules="dateRule">
                </v-text-field>
              </v-sheet>
            </template>
            <v-date-picker v-model="date" first-day-of-week="1" elevation="15" color="#e8a92a" ></v-date-picker>
          </v-menu>

          <v-sheet class="d-flex" width="100%" height="50px">
            <v-text-field 
              label="Oră început" 
              type="time" 
              class="pa-3"
              :value="startHour"
              v-model="startHour"
              :rules="hoursRule" >
            </v-text-field>
            <v-text-field 
              label="Oră sfârșit" 
              type="time" 
              class="pa-3"
              :value="endHour"
              v-model="endHour"
              :rules="hoursRule"  >
            </v-text-field>
          </v-sheet>

          <v-sheet class="py-3 ma-auto" width="80%" height="60px">
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-sheet class="pa-0 ma-auto" width="80%">
                  <v-text-field
                    v-on="on" 
                    :value="color ? color.hex : ''"
                    :rules="colorRule"
                    label="Culoare"
                    prepend-icon="mdi-format-color-fill">
                  </v-text-field>
                </v-sheet>
              </template>
              <v-color-picker v-model="color" mode="hexa" dot-size="20" width="200" canvas-height="110">
              </v-color-picker>
            </v-menu>
          </v-sheet>
          
          <v-divider class="mt-5 mb-3"></v-divider>

          <v-sheet width="100%" class="d-flex">
            <v-sheet class="d-flex justify-center align-center" width="90%">
              <v-btn color="light-blue lighten-3" type="submit" :disabled="loading">
                <p class="mb-0">confirmă pontaj</p>
                <v-progress-circular v-if="loading" indeterminate color="#02c782" size="25" class="ml-1">
                </v-progress-circular>
              </v-btn>
            </v-sheet>
            <v-sheet class="d-flex justify-end closeBox" @click="closeBox">
              <v-icon class="align-self-center">mdi-close-box</v-icon>
            </v-sheet>
          </v-sheet>
        </v-form>

      </v-sheet>
    </v-dialog>
  </v-row>
</template>

<script>

export default {
  name: 'LaterDateDialog',
  props: ['addForOtherDate'],
  data: () => ({
    loading: false,
    date: null,
    startHour: null,
    endHour: null,
    color: null,
    dateRule: [
      (value) => (value != null) || "Nicio dată aleasă"
    ],
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
    closeBox(){
      this.$store.commit('updateAddForLater')
    },
    submitEntry() {

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
          let timeDifference = endDate.getTime() - startDate.getTime()
          let milliseconds = timeDifference
          hoursDifference = Math.floor(milliseconds / 1000 / 60 / 60)
          milliseconds -= hoursDifference * 1000 * 60 * 60
          minutesDifference = Math.floor(milliseconds / 1000 / 60)

          this.loading = true

          setTimeout(() => {
            this.loading = false
            this.$store.commit('updateAddForLater')
            const event = {
              start: this.date,
              name: `(${this.startHour} - ${this.endHour}) - ${hoursDifference} ore și ${minutesDifference} minute`,
              end: this.date,
              color: this.color.hex
            }
            this.$store.dispatch('storeEvent', event)
            this.date = null
            this.startHour = null
            this.endHour = null
          }, 2000)
        }
      }
    }
  },
  computed: {
    toggleDialog: {
      get(){
        return this.$store.state.addForLater
      },
      set(){
        this.$store.commit('updateAddForLater')
      }
    }
  }
}
</script>

<style>
  .v-date-picker-header {
    padding: 0 !important;
  }

  input[type="time"] {
    font-style: italic;
    font-weight: 500;
    font-size: .8rem;
    padding-left: 1rem;
  }

  input[type="time"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    width: 25px;
    height: 25px;
    background-color: #81D4FA;
    border-radius: 50%;
    margin: .5rem 0;
  }

  .closeBox {
    cursor: pointer;
  }
</style>