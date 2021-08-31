<template>
  <div class="d-flex flex-column">
    <Header />
    <v-sheet>
      <v-sheet height="6vh" color="transparent">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Sari la azi
          </v-btn>
  
          <v-btn fab text small color="grey darken-2" @click="prev" >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>

          <v-btn fab text small color="grey darken-2" @click="next" >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>

          <v-toolbar-title v-if="$refs.calendar" class="ml-5">
            {{ $refs.calendar.title }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
          <v-btn outlined @click="type = 'month'" color="grey darken-2">Înapoi la calendar</v-btn>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="84vh">
        <v-calendar
          show-month-on-first
          :weekdays="weekdays"
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange">
        </v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x >
          <v-card
            class="delete-entry" 
            color="grey lighten-4"
            min-width="350px"
            flat >
            <v-toolbar :color="selectedEvent.color" dark >
              <v-btn icon @click.prevent="toggleDeleteNote = true">
                <v-icon>mdi-delete-forever</v-icon>
              </v-btn>
              <v-toolbar-title class="px-5">
                Pontaj detaliat
              </v-toolbar-title>
            </v-toolbar>

            <v-sheet class="pa-2" width="250" height="fit-content" color="#f5f5f5">
                {{selectedEvent.name}}
            </v-sheet>
            <v-divider></v-divider>

            <v-sheet class="pa-1" color="#e6e6e6" elevation="2">
              <v-btn
                color="#f5f5f5"
                class="font-weight-regular caption pa-2"
                @click="selectedOpen = false" >
                <span >Î</span> 
                <span class="text-lowercase">nchide fereastra</span>
              </v-btn>
            </v-sheet>

            <v-sheet 
              v-if="toggleDeleteNote" rounded elevation="4" 
              class="delete_note-popup pa-2 d-flex flex-column justify-center align-center" 
              height="fit-content" 
              width="200" 
              color="#f5f5f5">
                <p class="ma-0 font-weight-regular body-2">Confirm ștergerea?</p>
                <v-sheet width="100%" color="transparent" class="d-flex justify-space-around mt-1 align-center">
                  <v-btn class="caption pa-1">DA</v-btn>
                  <v-btn class="caption pa-1" @click.prevent="toggleDeleteNote = false">NU</v-btn>
                </v-sheet>
            </v-sheet>

          </v-card>
        </v-menu>
      </v-sheet>
    </v-sheet>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { auth } from '../firebase'
import Header from '../components/Header.vue'

export default {
  name: 'Home',
  components: {
    Header
  },
  data: () => ({
    focus: '',
    type: 'month',
    weekdays: [1, 2, 3, 4, 5, 6, 0],
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    toggleDeleteNote: false
  }),
  created(){
    const user = {
      logged: true,
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      avatar: auth.currentUser.photoURL
    }
    this.$store.dispatch('logUserIn', user)
  },
  mounted () {
    this.$refs.calendar.checkChange();
  },
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
    weekDays(){
      let i = new Date(1).getDay(1)
      return this.ROweekdays[i]
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    addNewEntry(){

    },
    updateRange () {
      const data = this.getAllEvents
      this.events = data
    }
  },
  computed: {
    ...mapGetters(['getAllEvents']),
    ...mapState({
      getUserName: (state) => state.user.email
    })
  }
}
</script>

<style lang="css">
  .v-calendar-weekly__day-label {
    margin: 0 !important
  }

  .v-btn--fab.v-size--small {
    height: 21px;
    width: 40px;
    border-radius: .5rem !important;
  }

  header, .v-toolbar__content {
    height: 6vh !important;
  }

  .delete-entry {
    position: relative;
  }

  .delete_note-popup {
    position: absolute;
    top: 3rem;
    left: 2rem;
    z-index: 12;
  }

</style>