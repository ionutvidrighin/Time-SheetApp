<template>
  <div class="px-5 d-flex justify-center align-center">
    <v-btn @click.prevent="fetchData" class="px-2">
      <span class="text-capitalize mr-1">Exportă</span> 
      <span class="text-capitalize"> Excel</span>
    </v-btn>
  </div>
</template>

<script>
import { dataBase } from '../firebase'
import { collection, getDocs } from "firebase/firestore"; 

export default {
  name: 'ExcelExport',
  methods: {
    downloadCSV(data){
      const today = new Date().toLocaleDateString('ro-RO', { year: 'numeric', month: 'long' }).toUpperCase()
      const blob = new Blob([data], {type: 'text/csv'})
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Pontaj_Imed - ${today}.csv`)
      link.click()
    },

    objectToCSV(data){
      const csvRows = []
      const capTabel = Object.keys(data[0])
      csvRows.push(capTabel.join(','))

      for (let row of data) {
        const continutTabel = capTabel.map(header => {
          return row[header]
        })
        csvRows.push(continutTabel.join(','))
      }

      return csvRows.join('\n')
    },

    async fetchData(){
      let dataFromDB = []
      let dataToExport
      const querySnapshot = await getDocs(collection(dataBase, "events"))
      querySnapshot.forEach( (doc) => {
        
        dataFromDB.push(doc.data())

        dataToExport = dataFromDB.map( (row) => ({
          NUME: row.user,
          DATA_PONTAJ: row.start,
          INTERVAL_ORAR: row.interval,
          ORE: row.hours,
          MINUTE: row.minutes
        }))
      })

      const csvData = this.objectToCSV(dataToExport)

      this.downloadCSV(csvData)
    }
  }
}
</script>

<style>

</style>